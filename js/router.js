const routes = {
  accueil: "accueil.html",
  chronologie: "chronologie.html",
  magie: "magie.html",
  race: "race.html",
  unite: "unité.html",
  creation: "creation-personnage.html"
};

const app = document.getElementById("app");

async function loadPage(routeName) {
  const file = routes[routeName] || routes.accueil;

  try {
    const response = await fetch(file);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const bodyContent = doc.body.innerHTML;
    app.innerHTML = bodyContent;

    document.querySelectorAll("[data-route]").forEach(link => {
      link.classList.toggle("active", link.dataset.route === routeName);
    });

    window.scrollTo(0, 0);
  } catch (error) {
    app.innerHTML = "<h1>Erreur de chargement</h1><p>La page n'a pas pu être chargée.</p>";
    console.error(error);
  }
}

function getRouteFromHash() {
  return location.hash.replace("#/", "") || "accueil";
}

window.addEventListener("hashchange", () => {
  loadPage(getRouteFromHash());
});

document.addEventListener("DOMContentLoaded", () => {
  loadPage(getRouteFromHash());
});
