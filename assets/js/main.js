import { HOUSES, WIZARDS } from "./data.js";

const STORAGE_KEYS = {
  spoilerBanner: "hogwarts-spoiler-banner-dismissed",
  spoilerOptIn: "hogwarts-show-spoilers",
};

const state = {
  showSpoilers: getStoredBoolean(STORAGE_KEYS.spoilerOptIn, false),
};

const houseMap = new Map(HOUSES.map((house) => [house.id, house]));
const wizardMap = new Map(WIZARDS.map((wizard) => [wizard.id, wizard]));

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMobileMenu();
  initGlobalModal();
  initSpoilerBanner();

  const page = document.body.dataset.page;
  switch (page) {
    case "home":
      initHomePage();
      break;
    case "houses":
      initHousesPage();
      break;
    case "wizards":
      initWizardsPage();
      break;
    case "timeline":
      initTimelinePage();
      break;
    default:
      break;
  }
});

function initNavigation() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const isActive = link.dataset.navLink === page;
    link.dataset.active = isActive ? "true" : "false";
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    nav.dataset.open = (!isOpen).toString();
    toggle.setAttribute("aria-expanded", (!isOpen).toString());
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

let modal;

function initGlobalModal() {
  modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("hidden", "");

  modal.innerHTML = `
    <div class="modal__dialog" role="document">
      <button type="button" class="modal__close" aria-label="Close modal">&times;</button>
      <div class="modal__content"></div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.querySelector(".modal__close").addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.dataset.open === "true") {
      closeModal();
    }
  });
}

function openModal(content) {
  if (!modal) return;
  const contentContainer = modal.querySelector(".modal__content");
  contentContainer.innerHTML = "";
  contentContainer.appendChild(content);
  modal.dataset.open = "true";
  modal.removeAttribute("hidden");
  const closeButton = modal.querySelector(".modal__close");
  closeButton.focus();
}

function closeModal() {
  if (!modal) return;
  modal.dataset.open = "false";
  modal.setAttribute("hidden", "");
}

function initSpoilerBanner() {
  const banner = document.querySelector("[data-spoiler-banner]");
  if (!banner) return;

  if (getStoredBoolean(STORAGE_KEYS.spoilerBanner, false)) {
    banner.remove();
    return;
  }

  const dismissButton = banner.querySelector("[data-spoiler-dismiss]");
  if (dismissButton) {
    dismissButton.addEventListener("click", () => {
      setStoredBoolean(STORAGE_KEYS.spoilerBanner, true);
      banner.remove();
    });
  }
}

function initHomePage() {
  renderFeaturedHouse();
  renderFeaturedWizard();
}

function renderFeaturedHouse() {
  const container = document.querySelector("[data-featured-house]");
  const house = HOUSES[0];
  if (!container || !house) return;

  container.innerHTML = `
    <div class="feature-card">
      <img src="${house.img}" alt="${house.name} crest" loading="lazy" width="320" height="240" />
      <div>
        <h3>${house.name}</h3>
        <p>${house.summary}</p>
        <div class="meta">
          <span>Founder: ${house.founder}</span>
          <span>Traits: ${house.traits.join(", ")}</span>
        </div>
        <div style="margin-top: 1.5rem;">
          <button class="btn btn--ghost" type="button" data-open-house="${house.id}">
            View House Lore
          </button>
        </div>
      </div>
    </div>
  `;

  container
    .querySelector("[data-open-house]")
    .addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.openHouse;
      openHouseModal(id);
    });
}

function renderFeaturedWizard() {
  const container = document.querySelector("[data-featured-wizard]");
  const wizard = WIZARDS.find((wiz) => wiz.spoilerLevel === "low") ?? WIZARDS[0];
  if (!container || !wizard) return;

  container.innerHTML = `
    <div class="feature-card">
      <img src="${wizard.img}" alt="${wizard.name} portrait" loading="lazy" width="320" height="240" />
      <div>
        <h3>${wizard.name}</h3>
        <p>${wizard.summary}</p>
        <div class="meta">
          <span>House: ${wizard.house}</span>
          <span>Aliases: ${wizard.aliases.join(", ")}</span>
        </div>
        <div style="margin-top: 1.5rem;">
          <button class="btn btn--ghost" type="button" data-open-wizard="${wizard.id}">
            Meet the Wizard
          </button>
        </div>
      </div>
    </div>
  `;

  container
    .querySelector("[data-open-wizard]")
    .addEventListener("click", (event) => {
      const id = event.currentTarget.dataset.openWizard;
      openWizardModal(id);
    });
}

function initHousesPage() {
  const grid = document.querySelector("[data-houses-grid]");
  if (!grid) return;
  const searchInput = document.querySelector("#house-search");
  const traitSelect = document.querySelector("#house-trait");

  populateHouseTraitOptions(traitSelect);

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const traitValue = traitSelect.value;

    const filtered = HOUSES.filter((house) => {
      const matchesSearch =
        !searchTerm ||
        house.name.toLowerCase().includes(searchTerm) ||
        house.traits.some((trait) => trait.toLowerCase().includes(searchTerm));

      const matchesTrait =
        traitValue === "all" ||
        house.traits.some(
          (trait) => trait.toLowerCase() === traitValue.toLowerCase()
        );

      return matchesSearch && matchesTrait;
    });

    renderHouseCards(grid, filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  traitSelect.addEventListener("change", applyFilters);

  applyFilters();
}

function populateHouseTraitOptions(select) {
  if (!select) return;
  const traits = new Set();
  HOUSES.forEach((house) => house.traits.forEach((trait) => traits.add(trait)));
  select.innerHTML = `<option value="all">All Traits</option>`;
  Array.from(traits)
    .sort()
    .forEach((trait) => {
      const option = document.createElement("option");
      option.value = trait;
      option.textContent = trait;
      select.appendChild(option);
    });
}

function renderHouseCards(container, houses) {
  container.innerHTML = "";
  if (!houses.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No houses match your search. Try a different trait or name.</p>
      </div>
    `;
    return;
  }

  houses.forEach((house) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <img src="${house.img}" alt="${house.name} crest" loading="lazy" width="400" height="300" />
      <div class="card-body">
        <h3 class="card-title">${house.name}</h3>
        <p class="card-summary">${house.summary}</p>
        <button class="btn btn--ghost" type="button" data-open-house="${house.id}">
          View details
        </button>
      </div>
    `;

    article
      .querySelector("[data-open-house]")
      .addEventListener("click", (event) => {
        const id = event.currentTarget.dataset.openHouse;
        openHouseModal(id);
      });
    container.appendChild(article);
  });
}

function openHouseModal(id) {
  const house = houseMap.get(id);
  if (!house) return;

  const content = document.createElement("div");
  content.innerHTML = `
    <h2 class="modal__title">${house.name}</h2>
    <p>${house.summary}</p>
    <div class="modal__grid" role="list">
      <dl>
        <dt>Founder</dt>
        <dd>${house.founder}</dd>
        <dt>Mascot</dt>
        <dd>${house.mascot}</dd>
        <dt>Colors</dt>
        <dd>${house.colors.join(", ")}</dd>
        <dt>Traits</dt>
        <dd>${house.traits.join(", ")}</dd>
        <dt>Relic</dt>
        <dd>${house.relic}</dd>
        <dt>House Ghost</dt>
        <dd>${house.ghost}</dd>
      </dl>
      <div>
        <h3 class="section-heading" style="font-size:1rem;margin-bottom:0.75rem;">Notable Moments</h3>
        <ul style="padding-left:1.25rem;margin:0;display:grid;gap:0.5rem;">
          ${house.notableEvents
            .map((event) => `<li>${event}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
  `;

  openModal(content);
}

function initWizardsPage() {
  const grid = document.querySelector("[data-wizards-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("#wizard-search");
  const houseSelect = document.querySelector("#wizard-house");
  const yearSelect = document.querySelector("#wizard-year");
  const spoilerToggle = document.querySelector("#spoiler-toggle");

  populateWizardHouseOptions(houseSelect);
  populateWizardYearOptions(yearSelect);

  if (spoilerToggle) {
    spoilerToggle.checked = state.showSpoilers;
    spoilerToggle.addEventListener("change", () => {
      state.showSpoilers = spoilerToggle.checked;
      setStoredBoolean(STORAGE_KEYS.spoilerOptIn, state.showSpoilers);
      renderWizardCards(grid, collectWizardFilters());
    });
  }

  const collectWizardFilters = () => ({
    search: searchInput.value.trim().toLowerCase(),
    house: houseSelect.value,
    year: yearSelect.value,
  });

  const handleFilterChange = () => {
    renderWizardCards(grid, collectWizardFilters());
  };

  searchInput.addEventListener("input", handleFilterChange);
  houseSelect.addEventListener("change", handleFilterChange);
  yearSelect.addEventListener("change", handleFilterChange);

  renderWizardCards(grid, collectWizardFilters());
}

function populateWizardHouseOptions(select) {
  if (!select) return;
  select.innerHTML = `<option value="all">All Houses</option>`;
  HOUSES.forEach((house) => {
    const option = document.createElement("option");
    option.value = house.id;
    option.textContent = house.name;
    select.appendChild(option);
  });
}

function populateWizardYearOptions(select) {
  if (!select) return;
  const years = new Set();
  WIZARDS.forEach((wizard) => wizard.years.forEach((year) => years.add(year)));
  select.innerHTML = `<option value="all">All Years</option>`;
  Array.from(years)
    .sort((a, b) => a - b)
    .forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = `${year}-${year + 1}`;
      select.appendChild(option);
    });
}

function renderWizardCards(container, filters) {
  container.innerHTML = "";
  const { search, house, year } = filters;

  const filtered = WIZARDS.filter((wizard) => {
    const matchesSearch = !search || wizard.name.toLowerCase().includes(search);
    const matchesHouse = house === "all" || wizard.house.toLowerCase() === house;
    const matchesYear =
      year === "all" || wizard.years.includes(Number.parseInt(year, 10));
    return matchesSearch && matchesHouse && matchesYear;
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No wizards match those filters. Try another combination.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((wizard) => {
    const house = houseMap.get(wizard.house.toLowerCase());
    const houseLabel = wizard.house;
    const summaryContent =
      wizard.spoilerLevel === "high" && !state.showSpoilers
        ? "Spoiler-protected. Enable spoilers to reveal this summary."
        : wizard.summary;

    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <img src="${wizard.img}" alt="${wizard.name} portrait" loading="lazy" width="400" height="300" />
      <div class="card-body">
        <div class="badge">${houseLabel}</div>
        <h3 class="card-title">${wizard.name}</h3>
        <p class="card-summary">${summaryContent}</p>
        <button class="btn btn--ghost" type="button" data-open-wizard="${wizard.id}">
          View details
        </button>
      </div>
    `;

    article
      .querySelector("[data-open-wizard]")
      .addEventListener("click", (event) => {
        openWizardModal(event.currentTarget.dataset.openWizard);
      });

    container.appendChild(article);
  });
}

function openWizardModal(id) {
  const wizard = wizardMap.get(id);
  if (!wizard) return;

  const revealSummary =
    wizard.spoilerLevel === "high" ? state.showSpoilers : true;
  const summary = revealSummary
    ? wizard.summary
    : "Spoiler-protected. Enable spoilers to reveal this summary.";

  const content = document.createElement("div");
  content.innerHTML = `
    <h2 class="modal__title">${wizard.name}</h2>
    <p style="margin-bottom:1rem;">${summary}</p>
    <div class="modal__grid">
      <dl>
        <dt>House</dt>
        <dd>${wizard.house}</dd>
        <dt>Aliases</dt>
        <dd>${wizard.aliases.join(", ")}</dd>
        <dt>Years</dt>
        <dd>${wizard.years.map((year) => `${year}-${year + 1}`).join(", ")}</dd>
        <dt>Spoiler Level</dt>
        <dd>${wizard.spoilerLevel}</dd>
      </dl>
      <div>
        <h3 class="section-heading" style="font-size:1rem;margin-bottom:0.75rem;">Notable Events</h3>
        <ul style="padding-left:1.25rem;margin:0;display:grid;gap:0.5rem;">
          ${wizard.notableEvents.map((event) => `<li>${event}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  openModal(content);
}

function initTimelinePage() {
  const container = document.querySelector("[data-timeline]");
  if (!container) return;

  const entries = [
    ...HOUSES.flatMap((house) =>
      (house.timeline || []).map((event) => ({
        ...event,
        type: "house",
        relatedId: event.relatedId ?? house.id,
      }))
    ),
    ...WIZARDS.flatMap((wizard) =>
      (wizard.timeline || []).map((event) => ({
        ...event,
        type: "wizard",
        relatedId: event.relatedId ?? wizard.id,
        spoilerLevel: wizard.spoilerLevel,
      }))
    ),
  ].sort((a, b) => a.year - b.year);

  const grouped = new Map();
  entries.forEach((entry) => {
    const label = deriveTimelineGroup(entry.year);
    if (!grouped.has(label)) {
      grouped.set(label, []);
    }
    grouped.get(label).push(entry);
  });

  container.innerHTML = "";

  grouped.forEach((items, label) => {
    const section = document.createElement("section");
    section.className = "timeline__group";
    section.innerHTML = `
      <h3>${label}</h3>
      <div class="timeline__items"></div>
    `;
    const list = section.querySelector(".timeline__items");
    items.forEach((item) => {
      const button = document.createElement("button");
      button.className = "btn btn--ghost";
      button.type = "button";
      button.dataset.relatedId = item.relatedId;
      button.innerHTML = `
        <span class="timeline__item-title">
          <span>${item.title}</span>
          <span>${item.year}</span>
        </span>
        <p>${
          item.type === "wizard" &&
          item.spoilerLevel === "high" &&
          !state.showSpoilers
            ? "Spoiler-protected. Enable spoilers to reveal the details."
            : item.description
        }</p>
      `;

      button.addEventListener("click", () => {
        openTimelineModal(item.relatedId);
      });

      const wrapper = document.createElement("div");
      wrapper.className = "timeline__item";
      wrapper.appendChild(button);
      list.appendChild(wrapper);
    });

    container.appendChild(section);
  });
}

function deriveTimelineGroup(year) {
  if (year < 1991) {
    return "Founding & Earlier Years";
  }
  if (year >= 1991 && year <= 1997) {
    const index = year - 1991 + 1;
    return `Year ${index} (${year}-${year + 1})`;
  }
  return `Post-Battle Era (${year})`;
}

function openTimelineModal(id) {
  if (houseMap.has(id)) {
    openHouseModal(id);
  } else if (wizardMap.has(id)) {
    openWizardModal(id);
  }
}

function getStoredBoolean(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    return value === "true";
  } catch (error) {
    return defaultValue;
  }
}

function setStoredBoolean(key, value) {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch (error) {
    // Ignore storage issues (e.g., private browsing).
  }
}
