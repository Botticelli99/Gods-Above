let loadingDone = false;

window.addEventListener("DOMContentLoaded", () => {
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
      enterBtn?.classList.add("ready");
    }

    if (loadingPct) {
      loadingPct.textContent = Math.floor(pct) + "%";
    }
  }, 60);

  window.enterSite = function () {
    if (!loadingDone) return;

    sessionStorage.setItem("gaLoaderSeen", "true");
    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
    }, 900);
  };
});
