/* ============================================================
   main.js — reads content.json and builds the entire page
   ============================================================ */

// ── SVG ICONS ───────────────────────────────────────────────
const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  orcid: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.872-2.862 3.872-3.722 0-2.016-1.284-3.722-3.891-3.722h-2.278z"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  paper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  bib: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="8" y2="12"/><line x1="12" y1="16" x2="8" y2="16"/></svg>`,

};

// ── HELPERS ─────────────────────────────────────────────────
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function statusLabel(s) {
  const map = { ongoing: 'Ongoing', published: 'Published', finished: 'Finished' };
  return map[s] || s;
}

// renders a real flag using the flag-icons library
// expects a 2-letter ISO country code, e.g. "DE", "FR", "CH"
function flagSpan(code) {
  if (!code) return null;
  const span = el('span', `fi fi-${code.toLowerCase()}`);
  span.style.fontSize = '1rem';
  span.style.lineHeight = '1';
  span.style.flexShrink = '0';
  span.setAttribute('title', code);
  return span;
}

// renders an institution logo img with graceful fallback (hides on error)
function logoImg(src, alt, heightPx) {
  if (!src) return null;
  const img = el('img');
  img.src = src;
  img.alt = alt || '';
  img.style.height = heightPx + 'px';
  img.style.width = 'auto';
  img.style.objectFit = 'contain';
  img.style.flexShrink = '0';
  // hide gracefully if file doesn't exist yet
  img.onerror = () => { img.style.display = 'none'; };
  return img;
}

// ── SIDEBAR ──────────────────────────────────────────────────
function buildSidebar(profile) {
  const sidebar = document.getElementById('sidebar');

  // photo
  const photoWrap = el('div', 'sidebar-photo-wrap');
  if (profile.photo) {
    const img = el('img'); img.src = profile.photo; img.alt = profile.name;
    photoWrap.appendChild(img);
  } else {
    photoWrap.appendChild(el('div', 'sidebar-photo-placeholder', '👤'));
  }
  sidebar.appendChild(photoWrap);

  sidebar.appendChild(el('div', 'sidebar-name', profile.name));
  sidebar.appendChild(el('div', 'sidebar-title', profile.title));
  if (profile.institution)
    sidebar.appendChild(el('div', 'sidebar-institution', profile.institution));

  sidebar.appendChild(el('hr', 'sidebar-divider'));
  sidebar.appendChild(el('div', 'sidebar-bio', profile.bio));
  sidebar.appendChild(el('hr', 'sidebar-divider'));

  // links
  const linksWrap = el('div', 'sidebar-links');

  if (profile.links?.github)
    linksWrap.appendChild(makeSidebarLink(profile.links.github, ICONS.github, 'GitHub'));
  if (profile.links?.orcid)
    linksWrap.appendChild(makeSidebarLink(profile.links.orcid, ICONS.orcid, 'ORCID'));
  if (profile.links?.scholar)
    linksWrap.appendChild(makeSidebarLink(profile.links.scholar, ICONS.scholar, 'Google Scholar'));

  if (profile.cv) {
    const cvBtn = el('a', 'cv-btn', `${ICONS.download} Download CV`);
    cvBtn.href = profile.cv; cvBtn.download = '';
    linksWrap.appendChild(cvBtn);
  }

  sidebar.appendChild(linksWrap);
}

function makeSidebarLink(href, iconSvg, label) {
  const a = el('a', 'sidebar-link', `${iconSvg} ${label}`);
  a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
}

