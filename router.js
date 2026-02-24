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
    subtitle: "Define your preferences so the dashboard can score and filter jobs deterministically.",
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
const PREFERENCES_KEY = "jobTrackerPreferences";
const DIGEST_KEY_PREFIX = "jobTrackerDigest_";
const STATUS_KEY = "jobTrackerStatus";
const STATUS_HISTORY_KEY = "jobTrackerStatusHistory";
const ALL_JOBS = Array.isArray(window.JOBS) ? window.JOBS : [];

let currentFilters = {
  keyword: "",
  location: "",
  mode: "",
  experience: "",
  source: "",
  status: "",
};

let currentSort = "latest";
let showOnlyMatches = false;

let lastJobListRenderKey = "";

const DEFAULT_PREFERENCES = {
  roleKeywords: [],
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: [],
  minMatchScore: 40,
};

const STATUS_VALUES = ["Not Applied", "Applied", "Rejected", "Selected"];

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

function parseCommaSeparated(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function loadPreferences() {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) {
      return { exists: false, prefs: { ...DEFAULT_PREFERENCES } };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { exists: false, prefs: { ...DEFAULT_PREFERENCES } };
    }

    const prefs = {
      roleKeywords: Array.isArray(parsed.roleKeywords) ? parsed.roleKeywords : parseCommaSeparated(parsed.roleKeywords),
      preferredLocations: Array.isArray(parsed.preferredLocations) ? parsed.preferredLocations : [],
      preferredMode: Array.isArray(parsed.preferredMode) ? parsed.preferredMode : [],
      experienceLevel: typeof parsed.experienceLevel === "string" ? parsed.experienceLevel : "",
      skills: Array.isArray(parsed.skills) ? parsed.skills : parseCommaSeparated(parsed.skills),
      minMatchScore: Number.isFinite(Number(parsed.minMatchScore)) ? Math.max(0, Math.min(100, Number(parsed.minMatchScore))) : 40,
    };

    return { exists: true, prefs };
  } catch {
    return { exists: false, prefs: { ...DEFAULT_PREFERENCES } };
  }
}

function savePreferences(prefs) {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function computeMatchScore(job, preferences) {
  const prefs = preferences || DEFAULT_PREFERENCES;
  let score = 0;

  const roleKeywords = (prefs.roleKeywords || []).map(normalizeText).filter(Boolean);
  const userSkills = (prefs.skills || []).map(normalizeText).filter(Boolean);

  const title = normalizeText(job.title);
  const description = normalizeText(job.description);

  if (roleKeywords.length) {
    const keywordInTitle = roleKeywords.some((kw) => title.includes(kw));
    const keywordInDescription = roleKeywords.some((kw) => description.includes(kw));
    if (keywordInTitle) score += 25;
    if (keywordInDescription) score += 15;
  }

  if ((prefs.preferredLocations || []).length && (prefs.preferredLocations || []).includes(job.location)) {
    score += 15;
  }

  if ((prefs.preferredMode || []).length && (prefs.preferredMode || []).includes(job.mode)) {
    score += 10;
  }

  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
    score += 10;
  }

  if (userSkills.length) {
    const jobSkills = Array.isArray(job.skills) ? job.skills.map(normalizeText) : [];
    const hasOverlap = userSkills.some((skill) => jobSkills.includes(skill));
    if (hasOverlap) score += 15;
  }

  if (typeof job.postedDaysAgo === "number" && job.postedDaysAgo <= 2) {
    score += 5;
  }

  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(100, score);
}

function getMatchBadgeStyle(score) {
  if (score >= 80) {
    return {
      border: "1px solid rgba(63, 111, 74, 0.5)",
      color: "var(--color-success)",
      background: "rgba(63, 111, 74, 0.06)",
    };
  }
  if (score >= 60) {
    return {
      border: "1px solid rgba(177, 121, 31, 0.5)",
      color: "var(--color-warning)",
      background: "rgba(177, 121, 31, 0.06)",
    };
  }
  if (score >= 40) {
    return {
      border: "1px solid rgba(17, 17, 17, 0.16)",
      color: "var(--color-text)",
      background: "rgba(17, 17, 17, 0.02)",
    };
  }
  return {
    border: "1px solid rgba(17, 17, 17, 0.08)",
    color: "rgba(17, 17, 17, 0.55)",
    background: "rgba(17, 17, 17, 0.02)",
  };
}

