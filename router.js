const routes = {
  "/": {
    title: "Stop Missing The Right Jobs.",
    subtitle: "Precision-matched job discovery delivered daily at 9AM.",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "No jobs yet. In the next step, you will load a realistic dataset.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Preference fields are placeholders only. Nothing is saved yet.",
  },
  "/saved": {
    title: "Saved",
    subtitle: "Clean, calm space for jobs you mark to review again later.",
  },
  "/digest": {
    title: "Digest",
    subtitle: "A daily summary of relevant jobs will appear here in a future step.",
  },
  "/proof": {
    title: "Proof",
    subtitle: "Placeholder area for collecting artifacts and evidence.",
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
  const container = document.getElementById("route-container");
  if (!container) return;

  const route = findRoute(path);

  if (!routes[path]) {
    // 404 page
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${route.title}</h1>
        <p class="context-header__subtitle">
          ${route.subtitle}
        </p>
      </section>
    `;
    return;
  }

  if (path === "/") {
    // Landing page
    container.innerHTML = `
      <section class="context-header landing-header">
        <h1 class="context-header__title">${routes["/"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/"].subtitle}
        </p>
        <div class="landing-header__cta">
          <button class="btn btn-primary" type="button" onclick="navigate('/settings')">
            Start Tracking
          </button>
        </div>
      </section>
    `;
    return;
  }

  if (path === "/settings") {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/settings"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/settings"].subtitle}
        </p>
      </section>
      <section class="workspace-row">
        <section class="primary-workspace" aria-label="Settings preferences">
          <article class="card">
            <header>
              <h2 class="card__title">Notification preferences</h2>
              <p class="card__subtitle text-block">
                These fields are placeholders. In a later step, they will shape how your daily job notifications behave.
              </p>
            </header>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="role-keywords">Role keywords</label>
                <span class="field__hint">For example: frontend engineer, data analyst, product designer.</span>
                <input id="role-keywords" type="text" placeholder="Enter role keywords" />
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="preferred-locations">Preferred locations</label>
                <span class="field__hint">City names, regions, or leave open for any location.</span>
                <input id="preferred-locations" type="text" placeholder="Enter preferred locations" />
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="mode">Mode</label>
                <span class="field__hint">Choose how you prefer to work.</span>
                <select id="mode">
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>Onsite</option>
                </select>
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="experience-level">Experience level</label>
                <span class="field__hint">Use the option that best matches your profile today.</span>
                <select id="experience-level">
                  <option>Entry</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
              </div>
            </div>
          </article>
        </section>
        <aside class="secondary-panel" aria-label="Settings guidance">
          <header>
            <h2 class="secondary-panel__title">What this page will do</h2>
            <p class="secondary-panel__description text-block">
              In a later step, these preferences will help the system determine which jobs to surface in your daily digest.
              For now, this page is only a calm, structured placeholder.
            </p>
          </header>
        </aside>
      </section>
    `;
    return;
  }

  if (path === "/dashboard") {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/dashboard"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/dashboard"].subtitle}
        </p>
      </section>
      <section class="workspace-row">
        <section class="primary-workspace" aria-label="Dashboard overview">
          <article class="card">
            <div class="empty-state">
              <h3 class="empty-state__title">No jobs yet.</h3>
              <p class="empty-state__body">
                In the next step, you will load a realistic dataset and see how this dashboard behaves with live information.
              </p>
            </div>
          </article>
        </section>
      </section>
    `;
    return;
  }

  if (path === "/saved") {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/saved"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/saved"].subtitle}
        </p>
      </section>
      <section class="workspace-row">
        <section class="primary-workspace" aria-label="Saved jobs">
          <article class="card">
            <div class="empty-state">
              <h3 class="empty-state__title">Nothing saved yet.</h3>
              <p class="empty-state__body">
                As you review opportunities, you’ll be able to mark certain jobs as saved. This calm workspace will hold them for focused follow-up.
              </p>
            </div>
          </article>
        </section>
      </section>
    `;
    return;
  }

  if (path === "/digest") {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/digest"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/digest"].subtitle}
        </p>
      </section>
      <section class="workspace-row">
        <section class="primary-workspace" aria-label="Daily digest">
          <article class="card">
            <div class="empty-state">
              <h3 class="empty-state__title">No digests generated yet.</h3>
              <p class="empty-state__body">
                In a future step, this page will quietly collect a 9AM summary of roles that match your preferences, ready when you are.
              </p>
            </div>
          </article>
        </section>
      </section>
    `;
    return;
  }

  if (path === "/proof") {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/proof"].title}</h1>
        <p class="context-header__subtitle">
          ${routes["/proof"].subtitle}
        </p>
      </section>
    `;
    return;
  }
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