// ── MOBILE TOP CARD ──────────────────────────────────────────
function buildMobileTopcard(profile) {
  const tc = document.getElementById('mobile-topcard');

  if (profile.photo) {
    const img = el('img'); img.src = profile.photo; img.alt = profile.name;
    img.className = 'topcard-photo'; tc.appendChild(img);
  } else {
    tc.appendChild(el('div', 'sidebar-photo-placeholder', '👤'));
  }

  tc.appendChild(el('div', 'topcard-name', profile.name));
  tc.appendChild(el('div', 'topcard-title', profile.title));
  if (profile.institution)
    tc.appendChild(el('div', 'topcard-title', profile.institution));

  const linksRow = el('div', 'topcard-links');
  if (profile.links?.github)
    linksRow.appendChild(makeSidebarLink(profile.links.github, ICONS.github, 'GitHub'));
  if (profile.links?.orcid)
    linksRow.appendChild(makeSidebarLink(profile.links.orcid, ICONS.orcid, 'ORCID'));
  if (profile.links?.scholar)
    linksRow.appendChild(makeSidebarLink(profile.links.scholar, ICONS.scholar, 'Scholar'));
  tc.appendChild(linksRow);

  if (profile.cv) {
    const cvBtn = el('a', 'cv-btn', `${ICONS.download} Download CV`);
    cvBtn.href = profile.cv; cvBtn.download = '';
    tc.appendChild(cvBtn);
  }
}

// ── CARD ──────────────────────────────────────────────────────
function buildCard(item) {
  const card = el('div', 'card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open details for ${item.title}`);

  // image
  if (item.image) {
    const img = el('img', 'card-image'); img.src = item.image; img.alt = item.title;
    card.appendChild(img);
  } else {
    card.appendChild(el('div', 'card-image-placeholder', '🌿'));
  }

  const body = el('div', 'card-body');

  // status + title
  const statusCls = `status-badge status-${item.status}`;
  // body.appendChild(el('span', statusCls, statusLabel(item.status)));
  body.appendChild(el('div', 'card-title', item.title));
  body.appendChild(el('div', 'card-abstract', item.abstract));

  // tags
  if (item.tags?.length) {
    const tagsRow = el('div', 'tags-row');
    item.tags.forEach(t => tagsRow.appendChild(el('span', 'tag', t)));
    body.appendChild(tagsRow);
  }

  // institution footer
  if (item.institution) {
    const instRow = el('div', 'card-institution');
    const flag = flagSpan(item.institution.country_code);
    if (flag) instRow.appendChild(flag);
    const logo = logoImg(item.institution.logo, item.institution.name, 16);
    if (logo) instRow.appendChild(logo);
    instRow.appendChild(el('span', '', item.institution.name));
    if (item.years) {
      const yr = el('span', '');
      yr.style.marginLeft = 'auto';
      yr.style.fontSize = '0.72rem';
      yr.textContent = item.years;
      instRow.appendChild(yr);
    }
    body.appendChild(instRow);
  }

  card.appendChild(body);

  // open modal on click or Enter
  const open = () => openModal(item);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

  return card;
}




// ── BIB FILE CACHE ────────────────────────────────────────────
let bibCache = null;

async function getBibEntry(key) {
  if (!key) return null;
  if (!bibCache) {
    try {
      const res = await fetch('references.bib');
      bibCache = res.ok ? await res.text() : '';
    } catch { bibCache = ''; }
  }
  // extract the @type{key, ... } block for this key
  const regex = new RegExp(`(@\\w+\\{${key},[\\s\\S]*?\\n\\})`, 'm');
  const match = bibCache.match(regex);
  return match ? match[1] : null;
}

async function copyBib(key, btn) {
  const entry = await getBibEntry(key);
  if (!entry) { btn.textContent = 'Not found'; return; }
  await navigator.clipboard.writeText(entry);
  btn.innerHTML = '✓ Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.innerHTML = `${ICONS.bib} Copy .bib`;
    btn.classList.remove('copied');
  }, 2000);
}

