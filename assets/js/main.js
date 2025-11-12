import { HOUSES, WIZARDS, TIMELINE } from "./data.js";

const storage = getSafeStorage();
const state = {
  showSpoilers: false,
};

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  const page = document.body.dataset.page;

  switch (page) {
    case "home":
      initHome();
      break;
    case "houses":
      initHouses();
      break;
    case "wizards":
      initWizards();
      initSpoilerBanner();
      break;
    case "timeline":
      initTimeline();
      initSpoilerBanner();
      break;
    default:
      break;
  }
});

function initNavigation() {
  const navLinks = document.querySelectorAll(".nav__link");
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__links");
  const page = document.body.dataset.page;

  navLinks.forEach((link) => {
    const isActive = link.dataset.page === page;
    link.setAttribute("data-active", String(isActive));
    link.addEventListener("click", () => {
      closeMobileNav(navToggle, navList);
    });
  });

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.setAttribute("data-open", String(!expanded));
    });

    document.addEventListener("click", (event) => {
      if (
        navList.getAttribute("data-open") === "true" &&
        !navList.contains(event.target) &&
        event.target !== navToggle
      ) {
        closeMobileNav(navToggle, navList);
      }
    });
  }
}

function closeMobileNav(toggle, list) {
  if (!toggle || !list) return;
  toggle.setAttribute("aria-expanded", "false");
  list.setAttribute("data-open", "false");
}

function initHome() {
  const featuredGrid = document.getElementById("featured-grid");
  if (!featuredGrid) return;

  const featuredHouse = pickRandom(HOUSES);
  const featuredWizard = pickRandom(WIZARDS);

  featuredGrid.innerHTML = "";
  featuredGrid.appendChild(createHouseCard(featuredHouse, { includeButton: false }));
  featuredGrid.appendChild(
    createWizardCard(featuredWizard, {
      includeButton: false,
      showSpoilers: true,
    })
  );
}

function initHouses() {
  const grid = document.getElementById("houses-grid");
  const emptyState = document.getElementById("houses-empty");
  const searchInput = document.getElementById("house-search");
  const traitSelect = document.getElementById("trait-filter");

  if (!grid || !searchInput || !traitSelect) return;

  populateTraitFilter(traitSelect);

  const filters = {
    search: "",
    trait: "all",
  };

  const render = () => {
    const results = HOUSES.filter((house) => houseMatchesFilters(house, filters));
    grid.innerHTML = "";

    if (!results.length) {
      emptyState?.removeAttribute("hidden");
      return;
    }

    emptyState?.setAttribute("hidden", "true");
    results.forEach((house) => {
      grid.appendChild(createHouseCard(house, { includeButton: true }));
    });
  };

  searchInput.addEventListener("input", (event) => {
    filters.search = event.target.value.trim().toLowerCase();
    render();
  });

  traitSelect.addEventListener("change", (event) => {
    filters.trait = event.target.value;
    render();
  });

  render();
}

function initWizards() {
  const grid = document.getElementById("wizards-grid");
  const emptyState = document.getElementById("wizards-empty");
  const searchInput = document.getElementById("wizard-search");
  const houseSelect = document.getElementById("house-filter");
  const yearSelect = document.getElementById("year-filter");
  const spoilerToggle = document.getElementById("spoiler-toggle-input");

  if (!grid || !searchInput || !houseSelect || !yearSelect || !spoilerToggle) return;

  populateHouseFilter(houseSelect);
  populateYearFilter(yearSelect);

  const savedSpoilerState = storage.getItem("hogwartsSpoilersEnabled");
  state.showSpoilers = savedSpoilerState === null ? false : savedSpoilerState === "true";
  spoilerToggle.checked = state.showSpoilers;

  const filters = {
    search: "",
    house: "all",
    year: "all",
  };

  const render = () => {
    const results = WIZARDS.filter((wizard) => wizardMatchesFilters(wizard, filters));
    grid.innerHTML = "";

    if (!results.length) {
      emptyState?.removeAttribute("hidden");
      return;
    }

    emptyState?.setAttribute("hidden", "true");
    results.forEach((wizard) => {
      grid.appendChild(
        createWizardCard(wizard, {
          includeButton: true,
          showSpoilers: state.showSpoilers,
        })
      );
    });
  };

  searchInput.addEventListener("input", (event) => {
    filters.search = event.target.value.trim().toLowerCase();
    render();
  });

  houseSelect.addEventListener("change", (event) => {
    filters.house = event.target.value;
    render();
  });

  yearSelect.addEventListener("change", (event) => {
    filters.year = event.target.value;
    render();
  });

  spoilerToggle.addEventListener("change", (event) => {
    state.showSpoilers = event.target.checked;
    storage.setItem("hogwartsSpoilersEnabled", String(state.showSpoilers));
    render();
  });

  render();
}