function parseSalaryToAnnualInr(salaryRange) {
  const raw = String(salaryRange || "");
  const lower = raw.toLowerCase();

  if (lower.includes("lpa")) {
    const m = raw.match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    const lakh = Number(m[1]);
    if (!Number.isFinite(lakh)) return null;
    return lakh * 100000;
  }

  if (lower.includes("/month")) {
    const m = raw.match(/(\d+)\s*k/i);
    if (m) {
      const monthly = Number(m[1]) * 1000;
      return Number.isFinite(monthly) ? monthly * 12 : null;
    }
    const m2 = raw.match(/₹\s*(\d+)/i);
    if (m2) {
      const monthly = Number(m2[1]);
      return Number.isFinite(monthly) ? monthly * 12 : null;
    }
  }

  return null;
}

function getLocalYYYYMMDD(date) {
  const d = date instanceof Date ? date : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDigestStorageKeyForDate(dateStr) {
  return `${DIGEST_KEY_PREFIX}${dateStr}`;
}

function loadDigestForDate(dateStr) {
  const key = getDigestStorageKeyForDate(dateStr);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.jobs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadStatusMap() {
  try {
    const raw = window.localStorage.getItem(STATUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveStatusMap(map) {
  try {
    window.localStorage.setItem(STATUS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage failures
  }
}

function getJobStatus(jobId) {
  const map = loadStatusMap();
  const value = map[jobId];
  if (!STATUS_VALUES.includes(value)) return "Not Applied";
  return value;
}

function storeJobStatus(jobId, status) {
  const map = loadStatusMap();
  map[jobId] = status;
  saveStatusMap(map);
}

function loadStatusHistory() {
  try {
    const raw = window.localStorage.getItem(STATUS_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function appendStatusHistory(entry) {
  const history = loadStatusHistory();
  history.push(entry);
  const trimmed = history.slice(-100);
  try {
    window.localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage failure
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Applied":
      return "job-status-badge job-status-badge--applied";
    case "Rejected":
      return "job-status-badge job-status-badge--rejected";
    case "Selected":
      return "job-status-badge job-status-badge--selected";
    default:
      return "job-status-badge job-status-badge--not-applied";
  }
}

function showToast(message) {
  if (!message) return;
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  window.setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, 2500);
}

function storeDigestForDate(dateStr, digest) {
  const key = getDigestStorageKeyForDate(dateStr);
  try {
    window.localStorage.setItem(key, JSON.stringify(digest));
    return true;
  } catch {
    return false;
  }
}

function buildDigestPlainText(digest) {
  const header = `Top 10 Jobs For You — 9AM Digest\n${digest.date}\n\n`;
  const lines = digest.jobs
    .map((job, idx) => {
      return [
        `${idx + 1}. ${job.title} — ${job.company}`,
        `   ${job.location} • ${job.experience}`,
        `   Match: ${job.matchScore} • Posted: ${formatPostedDaysAgo(job.postedDaysAgo)}`,
        `   Apply: ${job.applyUrl}`,
      ].join("\n");
    })
    .join("\n\n");
  const footer = `\n\nThis digest was generated based on your preferences.\nDemo Mode: Daily 9AM trigger simulated manually.`;
  return header + lines + footer;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall back below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
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
                These preferences are stored locally and used to compute a deterministic match score on the dashboard.
              </p>
            </header>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="pref-roleKeywords">Role keywords</label>
                <span class="field__hint">Comma-separated. Used to score matches in title and description.</span>
                <input id="pref-roleKeywords" type="text" placeholder="Example: react, backend, data analyst" />
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="pref-preferredLocations">Preferred locations</label>
                <span class="field__hint">Select one or more locations.</span>
                <select id="pref-preferredLocations" multiple size="6"></select>
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <span class="field__label">Preferred mode</span>
                <span class="field__hint">Choose one or more.</span>
                <div class="button-row" style="gap: var(--space-24);">
                  <label style="display: inline-flex; align-items: center; gap: var(--space-8);">
                    <input id="pref-mode-remote" type="checkbox" value="Remote" />
                    <span>Remote</span>
                  </label>
                  <label style="display: inline-flex; align-items: center; gap: var(--space-8);">
                    <input id="pref-mode-hybrid" type="checkbox" value="Hybrid" />
                    <span>Hybrid</span>
                  </label>
                  <label style="display: inline-flex; align-items: center; gap: var(--space-8);">
                    <input id="pref-mode-onsite" type="checkbox" value="Onsite" />
                    <span>Onsite</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="pref-experienceLevel">Experience level</label>
                <span class="field__hint">Used to score exact matches to job experience.</span>
                <select id="pref-experienceLevel">
                  <option value="">Any</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-1">0-1</option>
                  <option value="1-3">1-3</option>
                  <option value="3-5">3-5</option>
                </select>
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="pref-skills">Skills</label>
                <span class="field__hint">Comma-separated. Any overlap with job skills increases score.</span>
                <input id="pref-skills" type="text" placeholder="Example: SQL, React, Python" />
              </div>
            </div>
            <div class="card__section text-block">
              <div class="field">
                <label class="field__label" for="pref-minMatchScore">Minimum match score</label>
                <span class="field__hint">Used by the dashboard threshold toggle.</span>
                <div style="display: flex; align-items: center; gap: var(--space-16);">
                  <input id="pref-minMatchScore" type="range" min="0" max="100" value="40" />
                  <span id="pref-minMatchScoreValue" style="min-width: 40px;">40</span>
                </div>
              </div>
            </div>
            <div class="card__section text-block">
              <div class="button-row">
                <button class="btn btn-primary" type="button" id="pref-save">
                  Save preferences
                </button>
                <span id="pref-saveStatus" style="opacity: 0.8;"></span>
              </div>
            </div>
          </article>
        </section>
        <aside class="secondary-panel" aria-label="Settings guidance">
          <header>
            <h2 class="secondary-panel__title">What this page will do</h2>
            <p class="secondary-panel__description text-block">
              The dashboard will compute a match score per job using a fixed scoring rubric.
              Your preferences are stored locally under <strong>${PREFERENCES_KEY}</strong>.
            </p>
          </header>
        </aside>
      </section>
    `;
    setupSettingsForm();
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
    renderDigest(container);
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
  const statusOptions = STATUS_VALUES.map((value) => `<option value="${value}">${value}</option>`).join("");

  const { exists: prefsExist } = loadPreferences();
  if (!prefsExist) {
    showOnlyMatches = false;
  }

  container.innerHTML = `
    <section class="context-header">
      <h1 class="context-header__title">${routes["/dashboard"].title}</h1>
      <p class="context-header__subtitle">
        ${routes["/dashboard"].subtitle}
      </p>
    </section>
    <section class="workspace-row">
      <section class="primary-workspace" aria-label="Dashboard overview">
        ${
          prefsExist
            ? ""
            : `<article class="card" style="background-color: rgba(17, 17, 17, 0.02);">
                <div class="text-block">
                  <strong>Set your preferences to activate intelligent matching.</strong>
                  <div style="height: var(--space-16);"></div>
                  <button class="btn btn-secondary" type="button" onclick="navigate('/settings')">
                    Go to Settings
                  </button>
                </div>
              </article>`
        }
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
              <label class="field__label" for="filter-status">Status</label>
              <select id="filter-status">
                <option value="">All</option>
                ${statusOptions}
              </select>
            </div>
            <div class="filter-bar__field">
              <label class="field__label" for="filter-sort">Sort</label>
              <select id="filter-sort">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="matchScore">Match Score</option>
                <option value="salary">Salary</option>
              </select>
            </div>
            <div class="filter-bar__field">
              <span class="field__label">Threshold</span>
              <label style="display: inline-flex; align-items: center; gap: var(--space-8);">
                <input id="filter-showOnlyMatches" type="checkbox" ${prefsExist ? "" : "disabled"} />
                <span>Show only jobs above my threshold</span>
              </label>
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

function renderDigest(container) {
  const today = getLocalYYYYMMDD(new Date());
  const existing = loadDigestForDate(today);
  const { exists: prefsExist, prefs } = loadPreferences();

  if (!prefsExist) {
    container.innerHTML = `
      <section class="context-header">
        <h1 class="context-header__title">${routes["/digest"].title}</h1>
        <p class="context-header__subtitle">
          Set preferences to generate a personalized digest.
        </p>
      </section>
      <section class="digest-page" aria-label="Daily digest">
        <article class="digest-card">
          <h2 class="digest-card__title">Top 10 Jobs For You — 9AM Digest</h2>
          <p class="digest-card__subtitle">
            ${today}
          </p>
          <div class="digest-note">
            Demo Mode: Daily 9AM trigger simulated manually.
          </div>
          <div style="height: var(--space-24);"></div>
          <div class="digest-blocking">
            <div class="digest-blocking__title">Set preferences to generate a personalized digest.</div>
            <div class="digest-blocking__body">
              Your digest is generated deterministically from the preferences saved on the Settings page.
            </div>
            <div style="height: var(--space-16);"></div>
            <button class="btn btn-secondary" type="button" onclick="navigate('/settings')">
              Go to Settings
            </button>
          </div>
        </article>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="context-header">
      <h1 class="context-header__title">${routes["/digest"].title}</h1>
      <p class="context-header__subtitle">
        Generate a daily, email-style summary based on your preferences.
      </p>
    </section>
    <section class="digest-page" aria-label="Daily digest">
      <article class="digest-card">
        <div class="digest-actions">
          <button class="btn btn-primary" type="button" id="digest-generate">
            Generate Today's 9AM Digest (Simulated)
          </button>
          <button class="btn btn-secondary" type="button" id="digest-copy" ${existing ? "" : "disabled"}>
            Copy Digest to Clipboard
          </button>
          <button class="btn btn-secondary" type="button" id="digest-email" ${existing ? "" : "disabled"}>
            Create Email Draft
          </button>
          <span id="digest-status" style="opacity: 0.8;"></span>
        </div>
        <div class="digest-note">
          Demo Mode: Daily 9AM trigger simulated manually.
        </div>
        <div id="digest-content"></div>
      </article>
    </section>
  `;

  const content = document.getElementById("digest-content");
  if (content) {
    content.innerHTML = existing
      ? renderDigestBody(existing)
      : `
          <div class="digest-empty">
            <div class="digest-empty__title">No digest generated yet.</div>
            <div class="digest-empty__body">
              Click the button to generate today’s top 10 roles using your saved preferences.
            </div>
          </div>
        `;
  }

  setupDigestActions(today, prefs);
}

function renderDigestBody(digest) {
  const safeDate = digest.date || "";
  const jobs = Array.isArray(digest.jobs) ? digest.jobs : [];

  const history = loadStatusHistory()
    .filter((entry) => entry && entry.status && entry.status !== "Not Applied")
    .slice(-20)
    .reverse();
  const byId = new Map(ALL_JOBS.map((job) => [job.id, job]));

  const jobHtml = jobs
    .map((job) => {
      const badgeStyle = getMatchBadgeStyle(job.matchScore || 0);
      return `
        <div class="digest-job">
          <div class="digest-job__row">
            <div class="digest-job__left">
              <div class="digest-job__title">${job.title}</div>
              <div class="digest-job__meta">
                ${job.company} • ${job.location} • ${job.experience}
              </div>
            </div>
            <div class="digest-job__right">
              <span class="badge" style="border: ${badgeStyle.border}; color: ${badgeStyle.color}; background-color: ${badgeStyle.background};">
                Match ${job.matchScore}
              </span>
            </div>
          </div>
          <div class="digest-job__footer">
            <div class="digest-job__posted">
              Posted ${formatPostedDaysAgo(job.postedDaysAgo)}
            </div>
            <a class="btn btn-primary" href="${job.applyUrl}" target="_blank" rel="noopener noreferrer">
              Apply
            </a>
          </div>
        </div>
      `;
    })
    .join("");

  const updatesHtml =
    history.length === 0
      ? `
        <div class="digest-empty">
          <div class="digest-empty__title">No recent status updates.</div>
          <div class="digest-empty__body">
            As you mark jobs as Applied, Rejected, or Selected, the latest changes will appear here.
          </div>
        </div>
      `
      : history
          .map((entry) => {
            const job = byId.get(entry.jobId);
            if (!job) return "";
            const date = new Date(entry.changedAt);
            const label = isNaN(date.getTime()) ? entry.changedAt : date.toLocaleDateString();
            return `
              <div class="digest-job">
                <div class="digest-job__row">
                  <div class="digest-job__left">
                    <div class="digest-job__title">${job.title}</div>
                    <div class="digest-job__meta">
                      ${job.company}
                    </div>
                  </div>
                  <div class="digest-job__right">
                    <span class="job-status-badge ${getStatusBadgeClass(entry.status).split(" ").slice(1).join(" ")}">
                      ${entry.status}
                    </span>
                  </div>
                </div>
                <div class="digest-job__footer">
                  <div class="digest-job__posted">
                    Updated on ${label}
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

  return `
    <div class="digest-header">
      <h2 class="digest-card__title">Top 10 Jobs For You — 9AM Digest</h2>
      <p class="digest-card__subtitle">${safeDate}</p>
    </div>
    <div class="digest-jobs">
      ${jobHtml}
    </div>
    <div class="digest-footer">
      This digest was generated based on your preferences.
    </div>
    <div style="height: var(--space-24);"></div>
    <div class="digest-header">
      <h2 class="digest-card__title">Recent Status Updates</h2>
    </div>
    <div class="digest-jobs">
      ${updatesHtml}
    </div>
  `;
}

function setupDigestActions(today, prefs) {
  const generateBtn = document.getElementById("digest-generate");
  const copyBtn = document.getElementById("digest-copy");
  const emailBtn = document.getElementById("digest-email");
  const status = document.getElementById("digest-status");
  const content = document.getElementById("digest-content");

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  async function ensureDigestForToday() {
    setStatus("");
    const existing = loadDigestForDate(today);
    if (existing) {
      if (content) content.innerHTML = renderDigestBody(existing);
      if (copyBtn) copyBtn.removeAttribute("disabled");
      if (emailBtn) emailBtn.removeAttribute("disabled");
      setStatus("Loaded today's digest.");
      return existing;
    }

    const scoresById = new Map();
    ALL_JOBS.forEach((job) => {
      scoresById.set(job.id, computeMatchScore(job, prefs));
    });

    const threshold = typeof prefs.minMatchScore === "number" ? prefs.minMatchScore : 40;
    const candidates = ALL_JOBS
      .map((job) => ({ job, score: scoresById.get(job.id) || 0 }))
      .filter(({ score }) => score >= threshold);

    if (!candidates.length) {
      if (content) {
        content.innerHTML = `
          <div class="digest-empty">
            <div class="digest-empty__title">No matching roles today. Check again tomorrow.</div>
            <div class="digest-empty__body">
              You can also lower your minimum match score on the Settings page.
            </div>
          </div>
        `;
      }
      if (copyBtn) copyBtn.setAttribute("disabled", "disabled");
      if (emailBtn) emailBtn.setAttribute("disabled", "disabled");
      setStatus("");
      return null;
    }

    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.job.postedDaysAgo - b.job.postedDaysAgo;
    });

    const top = candidates.slice(0, 10);
    const digest = {
      date: today,
      generatedAt: new Date().toISOString(),
      jobs: top.map(({ job, score }) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        postedDaysAgo: job.postedDaysAgo,
        applyUrl: job.applyUrl,
        matchScore: Math.min(100, score),
      })),
    };

    storeDigestForDate(today, digest);
    if (content) content.innerHTML = renderDigestBody(digest);
    if (copyBtn) copyBtn.removeAttribute("disabled");
    if (emailBtn) emailBtn.removeAttribute("disabled");
    setStatus("Generated and saved today's digest.");
    return digest;
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      ensureDigestForToday();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const existing = loadDigestForDate(today);
      if (!existing) return;
      const text = buildDigestPlainText(existing);
      const ok = await copyToClipboard(text);
      setStatus(ok ? "Copied to clipboard." : "Couldn’t copy. Try again.");
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const existing = loadDigestForDate(today);
      if (!existing) return;
      const body = buildDigestPlainText(existing);
      const subject = "My 9AM Job Digest";
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }
}

function setupFilterBar() {
  const keywordInput = document.getElementById("filter-keyword");
  const locationSelect = document.getElementById("filter-location");
  const modeSelect = document.getElementById("filter-mode");
  const experienceSelect = document.getElementById("filter-experience");
  const sourceSelect = document.getElementById("filter-source");
  const statusSelect = document.getElementById("filter-status");
  const sortSelect = document.getElementById("filter-sort");
  const showOnlyToggle = document.getElementById("filter-showOnlyMatches");

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

  if (statusSelect) {
    statusSelect.value = currentFilters.status;
    statusSelect.addEventListener("change", () => {
      currentFilters.status = statusSelect.value;
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

  if (showOnlyToggle) {
    showOnlyToggle.checked = showOnlyMatches;
    showOnlyToggle.addEventListener("change", () => {
      showOnlyMatches = Boolean(showOnlyToggle.checked);
      renderJobList();
    });
  }
}

function filterAndSortJobs() {
  const { exists: prefsExist, prefs } = loadPreferences();
  const scoresById = new Map();
  ALL_JOBS.forEach((job) => {
    scoresById.set(job.id, computeMatchScore(job, prefs));
  });

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

  if (currentFilters.status) {
    jobs = jobs.filter((job) => getJobStatus(job.id) === currentFilters.status);
  }

  if (showOnlyMatches && prefsExist) {
    jobs = jobs.filter((job) => (scoresById.get(job.id) || 0) >= (prefs.minMatchScore || 0));
  }

  jobs.sort((a, b) => {
    if (currentSort === "oldest") {
      return b.postedDaysAgo - a.postedDaysAgo;
    }

    if (currentSort === "matchScore") {
      return (scoresById.get(b.id) || 0) - (scoresById.get(a.id) || 0);
    }

    if (currentSort === "salary") {
      const aSalary = parseSalaryToAnnualInr(a.salaryRange);
      const bSalary = parseSalaryToAnnualInr(b.salaryRange);
      if (aSalary == null && bSalary == null) return 0;
      if (aSalary == null) return 1;
      if (bSalary == null) return -1;
      return bSalary - aSalary;
    }
    // latest first (smaller postedDaysAgo is newer)
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  return { jobs, scoresById, prefsExist, prefs };
}

function renderJobList() {
  const list = document.getElementById("job-list");
  if (!list) return;

  const { jobs, scoresById, prefsExist, prefs } = filterAndSortJobs();

  const renderKey = JSON.stringify({
    k: currentFilters.keyword,
    l: currentFilters.location,
    m: currentFilters.mode,
    e: currentFilters.experience,
    s: currentFilters.source,
    sort: currentSort,
    only: showOnlyMatches,
    min: prefsExist ? prefs.minMatchScore : null,
    saved: loadSavedJobIds(),
    count: jobs.length,
  });

  if (renderKey === lastJobListRenderKey) {
    return;
  }
  lastJobListRenderKey = renderKey;

  if (!jobs.length) {
    const emptyTitle = showOnlyMatches
      ? "No roles match your criteria."
      : "No jobs match your search.";
    const emptyBody = showOnlyMatches
      ? "Adjust filters or lower threshold."
      : "Adjust the filters or clear the keyword search to see more roles again.";

    list.innerHTML = `
      <div class="job-list__empty">
        <h3 class="job-list__empty-title">${emptyTitle}</h3>
        <p class="job-list__empty-body">
          ${emptyBody}
        </p>
      </div>
    `;
    return;
  }

  renderJobCards(jobs, list, { showSave: true, scoresById, showMatchScore: true });
}

function renderJobCards(jobs, container, options) {
  const { showSave, scoresById, showMatchScore } = options || { showSave: true };
  const savedIds = loadSavedJobIds();

  const cards = jobs
    .map((job) => {
      const isSaved = savedIds.includes(job.id);
      const saveLabel = isSaved ? "Saved" : "Save";
      const saveDisabled = isSaved ? "disabled" : "";

      const matchScore = scoresById ? (scoresById.get(job.id) || 0) : 0;
      const badgeStyle = getMatchBadgeStyle(matchScore);
      const matchBadge = showMatchScore
        ? `<span
            class="badge"
            style="border: ${badgeStyle.border}; color: ${badgeStyle.color}; background-color: ${badgeStyle.background};"
          >
            Match ${matchScore}
          </span>`
        : "";

      const status = getJobStatus(job.id);
      const statusBadgeClass = getStatusBadgeClass(status);

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
            ${matchBadge}
          </div>
          <div class="job-card__status">
            <div class="job-card__status-row">
              <span class="job-status-label">Status</span>
              <span class="${statusBadgeClass}">${status}</span>
            </div>
            <div class="job-status-buttons" data-status-group="${job.id}">
              ${STATUS_VALUES.map((value) => {
                const activeClass = value === status ? " job-status-button--active" : "";
                return `<button
                  type="button"
                  class="job-status-button${activeClass}"
                  data-action="status"
                  data-job-id="${job.id}"
                  data-status="${value}"
                >
                  ${value}
                </button>`;
              }).join("")}
            </div>
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
    // Update button state in-place to avoid full re-render flicker
    target.setAttribute("disabled", "disabled");
    target.textContent = "Saved";
    lastJobListRenderKey = "";
    return;
  }

  if (action === "status") {
    const newStatus = target.getAttribute("data-status") || "Not Applied";
    if (!STATUS_VALUES.includes(newStatus)) {
      return;
    }

    storeJobStatus(job.id, newStatus);
    appendStatusHistory({
      jobId: job.id,
      status: newStatus,
      changedAt: new Date().toISOString(),
    });

    const group = target.closest('[data-status-group]');
    if (group) {
      group.querySelectorAll(".job-status-button").forEach((btn) => {
        btn.classList.remove("job-status-button--active");
      });
      target.classList.add("job-status-button--active");

      const groupJobId = group.getAttribute("data-status-group");
      if (groupJobId) {
        const card = group.closest('.job-card');
        if (card) {
          const badge = card.querySelector(".job-status-badge, .job-status-badge--not-applied, .job-status-badge--applied, .job-status-badge--rejected, .job-status-badge--selected");
          if (badge) {
            const cls = getStatusBadgeClass(newStatus);
            badge.className = cls;
            badge.textContent = newStatus;
          }
        }
      }
    }

    if (newStatus === "Applied" || newStatus === "Rejected" || newStatus === "Selected") {
      showToast(`Status updated: ${newStatus}`);
    }

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

function setupSettingsForm() {
  const { prefs } = loadPreferences();

  const locations = getUniqueValuesFromJobs("location");
  const locationSelect = document.getElementById("pref-preferredLocations");
  if (locationSelect) {
    locationSelect.innerHTML = locations
      .map((loc) => `<option value="${loc}">${loc}</option>`)
      .join("");
    const selected = new Set(prefs.preferredLocations || []);
    Array.from(locationSelect.options).forEach((opt) => {
      opt.selected = selected.has(opt.value);
    });
  }

  const roleKeywordsInput = document.getElementById("pref-roleKeywords");
  if (roleKeywordsInput) {
    roleKeywordsInput.value = (prefs.roleKeywords || []).join(", ");
  }

  const skillsInput = document.getElementById("pref-skills");
  if (skillsInput) {
    skillsInput.value = (prefs.skills || []).join(", ");
  }

  const expSelect = document.getElementById("pref-experienceLevel");
  if (expSelect) {
    expSelect.value = prefs.experienceLevel || "";
  }

  const modeRemote = document.getElementById("pref-mode-remote");
  const modeHybrid = document.getElementById("pref-mode-hybrid");
  const modeOnsite = document.getElementById("pref-mode-onsite");
  const preferredMode = new Set(prefs.preferredMode || []);
  if (modeRemote) modeRemote.checked = preferredMode.has("Remote");
  if (modeHybrid) modeHybrid.checked = preferredMode.has("Hybrid");
  if (modeOnsite) modeOnsite.checked = preferredMode.has("Onsite");

  const slider = document.getElementById("pref-minMatchScore");
  const sliderValue = document.getElementById("pref-minMatchScoreValue");
  if (slider) {
    slider.value = String(Number.isFinite(Number(prefs.minMatchScore)) ? prefs.minMatchScore : 40);
    if (sliderValue) sliderValue.textContent = slider.value;
    slider.addEventListener("input", () => {
      if (sliderValue) sliderValue.textContent = slider.value;
    });
  }

  const saveButton = document.getElementById("pref-save");
  const saveStatus = document.getElementById("pref-saveStatus");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const nextPrefs = {
        roleKeywords: parseCommaSeparated(roleKeywordsInput ? roleKeywordsInput.value : ""),
        preferredLocations: locationSelect
          ? Array.from(locationSelect.selectedOptions).map((o) => o.value)
          : [],
        preferredMode: [
          ...(modeRemote && modeRemote.checked ? ["Remote"] : []),
          ...(modeHybrid && modeHybrid.checked ? ["Hybrid"] : []),
          ...(modeOnsite && modeOnsite.checked ? ["Onsite"] : []),
        ],
        experienceLevel: expSelect ? expSelect.value : "",
        skills: parseCommaSeparated(skillsInput ? skillsInput.value : ""),
        minMatchScore: slider ? Math.max(0, Math.min(100, Number(slider.value))) : 40,
      };

      const ok = savePreferences(nextPrefs);
      if (saveStatus) {
        saveStatus.textContent = ok ? "Saved." : "Couldn’t save. Check storage permissions.";
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

