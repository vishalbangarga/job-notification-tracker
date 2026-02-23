const routes = {
  "/": {
    title: "Stop Missing The Right Jobs.",
    subtitle: "Precision-matched job discovery delivered daily at 9AM.",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Review current opportunities using filters that keep the view focused.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Preference fields are placeholders only. Nothing is saved yet.",
  },
  "/saved": {
    title: "Saved",
    subtitle: "Calm space for the roles you want to revisit with intention.",
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

const SAVED_JOBS_KEY = "jobNotificationTracker.savedJobs";
const ALL_JOBS = Array.isArray(window.JOBS) ? window.JOBS : [];

let currentFilters = {
  keyword: "",
  location: "",
  mode: "",
  experience: "",
  source: "",
};

let currentSort = "latest";

function loadSavedJobIds() {
  try {
    const raw = window.localStorage.getItem(SAVED_JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function saveJobId(id) {
  const existing = loadSavedJobIds();
  if (existing.includes(id)) {
    return;
  }
  const updated = [...existing, id];
  try {
    window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
  } catch {
    // Swallow storage errors silently to keep UI calm.
  }
}

function getSavedJobs() {
  const ids = loadSavedJobIds();
  if (!ids.length) return [];
  const byId = new Map(ALL_JOBS.map((job) => [job.id, job]));
  return ids
    .map((id) => byId.get(id))
    .filter(Boolean);
}

function getUniqueValuesFromJobs(field) {
  const set = new Set();
  ALL_JOBS.forEach((job) => {
    if (job[field]) {
      set.add(job[field]);
    }
  });
  return Array.from(set).sort();
}

function formatPostedDaysAgo(days) {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

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
    renderDashboard(container);
    return;
  }

  if (path === "/saved") {
    renderSaved(container);
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

function renderDashboard(container) {
  const locations = getUniqueValuesFromJobs("location");
  const modes = getUniqueValuesFromJobs("mode");
  const experiences = getUniqueValuesFromJobs("experience");
  const sources = getUniqueValuesFromJobs("source");

  const locationOptions = locations.map((loc) => `<option value="${loc}">${loc}</option>`).join("");
  const modeOptions = modes.map((mode) => `<option value="${mode}">${mode}</option>`).join("");
  const experienceOptions = experiences.map((exp) => `<option value="${exp}">${exp}</option>`).join("");
  const sourceOptions = sources.map((src) => `<option value="${src}">${src}</option>`).join("");

  container.innerHTML = `
    <section class="context-header">
      <h1 class="context-header__title">${routes["/dashboard"].title}</h1>
      <p class="context-header__subtitle">
        ${routes["/dashboard"].subtitle}
      </p>
    </section>
    <section class="workspace-row">
      <section class="primary-workspace" aria-label="Dashboard overview">
        <article class="card filter-card">
          <form class="filter-bar" id="job-filter-form">
            <div class="filter-bar__field">
              <label class="field__label" for="filter-keyword">Keyword</label>
              <input id="filter-keyword" type="text" placeholder="Search by title or company" />
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-location">Location</label>
              <select id="filter-location">
                <option value="">All</option>
                ${locationOptions}
              </select>
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-mode">Mode</label>
              <select id="filter-mode">
                <option value="">All</option>
                ${modeOptions}
              </select>
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-experience">Experience</label>
              <select id="filter-experience">
                <option value="">All</option>
                ${experienceOptions}
              </select>
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-source">Source</label>
              <select id="filter-source">
                <option value="">All</option>
                ${sourceOptions}
              </select>
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-sort">Sort</label>
              <select id="filter-sort">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </form>
        </article>
        <section id="job-list" class="job-list" aria-label="Job results"></section>
      </section>
    </section>
  `;

  setupFilterBar();
  renderJobList();
}

function renderSaved(container) {
  const savedJobs = getSavedJobs();

  container.innerHTML = `
    <section class="context-header">
      <h1 class="context-header__title">${routes["/saved"].title}</h1>
      <p class="context-header__subtitle">
        ${routes["/saved"].subtitle}
      </p>
    </section>
    <section class="workspace-row">
      <section class="primary-workspace" aria-label="Saved jobs">
        <section id="saved-job-list" class="job-list" aria-label="Saved job results"></section>
      </section>
    </section>
  `;

  const list = document.getElementById("saved-job-list");
  if (!list) return;

  if (!savedJobs.length) {
    list.innerHTML = `
      <div class="job-list__empty">
        <h3 class="job-list__empty-title">No saved jobs yet.</h3>
        <p class="job-list__empty-body">
          As you review opportunities on the dashboard, you can save specific roles to revisit here with a clear head.
        </p>
      </div>
    `;
    return;
  }

  renderJobCards(savedJobs, list, { showSave: false });
}

function setupFilterBar() {
  const keywordInput = document.getElementById("filter-keyword");
  const locationSelect = document.getElementById("filter-location");
  const modeSelect = document.getElementById("filter-mode");
  const experienceSelect = document.getElementById("filter-experience");
  const sourceSelect = document.getElementById("filter-source");
  const sortSelect = document.getElementById("filter-sort");

  if (keywordInput) {
    keywordInput.value = currentFilters.keyword;
    keywordInput.addEventListener("input", () => {
      currentFilters.keyword = keywordInput.value.trim();
      renderJobList();
    });
  }

  if (locationSelect) {
    locationSelect.value = currentFilters.location;
    locationSelect.addEventListener("change", () => {
      currentFilters.location = locationSelect.value;
      renderJobList();
    });
  }

  if (modeSelect) {
    modeSelect.value = currentFilters.mode;
    modeSelect.addEventListener("change", () => {
      currentFilters.mode = modeSelect.value;
      renderJobList();
    });
  }

  if (experienceSelect) {
    experienceSelect.value = currentFilters.experience;
    experienceSelect.addEventListener("change", () => {
      currentFilters.experience = experienceSelect.value;
      renderJobList();
    });
  }

  if (sourceSelect) {
    sourceSelect.value = currentFilters.source;
    sourceSelect.addEventListener("change", () => {
      currentFilters.source = sourceSelect.value;
      renderJobList();
    });
  }

  if (sortSelect) {
    sortSelect.value = currentSort;
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value || "latest";
      renderJobList();
    });
  }
}

function filterAndSortJobs() {
  let jobs = [...ALL_JOBS];

  if (currentFilters.keyword) {
    const kw = currentFilters.keyword.toLowerCase();
    jobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw)
    );
  }

  if (currentFilters.location) {
    jobs = jobs.filter((job) => job.location === currentFilters.location);
  }

  if (currentFilters.mode) {
    jobs = jobs.filter((job) => job.mode === currentFilters.mode);
  }

  if (currentFilters.experience) {
    jobs = jobs.filter((job) => job.experience === currentFilters.experience);
  }

  if (currentFilters.source) {
    jobs = jobs.filter((job) => job.source === currentFilters.source);
  }

  jobs.sort((a, b) => {
    if (currentSort === "oldest") {
      return b.postedDaysAgo - a.postedDaysAgo;
    }
    // latest first (smaller postedDaysAgo is newer)
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  return jobs;
}

function renderJobList() {
  const list = document.getElementById("job-list");
  if (!list) return;

  const jobs = filterAndSortJobs();
  if (!jobs.length) {
    list.innerHTML = `
      <div class="job-list__empty">
        <h3 class="job-list__empty-title">No jobs match your search.</h3>
        <p class="job-list__empty-body">
          Adjust the filters or clear the keyword search to see more roles again.
        </p>
      </div>
    `;
    return;
  }

  renderJobCards(jobs, list, { showSave: true });
}

function renderJobCards(jobs, container, options) {
  const { showSave } = options || { showSave: true };
  const savedIds = loadSavedJobIds();

  const cards = jobs
    .map((job) => {
      const isSaved = savedIds.includes(job.id);
      const saveLabel = isSaved ? "Saved" : "Save";
      const saveDisabled = isSaved ? "disabled" : "";

      return `
        <article class="card job-card" data-job-id="${job.id}">
          <header class="job-card__header">
            <h2 class="job-card__title">${job.title}</h2>
            <p class="job-card__company">${job.company}</p>
          </header>
          <div class="job-card__meta">
            <span class="job-card__meta-item">${job.location} • ${job.mode}</span>
            <span class="job-card__meta-item">Experience: ${job.experience}</span>
            <span class="job-card__meta-item">Salary: ${job.salaryRange}</span>
            <span class="badge badge--source">${job.source}</span>
          </div>
          <div class="job-card__footer">
            <div class="job-card__footer-left">
              Posted ${formatPostedDaysAgo(job.postedDaysAgo)}
            </div>
            <div class="job-card__footer-actions">
              <button
                class="btn btn-secondary"
                type="button"
                data-action="view"
                data-job-id="${job.id}"
              >
                View
              </button>
              ${
                showSave
                  ? `<button
                      class="btn btn-secondary"
                      type="button"
                      data-action="save"
                      data-job-id="${job.id}"
                      ${saveDisabled}
                    >
                      ${saveLabel}
                    </button>`
                  : ""
              }
              <button
                class="btn btn-primary"
                type="button"
                data-action="apply"
                data-job-id="${job.id}"
              >
                Apply
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.innerHTML = cards;

  container.removeEventListener("click", handleJobListClick);
  container.addEventListener("click", handleJobListClick);
}

function handleJobListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.getAttribute("data-action");
  const jobId = target.getAttribute("data-job-id");
  if (!action || !jobId) return;

  const job = ALL_JOBS.find((j) => j.id === jobId);
  if (!job) return;

  if (action === "view") {
    openJobModal(job);
    return;
  }

  if (action === "save") {
    saveJobId(job.id);
    // Refresh current view to reflect saved state
    render(getPath());
    setActiveLink(getPath());
    return;
  }

  if (action === "apply") {
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
  }
}

function openJobModal(job) {
  closeJobModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  overlay.innerHTML = `
    <div class="modal">
      <header class="modal__header">
        <h2 class="modal__title">${job.title}</h2>
        <p class="modal__subtitle">${job.company} • ${job.location} • ${job.mode}</p>
      </header>
      <div class="modal__section">
        <p class="job-card__meta-item">Experience: ${job.experience}</p>
        <p class="job-card__meta-item">Salary: ${job.salaryRange}</p>
        <p class="job-card__meta-item">Source: ${job.source}</p>
        <p class="job-card__meta-item">Posted ${formatPostedDaysAgo(job.postedDaysAgo)}</p>
      </div>
      <div class="modal__section">
        <h3 class="modal__section-title">Key skills</h3>
        <div class="chip-list">
          ${job.skills.map((skill) => `<span class="chip">${skill}</span>`).join("")}
        </div>
      </div>
      <div class="modal__section">
        <h3 class="modal__section-title">Role details</h3>
        <p class="modal__description">${job.description}</p>
      </div>
      <footer class="modal__footer">
        <button class="btn btn-secondary" type="button" data-modal-action="close">
          Close
        </button>
        <button class="btn btn-primary" type="button" data-modal-action="apply">
          Apply
        </button>
      </footer>
    </div>
  `;

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeJobModal();
    }
  });

  overlay.querySelectorAll("[data-modal-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = (event.currentTarget && event.currentTarget.getAttribute("data-modal-action")) || "";
      if (action === "close") {
        closeJobModal();
      } else if (action === "apply") {
        window.open(job.applyUrl, "_blank", "noopener,noreferrer");
        closeJobModal();
      }
    });
  });

  document.body.appendChild(overlay);
}

function closeJobModal() {
  const existing = document.querySelector(".modal-overlay");
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
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

