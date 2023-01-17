const { h, render } = require("preact");
const { loadSection } = require("./loader");

const root = document.querySelector("[data-interactive-disrespectful-debate-root]");

function init() {
  console.log("hello");
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
