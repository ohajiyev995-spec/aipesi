(function () {
  const body = document.body;
  const page = body.dataset.page || '';

  const COLOR_MAP = {
    Scarlet: '#ae0001',
    Gold: '#d3a625',
    Emerald: '#2a623d',
    Silver: '#c0c0c0',
    Blue: '#0e1a40',
    Bronze: '#946b2d',
    Yellow: '#ecb939',
    Black: '#2d2d2d',
  };

  const getHouseMeta = (name) => {
    if (!window.HOUSES) return null;
    return window.HOUSES.find((house) => house.name === name || house.id === name);
  };

  const toggleNavigation = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) return;

    const updateState = (open) => {
      toggle.setAttribute('aria-expanded', open);
      menu.classList.toggle('open', open);
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      updateState(!isOpen);
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        updateState(false);
      }
    });
  };

  const initFeatured = () => {
    if (page !== 'home' || !window.HOUSES || !window.WIZARDS) return;
    const houseSpot = document.querySelector('[data-featured-house]');
    const wizardSpot = document.querySelector('[data-featured-wizard]');
    if (!houseSpot || !wizardSpot) return;

    const featuredHouse = window.HOUSES[0];
    const featuredWizard = window.WIZARDS[0];

    if (featuredHouse) {
      houseSpot.innerHTML = renderFeaturedHouse(featuredHouse);
    }

    if (featuredWizard) {
      wizardSpot.innerHTML = renderFeaturedWizard(featuredWizard);
    }
  };

  const renderFeaturedHouse = (house) => {
    const colors = house.colors
      .map((color) => {
        const hex = COLOR_MAP[color] || '#8ab4f8';
        return `<span class="house-color" style="background:${hex}" aria-hidden="true"></span>`;
      })
      .join('');

    const traits = house.traits
      .slice(0, 3)
      .map((trait) => `<span class="badge">${trait}</span>`) 
      .join('');

    return `
      <article class="featured-card">
        <div class="label">Featured House</div>
        <h3>${house.name}</h3>
        <div class="house-metadata">
          <span>Founder:&nbsp;${house.founder}</span>
          <span>Mascot:&nbsp;${house.mascot}</span>
        </div>
        <p>${house.summary}</p>
        <div class="house-colors" aria-label="House colors">${colors}</div>
        <div class="badges" aria-label="Traits">${traits}</div>
      </article>
    `;
  };

  const renderFeaturedWizard = (wizard) => {
    return `
      <article class="featured-card">
        <div class="label">Featured Wizard</div>
        <h3>${wizard.name}</h3>
        <p>${wizard.summary}</p>
        <p><strong>House:</strong>&nbsp;${wizard.house}</p>
        <p><strong>Notable:</strong>&nbsp;${wizard.notableEvents.slice(0, 2).join('&nbsp;•&nbsp;')}</p>
      </article>
    `;
  };

  const initHouseFilters = () => {
    if (page !== 'houses' || !window.HOUSES) return;

    const searchInput = document.querySelector('#house-search');
    const traitContainer = document.querySelector('#trait-filters');
    const cardsContainer = document.querySelector('#houses-grid');
    if (!cardsContainer) return;

    const traits = Array.from(
      new Set(window.HOUSES.flatMap((house) => house.traits))
    ).sort();

    if (traitContainer) {
      traitContainer.innerHTML = traits
        .map((trait) => {
          const id = `trait-${trait.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          return `
            <label for="${id}">
              <input type="checkbox" id="${id}" value="${trait}" name="traits" />
              <span>${trait}</span>
            </label>
          `;
        })
        .join('');
    }

    const getSelectedTraits = () => {
      return Array.from(
        document.querySelectorAll('input[name="traits"]:checked')
      ).map((input) => input.value);
    };

    const render = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const selectedTraits = getSelectedTraits();

      const filtered = window.HOUSES.filter((house) => {
        const matchesQuery = !query ||
          house.name.toLowerCase().includes(query) ||
          house.founder.toLowerCase().includes(query);

        const matchesTraits = selectedTraits.every((trait) =>
          house.traits.includes(trait)
        );

        return matchesQuery && matchesTraits;
      });

      if (!filtered.length) {
        cardsContainer.innerHTML = `<p role="status">No houses matched your search. Try a different trait or name.</p>`;
        return;
      }

      cardsContainer.innerHTML = filtered
        .map((house) => renderHouseCard(house))
        .join('');
    };

    searchInput?.addEventListener('input', render);
    traitContainer?.addEventListener('change', render);

    render();
  };

  const renderHouseCard = (house) => {
    const colors = house.colors
      .map((color) => {
        const hex = COLOR_MAP[color] || '#8ab4f8';
        return `<span class="house-color" style="background:${hex}" title="${color}"></span>`;
      })
      .join('');

    const traits = house.traits
      .map((trait) => `<span class="badge">${trait}</span>`)
      .join('');

    return `
      <article class="card house-card" tabindex="0">
        <figure class="house-image">
          <img src="${house.img}" alt="Crest of ${house.name}" loading="lazy" />
        </figure>
        <div class="label">House</div>
        <h3>${house.name}</h3>
        <div class="house-colors" aria-label="House colors">${colors}</div>
        <p>${house.summary}</p>
        <div class="badges" aria-label="Traits">${traits}</div>
      </article>
    `;
  };

  const initWizardFilters = () => {
    if (page !== 'wizards' || !window.WIZARDS || !window.HOUSES) return;

    const searchInput = document.querySelector('#wizard-search');
    const houseSelect = document.querySelector('#house-filter');
    const yearSelect = document.querySelector('#year-filter');
    const spoilerToggle = document.querySelector('#spoiler-toggle');
    const cardsContainer = document.querySelector('#wizards-grid');

    if (!cardsContainer) return;

    if (houseSelect) {
      const options = window.HOUSES
        .map((house) => `<option value="${house.name}">${house.name}</option>`)
        .join('');
      houseSelect.insertAdjacentHTML('beforeend', options);
    }

    if (yearSelect) {
      const years = Array.from(
        new Set(window.WIZARDS.flatMap((wizard) => wizard.years))
      )
        .sort((a, b) => a - b);

      const options = years
        .map((year) => `<option value="${year}">${year}</option>`)
        .join('');
      yearSelect.insertAdjacentHTML('beforeend', options);
    }

    const spoilerKey = 'hogwartsSpoilersRevealed';
    const persistedSpoiler = localStorage.getItem(spoilerKey) === 'true';
    if (spoilerToggle) {
      spoilerToggle.setAttribute('aria-checked', persistedSpoiler);
      spoilerToggle.dataset.label = persistedSpoiler ? 'On' : 'Off';
    }

    const render = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const houseValue = houseSelect?.value || 'all';
      const yearValue = yearSelect?.value || 'all';
      const showSpoilers = spoilerToggle?.getAttribute('aria-checked') === 'true';

      const results = window.WIZARDS.filter((wizard) => {
        const matchesQuery = !query ||
          wizard.name.toLowerCase().includes(query) ||
          wizard.aliases.some((alias) => alias.toLowerCase().includes(query));

        const matchesHouse = houseValue === 'all' || wizard.house === houseValue;
        const matchesYear = yearValue === 'all' || wizard.years.includes(Number(yearValue));

        return matchesQuery && matchesHouse && matchesYear;
      });

      if (!results.length) {
        cardsContainer.innerHTML = `<p role="status">No wizards found. Adjust your search or filters.</p>`;
        return;
      }

      cardsContainer.innerHTML = results
        .map((wizard) => renderWizardCard(wizard, showSpoilers))
        .join('');
    };

    searchInput?.addEventListener('input', render);
    houseSelect?.addEventListener('change', render);
    yearSelect?.addEventListener('change', render);

    spoilerToggle?.addEventListener('click', () => {
      const current = spoilerToggle.getAttribute('aria-checked') === 'true';
      const next = !current;
      spoilerToggle.setAttribute('aria-checked', next);
      spoilerToggle.dataset.label = next ? 'On' : 'Off';
      localStorage.setItem(spoilerKey, String(next));
      render();
    });

    render();
  };

  const renderWizardCard = (wizard, showSpoilers) => {
    const houseMeta = getHouseMeta(wizard.house);
    const color = houseMeta?.colors?.[0];
    const hex = color ? (COLOR_MAP[color] || '#8ab4f8') : '#8ab4f8';
    const hideSpoiler = wizard.spoilerLevel === 'high' && !showSpoilers;

    const badges = wizard.aliases.length
      ? `<div class="badges" aria-label="Aliases">${wizard.aliases
          .map((alias) => `<span class="badge">${alias}</span>`)
          .join('')}</div>`
      : '';

    return `
      <article class="card wizard-card" ${hideSpoiler ? 'data-spoiler="hidden"' : ''} tabindex="0">
        <figure class="wizard-image">
          <img src="${wizard.img}" alt="Portrait of ${wizard.name}" loading="lazy" />
        </figure>
        <div class="house-badge" style="border-color:${hex}; color:${hex}">
          <span aria-hidden="true" style="width:10px;height:10px;border-radius:999px;background:${hex};display:inline-block;"></span>
          ${wizard.house}
        </div>
        <h3>${wizard.name}</h3>
        <p class="card-content">${wizard.summary}</p>
        <p><strong>Notable:</strong>&nbsp;${wizard.notableEvents.join('&nbsp;•&nbsp;')}</p>
        ${badges}
      </article>
    `;
  };

  const initTimeline = () => {
    if (page !== 'timeline' || !window.HOUSES || !window.WIZARDS) return;
    const container = document.querySelector('#timeline-root');
    if (!container) return;

    const sections = buildTimelineSections();

    container.innerHTML = sections
      .map((section) => {
        const events = section.events
          .map((event) => `
            <article class="timeline-event" id="${event.id}">
              <h4>${event.title}</h4>
              <p>${event.summary}</p>
              <p><small>${event.meta}</small></p>
            </article>
          `)
          .join('');

        return `
          <section class="timeline-section" aria-labelledby="${section.id}-heading">
            <h3 id="${section.id}-heading">${section.label}</h3>
            <div class="grid-auto">${events}</div>
          </section>
        `;
      })
      .join('');
  };

  const buildTimelineSections = () => {
    const sections = [];

    sections.push({
      id: 'houses',
      label: 'Legendary Houses',
      events: window.HOUSES.map((house) => ({
        id: `house-${house.id}`,
        title: house.name,
        summary: `${house.summary} <br /><strong>Founder:</strong>&nbsp;${house.founder}&nbsp;•&nbsp;<strong>Relic:</strong>&nbsp;${house.relic}`,
        meta: `Mascot:&nbsp;${house.mascot}&nbsp;•&nbsp;Ghost:&nbsp;${house.ghost}`,
      })),
    });

    const yearMap = new Map();

    window.WIZARDS.forEach((wizard) => {
      const year = wizard.years[wizard.years.length - 1];
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year).push({
        id: `wizard-${wizard.id}-${year}`,
        title: wizard.name,
        summary: wizard.summary,
        meta: `House:&nbsp;${wizard.house}&nbsp;•&nbsp;Notable:&nbsp;${wizard.notableEvents.join(', ')}`,
      });
    });

    const orderedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);

    orderedYears.forEach((year) => {
      sections.push({
        id: `year-${year}`,
        label: `Year ${year}`,
        events: yearMap.get(year),
      });
    });

    return sections;
  };

  const initSpoilerBanner = () => {
    if (!['wizards', 'timeline'].includes(page)) return;
    const banner = document.querySelector('#spoiler-banner');
    if (!banner) return;

    const storageKey = 'hogwartsSpoilerBannerDismissed';
    const isDismissed = localStorage.getItem(storageKey) === 'true';
    if (isDismissed) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    const dismissButton = banner.querySelector('button[data-dismiss]');
    dismissButton?.addEventListener('click', () => {
      banner.hidden = true;
      localStorage.setItem(storageKey, 'true');
    });
  };

  const initLazySupport = () => {
    if ('loading' in HTMLImageElement.prototype) return;
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      if (!img.dataset.src) {
        img.dataset.src = img.src;
      }
      img.removeAttribute('loading');
      img.src = img.dataset.src;
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    toggleNavigation();
    initFeatured();
    initHouseFilters();
    initWizardFilters();
    initTimeline();
    initSpoilerBanner();
    initLazySupport();
  });
})();