function initTimeline() {
  const timelineContainer = document.getElementById("timeline-list");
  const emptyState = document.getElementById("timeline-empty");

  if (!timelineContainer) return;

  if (!TIMELINE.length) {
    emptyState?.removeAttribute("hidden");
    return;
  }

  emptyState?.setAttribute("hidden", "true");
  timelineContainer.innerHTML = "";

  const grouped = groupBy(TIMELINE, (event) => event.year);

  Object.entries(grouped).forEach(([year, events]) => {
    const groupLabel = document.createElement("div");
    groupLabel.className = "timeline__group-label";
    groupLabel.innerHTML = `<span class="timeline__year">${year}</span>`;
    timelineContainer.appendChild(groupLabel);

    events.forEach((event) => {
      timelineContainer.appendChild(createTimelineItem(event));
    });
  });

  timelineContainer.addEventListener("click", (event) => {
    const toggleButton = event.target.closest("[data-timeline-toggle]");
    if (!toggleButton) return;
    const detailId = toggleButton.dataset.target;
    const panel = document.getElementById(detailId);
    if (!panel) return;
    const isOpen = panel.getAttribute("data-open") === "true";
    panel.setAttribute("data-open", String(!isOpen));
    toggleButton.setAttribute("aria-expanded", String(!isOpen));
  });
}

function initSpoilerBanner() {
  const banner = document.getElementById("spoiler-banner");
  if (!banner) return;

  const dismissed = storage.getItem("hogwartsSpoilerBannerDismissed") === "true";
  if (!dismissed) {
    banner.hidden = false;
  }

  const dismissButton = banner.querySelector("[data-banner-dismiss]");
  dismissButton?.addEventListener("click", () => {
    banner.hidden = true;
    storage.setItem("hogwartsSpoilerBannerDismissed", "true");
  });
}

function createHouseCard(house, { includeButton = true } = {}) {
  const article = document.createElement("article");
  article.className = "card";
  article.setAttribute("role", "listitem");

  const media = document.createElement("div");
  media.className = "card__media";
  media.innerHTML = `<img src="${house.img}" alt="${house.name} crest" loading="lazy" decoding="async" />`;

  const content = document.createElement("div");
  content.className = "card__content";
  content.innerHTML = `
    <span class="card__badge">House</span>
    <h3>${house.name}</h3>
    <p>${house.summary}</p>
    <ul class="tag-list" aria-label="House traits">
      ${house.traits.map((trait) => `<li>${trait}</li>`).join("")}
    </ul>
  `;

  article.append(media, content);

  if (includeButton) {
    const actions = document.createElement("div");
    actions.className = "card__actions";
    actions.innerHTML = `
      <button
        type="button"
        class="btn view-btn"
        data-id="${house.id}"
        data-type="villain"
        aria-haspopup="dialog"
      >
        View details
      </button>
    `;
    article.appendChild(actions);
  }

  return article;
}

