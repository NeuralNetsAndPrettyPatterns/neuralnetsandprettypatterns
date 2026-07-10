(function () {
  "use strict";

  var script = document.currentScript;
  var navContainer = script ? script.parentElement : null;

  if (!navContainer || !navContainer.classList.contains("dynamic-dds-nav")) {
    console.error("DDS navigation container was not found.");
    return;
  }

  var navigationUrl =
    "https://neuralnetsandprettypatterns.com/deepdreamstate/navigation.json";

  fetch(navigationUrl, {
    cache: "no-store"
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          "Navigation request failed with status " + response.status
        );
      }

      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.buttons)) {
        throw new Error("Navigation JSON does not contain a buttons array.");
      }

      data.buttons.forEach(function (button) {
        if (!button || !button.label || !button.url) {
          return;
        }

        var link = document.createElement("a");

        link.className = "nav-button text-btn";
        link.href = button.url;
        link.textContent = button.label;
        link.setAttribute(
          "aria-label",
          button.ariaLabel || button.label
        );

        navContainer.appendChild(link);
      });
    })
    .catch(function (error) {
      console.error("DDS navigation could not be loaded:", error);
    });
})();
