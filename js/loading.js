let loadingDone = false;

function initLoadingScreen() {
  const loader = document.getElementById("screen-loading");
  const enterBtn = document.getElementById("enter-btn");
  const loadingPct = document.getElementById("loading-pct");

  if (!loader) return;

  if (sessionStorage.getItem("gaLoaderSeen") === "true") {
    loader.remove();
    return;
  }

  let pct = 0;

  const loadInterval = setInterval(() => {
    pct += Math.random() * 4 + 1;

    if (pct >= 100) {
      pct = 100;
      clearInterval(loadInterval);
      loadingDone = true;

      if (enterBtn) {
        enterBtn.classList.add("ready");
      }
    }

    if (loadingPct) {
      loadingPct.textContent = Math.floor(pct) + "%";
    }
  }, 60);

  window.enterSite = function () {
    sessionStorage.setItem("gaLoaderSeen", "true");
    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
    }, 900);
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoadingScreen);
} else {
  initLoadingScreen();
}