// ── FOCUS CARD ────────────────────────────────────────────────
function buildFocusCard(item) {
  const card = el('div', 'focus-card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open details for ${item.title}`);

  if (item.image) {
    const img = el('img', 'focus-card-image');
    img.src = item.image; img.alt = item.title;
    card.appendChild(img);
  } else {
    card.appendChild(el('div', 'focus-card-image-placeholder', '🔬'));
  }

  const body = el('div', 'focus-card-body');
  body.appendChild(el('div', 'focus-card-title', item.title));
  body.appendChild(el('div', 'focus-card-desc', item.description));
  card.appendChild(body);

  const open = () => openModal(item);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

  return card;
}




// ── SECTIONS ─────────────────────────────────────────────────
function buildSection(containerId, headingText, items) {
  const container = document.getElementById(containerId);
  if (!items?.length) { container.parentElement?.remove(); return; }

  container.innerHTML = '';
  const grid = el('div', 'cards-grid');
  items.forEach((item, i) => {
    const card = buildCard(item);
    card.style.animationDelay = `${i * 0.07}s`;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}



// ── MODAL ─────────────────────────────────────────────────────
function openModal(item) {
  const backdrop = document.getElementById('modal-backdrop');
  const content  = document.getElementById('modal-content');
  content.innerHTML = '';

  // close button
  const closeBtn = el('button', 'modal-close', ICONS.close);
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', closeModal);
  content.appendChild(closeBtn);

  // image
  if (item.image) {
    const img = el('img', 'modal-image'); img.src = item.image; img.alt = item.title;
    content.appendChild(img);
  } else {
    content.appendChild(el('div', 'modal-image-placeholder', '🌿'));
  }

  const body = el('div', 'modal-body');

  // title + status
  const headerRow = el('div', 'modal-header-row');
  headerRow.appendChild(el('div', 'modal-title', item.title));
  headerRow.appendChild(el('span', `status-badge status-${item.status}`, statusLabel(item.status)));
  body.appendChild(headerRow);

  // tags
  if (item.tags?.length) {
    const tagsRow = el('div', 'tags-row');
    item.tags.forEach(t => tagsRow.appendChild(el('span', 'tag', t)));
    body.appendChild(tagsRow);
  }

  // full description
  // body.appendChild(el('p', 'modal-description', item.full_description || item.abstract));
  const descEl = el('div', 'modal-description');
  body.appendChild(descEl);

  if (item.full_description?.endsWith('.md') || item.full_description?.endsWith('.txt')) {
    descEl.innerHTML = marked.parse(item.abstract || ''); // show abstract while loading
    fetch(item.full_description)
      .then(r => r.text())
      .then(text => { descEl.innerHTML = marked.parse(text); })
      .catch(() => { /* keep abstract fallback silently */ });
  } else if (item.full_description) {
    descEl.innerHTML = marked.parse(item.full_description);
  } else {
    descEl.innerHTML = marked.parse(item.abstract || '');
  }


  // meta grid
  const metaGrid = el('div', 'modal-meta-grid');

  if (item.years) {
    const m = el('div', 'modal-meta-item');
    m.appendChild(el('div', 'modal-meta-label', 'Period'));
    m.appendChild(el('div', 'modal-meta-value', item.years));
    metaGrid.appendChild(m);
  }

  if (item.collaborators?.length) {
    const m = el('div', 'modal-meta-item');
    m.appendChild(el('div', 'modal-meta-label', 'Collaborators'));
    // m.appendChild(el('div', 'modal-meta-value', item.collaborators.join(' · ')));

    const collabWrap = el('div', 'modal-meta-value modal-collaborators');
    item.collaborators.forEach((c, i) => {
      // support both old plain strings and new objects
      if (typeof c === 'string') {
        collabWrap.appendChild(el('span', '', c));
      } else {
        const nameEl = c.url
          ? el('a', 'collab-link', c.name)
          : el('span', '', c.name);
        if (c.url) {
          nameEl.href = c.url;
          nameEl.target = '_blank';
          nameEl.rel = 'noopener noreferrer';
        }
        const entry = el('span', 'collab-entry');
        entry.appendChild(nameEl);
        if (c.affiliation)
          entry.appendChild(el('span', 'collab-affiliation', ` (${c.affiliation})`));
        collabWrap.appendChild(entry);
      }
      // separator dot between entries
      if (i < item.collaborators.length - 1)
        collabWrap.appendChild(el('span', 'collab-sep', ' · '));
    });
    m.appendChild(collabWrap);

    metaGrid.appendChild(m);
  }

  if (metaGrid.children.length) body.appendChild(metaGrid);

  // institution block
  if (item.institution) {
    const inst = el('div', 'modal-institution-row');
    const flag = flagSpan(item.institution.country_code);
    if (flag) { flag.style.fontSize = '1.4rem'; inst.appendChild(flag); }
    const logo = logoImg(item.institution.logo, item.institution.name, 28);
    if (logo) inst.appendChild(logo);
    const textWrap = el('div');
    textWrap.appendChild(el('div', 'modal-institution-name', item.institution.name));
    if (item.years)
      textWrap.appendChild(el('div', 'modal-institution-years', item.years));
    inst.appendChild(textWrap);
    body.appendChild(inst);
  }

  // links
  const hasLinks = item.paper_url || item.github_url || item.video_url;
  if (hasLinks) {
    const linksRow = el('div', 'modal-links-row');
    if (item.paper_url) {
      const a = el('a', 'modal-link-btn btn-paper', `${ICONS.paper} Read Paper`);
      a.href = item.paper_url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      linksRow.appendChild(a);
    }
    if (item.github_url) {
      const a = el('a', 'modal-link-btn btn-github', `${ICONS.github} View on GitHub`);
      a.href = item.github_url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      linksRow.appendChild(a);
    }
    if (item.video_url) {
      const a = el('a', 'modal-link-btn btn-video', `${ICONS.video} Watch Presentation`);
      a.href = item.video_url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      linksRow.appendChild(a);
    }
    if (item.type === 'publication' && item.bib_key) {
      const bibBtn = el('button', 'modal-link-btn btn-bib', `${ICONS.bib} Copy .bib`);
      bibBtn.addEventListener('click', e => {
        e.stopPropagation();
        copyBib(item.bib_key, bibBtn);
      });
      linksRow.appendChild(bibBtn);
    }

    body.appendChild(linksRow);
  }

  content.appendChild(body);
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // trap focus
  content.focus?.();
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ── INIT ──────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('content.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('3 - data ok', data);

    const { profile, projects, ongoing } = data;

    // split projects and publications
    const projectItems     = (projects || []).filter(p => p.type === 'project');
    const publicationItems = (projects || []).filter(p => p.type === 'publication');
    const ongoingItems     = (ongoing || []).filter(p => p.type === 'ongoing');
    const focusItems       = (projects || []).filter(p => p.type === 'focus');  // ← inside try
    console.log('4 - filtered', { projectItems, publicationItems, focusItems });


    buildSidebar(profile);
    console.log('5 - sidebar ok');

    buildMobileTopcard(profile);
    console.log('6 - topcard ok');
    if (focusItems.length) {
      const focusContainer = document.getElementById('focus-grid');
      console.log('7 - focus container', focusContainer);

      focusContainer.innerHTML = '';
      console.log('8 - focus ok');

      const grid = el('div', 'focus-grid');
      focusItems.forEach((item, i) => {
        const card = buildFocusCard(item);
        card.style.animationDelay = `${i * 0.07}s`;
        grid.appendChild(card);
      });
      focusContainer.appendChild(grid);
    } else {
      document.getElementById('focus-section')?.remove();
    }

    buildSection('projects-grid',     'Projects',     projectItems);
    console.log('9 - projects ok');

    buildSection('publications-grid', 'Publications', publicationItems);

    console.log('10 - publications ok');

    // buildSection('ongoing-grid',      'Ongoing Research', ongoingItems);

    console.log('11 - ongoing ok');
    

    // hide empty sections
    if (!projectItems.length)     document.getElementById('projects-section')?.remove();
    if (!publicationItems.length) document.getElementById('publications-section')?.remove();
    if (!ongoingItems.length)     document.getElementById('ongoing-section')?.remove();

  } catch (err) {
  console.log('focus-grid el:', document.getElementById('focus-grid'));

  console.error('Actual error:', err);  // ← will show the real message
  document.getElementById('main-content').innerHTML =
    `<div class="error-banner">
      ⚠️ Error: <code>${err.message}</code>
    </div>`;
}
}

// ── MODAL CLOSE LISTENERS ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();

  const backdrop = document.getElementById('modal-backdrop');

  // click outside modal to close
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