function createWizardCard(wizard, { includeButton = true, showSpoilers = false } = {}) {
  const article = document.createElement("article");
  article.className = "card";
  article.setAttribute("role", "listitem");

  const media = document.createElement("div");
  media.className = "card__media";
  media.innerHTML = `<img src="${wizard.img}" alt="${wizard.name}" loading="lazy" decoding="async" />`;

  const content = document.createElement("div");
  content.className = "card__content";

  const summaryText =
    wizard.spoilerLevel === "high" && !showSpoilers
      ? `<p><em>Spoilers hidden. Toggle “Show spoilers” to reveal this profile.</em></p>`
      : `<p>${wizard.summary}</p>`;

  content.innerHTML = `
    <span class="house-tag" data-house="${wizard.house.toLowerCase()}">${wizard.house}</span>
    <h3>${wizard.name}</h3>
    ${summaryText}
  `;

  article.append(media, content);

  if (includeButton) {
    const actions = document.createElement("div");
    actions.className = "card__actions";
    actions.innerHTML = `
      <button
        type="button"
        class="btn view-btn"
        data-id="${wizard.id}"
        data-type="character"
        aria-haspopup="dialog"
      >
        View details
      </button>
    `;
    article.appendChild(actions);
  }

  return article;
}

function createTimelineItem(event) {
  const article = document.createElement("article");
  article.className = "timeline__item";

  const detailsId = `${event.id}-details`;
  article.innerHTML = `
    <div class="timeline__heading">
      <h3>${event.label}</h3>
      <span class="badge">${event.type === "house" ? "House" : "Wizard"}</span>
    </div>
    <p>${event.summary}</p>
    <div class="timeline__actions">
      <button
        type="button"
        class="timeline__toggle"
        data-timeline-toggle
        data-target="${detailsId}"
        aria-expanded="false"
      >
        Expand details
        <span aria-hidden="true">▾</span>
      </button>
      <button
        type="button"
        class="btn btn--ghost view-btn"
        data-id="${event.targetId}"
        data-type="${event.type === "house" ? "villain" : "character"}"
        aria-haspopup="dialog"
      >
        Open profile
      </button>
    </div>
    <div class="timeline__details" id="${detailsId}" data-open="false">
      <p>${event.details}</p>
    </div>
  `;

  return article;
}

function populateTraitFilter(select) {
  const traits = new Set();
  HOUSES.forEach((house) => {
    house.traits.forEach((trait) => traits.add(trait));
  });
  Array.from(traits)
    .sort()
    .forEach((trait) => {
      const option = document.createElement("option");
      option.value = trait.toLowerCase();
      option.textContent = trait;
      select.appendChild(option);
    });
}

function populateHouseFilter(select) {
  HOUSES.forEach((house) => {
    const option = document.createElement("option");
    option.value = house.id;
    option.textContent = house.name;
    select.appendChild(option);
  });
}

function populateYearFilter(select) {
  const years = new Set();
  WIZARDS.forEach((wizard) => {
    wizard.years.forEach((year) => years.add(year));
  });

  Array.from(years)
    .sort((a, b) => a - b)
    .forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = year;
      select.appendChild(option);
    });
}

function houseMatchesFilters(house, filters) {
  const matchesSearch =
    !filters.search || house.name.toLowerCase().includes(filters.search) || house.summary.toLowerCase().includes(filters.search);
  const matchesTrait =
    filters.trait === "all" || house.traits.some((trait) => trait.toLowerCase() === filters.trait);
  return matchesSearch && matchesTrait;
}

function wizardMatchesFilters(wizard, filters) {
  const matchesSearch =
    !filters.search ||
    wizard.name.toLowerCase().includes(filters.search) ||
    wizard.summary.toLowerCase().includes(filters.search);
  const matchesHouse = filters.house === "all" || wizard.house.toLowerCase() === filters.house;
  const matchesYear =
    filters.year === "all" || wizard.years.map(String).includes(filters.year);
  return matchesSearch && matchesHouse && matchesYear;
}

function pickRandom(collection) {
  return collection[Math.floor(Math.random() * collection.length)];
}

