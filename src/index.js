const { h, render } = require("preact");
const { loadSection } = require("./loader");
import { selectMounts } from "@abcnews/mount-utils";

/**
   * Transforms PL mount points back into Phase 1 style anchor tags.
   * Useful for porting old stories to support rendering in PL.
   * eg. <div id="hashname"></div> ----> <a name="hashname"> </a>
   */
function backtransformMounts() {
  const mounts = selectMounts();

  mounts.forEach(mount => {
    const anchorEl = document.createElement("a");
    anchorEl.name = mount.id;
    anchorEl.innerHTML = " ";

    // replace element
    mount.parentNode.replaceChild(anchorEl, mount);
  });
}

const root = document.querySelector("[data-interactive-disrespectful-debate-root]");

function init() {
  backtransformMounts();

  const section = loadSection();

  const App = require("./components/App");
  render(
    <App panels={section.panels} />,
    section.mountNode,
    section.mountNode.firstChild
  );
}

if (module.hot) {
  module.hot.accept("./components/App", () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require("./components/ErrorBox");
      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === "development") {
  require("preact/devtools");
  console.debug(
    `[interactive-disrespectful-debate] public path: ${__webpack_public_path__}`
  );
}

if (window.__ODYSSEY__) {
  init();
} else {
  window.addEventListener("odyssey:api", init);
}
