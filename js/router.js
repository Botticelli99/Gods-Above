const routes = {
  accueil: "accueil.html",
  magie: "magie.html",
  chronologie: "chronologie.html",
  race: "race.html",
  unite: "unité.html",
  creation: "creation-personnage.html"
};

const app = document.querySelector("#app");

async function loadRoute(route) {
  const file = routes[route] || routes.accueil;

  const response = await fetch(file);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  app.innerHTML = doc.body.innerHTML;
  window.scrollTo(0, 0);
}

function getRoute() {
  return location.hash.replace("#/", "") || "accueil";
}

window.addEventListener("hashchange", () => {
  loadRoute(getRoute());
});

document.addEventListener("DOMContentLoaded", () => {
  loadRoute(getRoute());
});
