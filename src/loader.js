const alternatingCaseToObject = require('alternating-case-to-object');
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function parseDate(string) {
  let [day, month, year] = string.split(' ');

  try {
    // Check if month and day need to be swapped
    if (parseInt(day, 10).toString() !== day) {
      let swapper = day;
      day = month;
      month = swapper;
    }

    if (!year) year = 2017;

    MONTHS.forEach((m, index) => {
      if (typeof month === 'number') return;

      if (month.toLowerCase().indexOf(m) === 0) {
        month = index;
      }
    });
  } catch (ex) {
    return false;
  }

  return new Date(year, month, day);
}

function loadPanels() {
  if (!window._panels) {
    window._panels = [];

    const debateSection = window.__ODYSSEY__.utils.anchors.getSections('debate')[0];

    let nextConfig = alternatingCaseToObject(debateSection.configSC);
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
    debateSection.betweenNodes.forEach((node, index) => {
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
      if (index === debateSection.betweenNodes.length - 1) {
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
        if (node.className.indexOf('ImageEmbed') > -1) {
          if (!panel.picture) panel.picture = node;
          delete panel.nodes[index];
        } else if (node.tagName === 'IMG') {
          node.setAttribute('height', null);
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
