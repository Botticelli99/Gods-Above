console.log("loading.js chargé");

let loadingDone = false;

function initLoadingScreen() {
  console.log("Initialisation du loader");

  const loader = document.getElementById("screen-loading");
  const enterBtn = document.getElementById("enter-btn");
  const loadingPct = document.getElementById("loading-pct");

  console.log("Loader :", loader);
  console.log("Bouton :", enterBtn);
  console.log("Pourcentage :", loadingPct);

  if (!loader) {
    console.error("Le loader est introuvable !");
    return;
  }

  if (sessionStorage.getItem("gaLoaderSeen") === "true") {
    console.log("Loader déjà vu, suppression.");
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

      console.log("Chargement terminé.");

      if (enterBtn) {
        enterBtn.classList.add("ready");
      }
    }

    if (loadingPct) {
      loadingPct.textContent = Math.floor(pct) + "%";
    }
  }, 60);

  window.enterSite = function () {
    console.log("Bouton Entrer cliqué.");

    if (!loadingDone) {
      console.log("Chargement pas terminé.");
      return;
    }

    sessionStorage.setItem("gaLoaderSeen", "true");

    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
      console.log("Loader supprimé.");
    }, 900);
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoadingScreen);
} else {
  initLoadingScreen();
}
