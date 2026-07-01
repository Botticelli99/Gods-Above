const GA_ROUTES = {
  accueil: {
    title: "Gods Above — Accueil",
    file: "pages/accueil.html"
  },
  magie: {
    title: "Magie & Systèmes — Gods Above",
    file: "pages/magie.html"
  },
  chronologie: {
    title: "Gods Above — Chronologie & Histoire",
    file: "pages/chronologie.html"
  },
  race: {
    title: "Gods Above — Race & Lignées",
    file: "pages/race.html"
  },
  unite: {
    title: "Gods Above — Unités",
    file: "pages/unite.html"
  },
  creation: {
    title: "Gods Above — Création de personnage",
    file: "pages/creation.html"
  }
};

const GA_ALIASES = {
  "index.html": "accueil",
  "accueil.html": "accueil",
  "magie.html": "magie",
  "chronologie.html": "chronologie",
  "race.html": "race",
  "unité.html": "unite",
  "unite.html": "unite",
  "creation-personnage.html": "creation"
};

const app = document.querySelector("#ga-app");

function getRouteFromHash() {
  return location.hash.replace("#/", "").split("#")[0] || "accueil";
}

function normalizeRoute(route) {
  return GA_ROUTES[route] ? route : "accueil";
}

function rewriteInternalLinks(container) {
  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#/")) return;
    if (href.startsWith("#")) return;
    if (href.startsWith("http://") || href.startsWith("https://")) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const [file, anchor] = href.split("#");
    const cleanFile = file.split("/").pop();

    if (GA_ALIASES[cleanFile]) {
      const target = "#/" + GA_ALIASES[cleanFile] + (anchor ? "#" + anchor : "");
      link.setAttribute("href", target);
      link.setAttribute("data-spa-link", "true");
      link.setAttribute("data-route", GA_ALIASES[cleanFile]);
    }
  });
}

function setActiveNavigation(route) {
  document.querySelectorAll("[data-route]").forEach(link => {
    link.classList.toggle("active", link.dataset.route === route);
  });
}

function exportPageFunctionsToWindow(scriptText) {
  const names = [...scriptText.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)]
    .map(match => match[1]);

  if (!names.length) return "";

  return `
    try {
      Object.assign(window, {
        ${names.map(name => `${name}: typeof ${name} !== "undefined" ? ${name} : undefined`).join(",\n        ")}
      });
    } catch (error) {
      console.warn("Export des fonctions de page impossible :", error);
    }
  `;
}

function executePageScripts(container) {
  container.querySelectorAll("script").forEach(oldScript => {
    const newScript = document.createElement("script");

    [...oldScript.attributes].forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });

    if (oldScript.src) {
      oldScript.replaceWith(newScript);
      return;
    }

    const originalCode = oldScript.textContent || "";
    const exportsCode = exportPageFunctionsToWindow(originalCode);

    newScript.textContent = `
      (() => {
        ${originalCode}
        ${exportsCode}
      })();
    `;

    oldScript.replaceWith(newScript);
  });
}

async function loadRoute(routeName) {
  const route = normalizeRoute(routeName);
  const config = GA_ROUTES[route];

  try {
    app.classList.add("is-loading");

    const response = await fetch(config.file);
    if (!response.ok) throw new Error("Page introuvable : " + config.file);

    const html = await response.text();

    app.innerHTML = html;
    rewriteInternalLinks(app);
    executePageScripts(app);

    document.title = config.title;
    setActiveNavigation(route);

    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="page-placeholder">
        <h1>Erreur de chargement</h1>
        <p>${error.message}</p>
      </section>
    `;
  } finally {
    app.classList.remove("is-loading");
  }
}

window.addEventListener("hashchange", () => {
  loadRoute(getRouteFromHash());
});

document.addEventListener("DOMContentLoaded", () => {
  loadRoute(getRouteFromHash());
});