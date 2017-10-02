const alternatingCaseToObject = require('alternating-case-to-object');
const MONTHS = [null, 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function parseDate(string) {
  let [day, month, year] = string.split(' ');

  if (parseFloat(day).toString() !== day) return false;

  if (!year) year = 2017;

  MONTHS.forEach((m, index) => {
    if (typeof month === 'number') return;

    if (month.toLowerCase().indexOf(m) === 0) {
      month = index;
    }
  });

  return new Date(year, month, day);
}

/**
 * Get the content between section markers
 * @param {string} name
 * @return {object}
 */
function getSection(name) {
  // Grab the start
  const startNode = document.querySelector(`a[name^="${name}"`);

  let section = {
    name,
    config: alternatingCaseToObject(startNode.getAttribute('name').slice(name.length)),
    startNode,
    nodes: []
  };

  let hasMore = true;
  let nextNode = startNode.nextElementSibling;
  while (hasMore && nextNode) {
    if (nextNode.tagName && (nextNode.getAttribute('name') || '').indexOf(`end${name}`) === 0) {
      hasMore = false;
    } else {
      section.nodes.push(nextNode);
    }

    nextNode = nextNode.nextElementSibling;
  }

  section.endNode = nextNode;

  return section;
}

function loadPanels() {
  if (!window._panels) {
    window._panels = [];

    const debateSection = getSection('debate');

    let nextConfig = debateSection.config;
    let nextNodes = [];
    let idx = 0;
    let nextType = '';

    // Commit the current nodes to a marker
    function pushPanel() {
      if (nextNodes.length === 0) return;

      window._panels.push({
        idx: idx++,
        type: nextType,
        config: nextConfig,
        nodes: nextNodes,
        section: debateSection
      });
      nextNodes = [];
    }

    // find each 'yes' or 'no' and split them into panels
    debateSection.nodes.forEach((node, index) => {
      if (node.tagName && node.tagName.toLowerCase() === 'a' && node.getAttribute('name')) {
        pushPanel();

        nextType = node.getAttribute('name').indexOf('yes') === 0 ? 'yes' : 'no';

        // If marker has no config then just use the previous config
        let configString = node
          .getAttribute('name')
          .replace(/^yes/, '')
          .replace(/^no/, '');
        if (configString) {
          nextConfig = alternatingCaseToObject(configString);
        } else {
          // Empty marks should stop the piecemeal flow
          nextConfig = {};
        }
      } else if (node.tagName) {
        // It's content
        nextNodes.push(node);
        // Remove this node from the DOM
        node.parentNode.removeChild(node);
      }

      // Any trailing nodes just get added as a last marker
      if (index === debateSection.nodes.length - 1) {
        pushPanel();
      }
    });

    window._panels = window._panels.map(panel => {
      // Read the date, if there is one
      panel.date = parseDate(panel.nodes[0].innerText);
      if (panel.date) {
        delete panel.nodes[0];
      }

      // Check for an images
      panel.nodes.forEach((node, index) => {
        if (node.querySelector('img')) {
          if (!panel.imageUrl) panel.imageUrl = node.querySelector('img').src;
          delete panel.nodes[index];
        }
      });

      // Check the link
      const lastNode = panel.nodes[panel.nodes.length - 1];
      if (lastNode && lastNode.innerHTML.indexOf('<a') === 0) {
        panel.link = lastNode.firstElementChild.href;
        delete panel.nodes[panel.nodes.length - 1];
      }

      return panel;
    });
  }

  return window._panels;
}

module.exports = { loadPanels };
