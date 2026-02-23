const routes = {
  "/": {
    title: "Dashboard",
    subtitle: "This section will be built in the next step.",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "This section will be built in the next step.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "This section will be built in the next step.",
  },
  "/saved": {
    title: "Saved",
    subtitle: "This section will be built in the next step.",
  },
  "/digest": {
    title: "Digest",
    subtitle: "This section will be built in the next step.",
  },
  "/proof": {
    title: "Proof",
    subtitle: "This section will be built in the next step.",
  },
  "__404__": {
    title: "Page Not Found",
    subtitle: "The page you are looking for does not exist.",
  },
};

function getPath() {
  return window.location.pathname || "/";
}

function findRoute(path) {
  if (routes[path]) {
    return routes[path];
  }
  return routes["__404__"];
}

function setActiveLink(path) {
  const links = document.querySelectorAll('.nav-link[data-route]');
  links.forEach((link) => {
    const route = link.getAttribute("data-route");
    if (route === path) {
      link.classList.add("nav-link--active");
    } else {
      link.classList.remove("nav-link--active");
    }
  });
}

function closeMobileMenu() {
  const mobilePanel = document.querySelector(".nav-bar__mobile-panel");
  if (mobilePanel) {
    mobilePanel.classList.remove("nav-bar__mobile-panel--open");
  }
}

function render(path) {
  const route = findRoute(path);
  const container = document.getElementById("route-container");
  if (!container || !route) return;

  container.innerHTML = `
    <section class="context-header">
      <h1 class="context-header__title">${route.title}</h1>
      <p class="context-header__subtitle">
        ${route.subtitle}
      </p>
    </section>
  `;
}

function navigate(path) {
  const currentPath = getPath();
  if (currentPath === path) {
    // Already on this path; do not re-render to avoid flicker.
    setActiveLink(path);
    closeMobileMenu();
    return;
  }

  history.pushState({ path }, "", path);
  render(path);
  setActiveLink(path);
  closeMobileMenu();
}

function handleLinkClick(event) {
  const target = event.currentTarget;
  const path = target.getAttribute("data-route");
  if (!path) return;

  event.preventDefault();
  navigate(path);
}

function setupNavigation() {
  const links = document.querySelectorAll('.nav-link[data-route]');
  links.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });

  const toggle = document.querySelector(".nav-bar__toggle");
  const mobilePanel = document.querySelector(".nav-bar__mobile-panel");
  if (toggle && mobilePanel) {
    toggle.addEventListener("click", () => {
      const isOpen = mobilePanel.classList.contains("nav-bar__mobile-panel--open");
      if (isOpen) {
        mobilePanel.classList.remove("nav-bar__mobile-panel--open");
      } else {
        mobilePanel.classList.add("nav-bar__mobile-panel--open");
      }
    });
  }
}

window.addEventListener("popstate", (event) => {
  const path = (event.state && event.state.path) || getPath();
  render(path);
  setActiveLink(path);
});

window.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  const initialPath = getPath();
  render(initialPath);
  if (routes[initialPath]) {
    setActiveLink(initialPath);
  } else {
    setActiveLink("");
  }
});