function groupBy(collection, keyGetter) {
  return collection.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function getSafeStorage() {
  try {
    const testKey = "__hogwarts_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
}

/* View Details: modal logic */
(function () {
  const modal = document.getElementById("detail-modal");
  if (!modal) return;

  const $ = (sel, root = modal) => root.querySelector(sel);
  const $$ = (sel, root = modal) => Array.from(root.querySelectorAll(sel));

  const els = {
    title: $("#detail-title"),
    summary: $("#detail-summary"),
    meta: $("#detail-meta"),
    img: $("#detail-img"),
    type: $("#detail-type"),
    aliases: $("#detail-aliases"),
    episodes: $("#detail-episodes"),
    closeBtns: $$("[data-close]"),
  };

  let lastFocus = null;

  function findItem(type, id) {
    if (type === "villain") {
      return HOUSES.find((item) => item.id === id);
    }
    return WIZARDS.find((item) => item.id === id);
  }

  function listToLis(arr) {
    if (!Array.isArray(arr) || !arr.length) {
      return "<li>—</li>";
    }
    return arr.map((value) => `<li>${value}</li>`).join("");
  }

  function renderMeta(item, type) {
    if (type === "villain") {
      const parts = [
        item.founder ? `<span class="badge">Founder: ${item.founder}</span>` : "",
        Array.isArray(item.colors)
          ? item.colors.map((color) => `<span class="badge">${color}</span>`).join(" ")
          : "",
        item.ghost ? `<span class="badge">Ghost: ${item.ghost}</span>` : "",
      ];
      return parts.filter(Boolean).join(" ");
    }

    const parts = [
      item.house ? `<span class="badge">House: ${item.house}</span>` : "",
      Array.isArray(item.years)
        ? item.years.map((year) => `<span class="badge">${year}</span>`).join(" ")
        : "",
      item.spoilerLevel === "high" ? `<span class="badge">Spoilers</span>` : "",
    ];
    return parts.filter(Boolean).join(" ");
  }

  function getSummary(item, type) {
    if (type === "character" && item.spoilerLevel === "high" && !state.showSpoilers) {
      return "Spoilers hidden. Enable spoilers to reveal this summary.";
    }
    return item.summary || "";
  }

  function renderAliases(item, type) {
    if (type === "villain") {
      return listToLis(item.traits);
    }
    return listToLis(item.aliases);
  }

  function renderEpisodes(item, type) {
    if (type === "villain") {
      const details = [
        item.mascot ? `Mascot: ${item.mascot}` : null,
        item.relic ? `Relic: ${item.relic}` : null,
        item.ghost ? `House Ghost: ${item.ghost}` : null,
      ].filter(Boolean);
      return listToLis(details);
    }
    return listToLis(item.notableEvents);
  }

  function openModal(type, id, trigger) {
    const item = findItem(type, id);
    if (!item) return;

    lastFocus = trigger || document.activeElement;

    els.title.textContent = item.name || "Details";
    els.summary.textContent = getSummary(item, type);
    els.img.src = item.img || "";
    els.img.alt = item.name ? `${item.name} image` : "Detail image";
    els.type.textContent = type === "villain" ? "House" : "Wizard";
    els.meta.innerHTML = renderMeta(item, type);
    els.aliases.innerHTML = renderAliases(item, type);
    els.episodes.innerHTML = renderEpisodes(item, type);

    if (type === "villain") {
      els.type.style.borderColor = "rgba(255,255,255,.12)";
      els.type.style.color = "#CFCFCF";
    } else {
      els.type.style.borderColor = "#8ab4f8";
      els.type.style.color = "#E6EDF3";
    }

    modal.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".modal__close");
    closeBtn?.focus();
  }

  function closeModal() {
    modal.classList.add("is-hidden");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-btn");
    if (!button) return;

    const id = button.getAttribute("data-id");
    const type = (button.getAttribute("data-type") || "").toLowerCase();
    if (!id || (type !== "villain" && type !== "character")) return;

    event.preventDefault();
    openModal(type, id, button);
  });

  els.closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.dataset.close === "backdrop") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (modal.classList.contains("is-hidden")) return;
    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "Tab") {
      const focusables = Array.from(
        modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
