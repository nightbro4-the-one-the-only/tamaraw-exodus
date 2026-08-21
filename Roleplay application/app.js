/* ============================================================
   TAMARAW EXODUS — site interactions (multi-page)
   One script, four pages. Every feature checks for its own
   elements first, so it runs only where they exist:
     index.html  — nav, reveal, countdown clock
     story.html  — nav, reveal, chapter reader
     lore.html   — nav, reveal, gallery lightbox
     rp.html     — nav, reveal, countdown clock, scenario picker
   ============================================================ */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  /* ---------- nav: scrolled state + current page ---------- */
  const nav = $('siteNav');
  const navToggle = $('navToggle');
  const navLinks = $('navLinks');

  // Highlight the link for the page we are actually on.
  if (navLinks) {
    const here = location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === here) a.classList.add('active');
    });
  }

  if (nav) {
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 20);

      // Scrollspy only for same-page anchor links (multi-page links stay put).
      let current = '';
      const probe = window.scrollY + window.innerHeight * 0.35;
      document.querySelectorAll('section[id]').forEach(sec => {
        if (sec.offsetTop <= probe) current = sec.id;
      });
      document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) {
          a.classList.toggle('active', href === '#' + current);
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- theme: light / dark (persisted) ---------- */
  const themeToggle = $('themeToggle');
  if (themeToggle) {
    const applyTheme = t => {
      document.documentElement.dataset.theme = t;
      themeToggle.textContent = t === 'light' ? '☀' : '☾';
      themeToggle.setAttribute('aria-label',
        t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      themeToggle.title = t === 'light' ? 'Switch to night mode' : 'Switch to light mode';
      try { localStorage.setItem('tx-theme', t); } catch (e) { /* ignore */ }
    };
    let theme = 'dark';
    try { theme = localStorage.getItem('tx-theme') || 'dark'; } catch (e) { /* ignore */ }
    applyTheme(theme);
    themeToggle.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ---------- countdown clock ---------- */
  // Canon: Earth has three years left from the day the truth came out.
  // We anchor "the day the truth came out" to a fixed real date so the
  // countdown is deterministic. Edit ANCHOR to retune.
  const ANCHOR = Date.UTC(2026, 0, 1); // real anchor: the truth is announced
  const THREE_YEARS_DAYS = 3 * 365;

  function countdown() {
    const elapsed = Math.floor((Date.now() - ANCHOR) / 86400000);
    const remaining = Math.max(0, THREE_YEARS_DAYS - elapsed);
    const year = Math.min(3, Math.floor(elapsed / 365) + 1);
    const dayInYear = elapsed % 365 + 1;
    const read = `Year ${year} of 3 · Day ${dayInYear} · ${remaining} days remain`;
    const el = $('clockRead');
    const foot = $('clockFoot');
    if (el) el.textContent = read;
    if (foot) foot.textContent = read;
    // Keep the world-state banner's day in sync with the clock when the GM's Desk
    // hasn't set its own in-story day.
    const wbDayEl = $('wbDay');
    if (wbDayEl) {
      let deskDay = '';
      try { deskDay = localStorage.getItem('tx-gm-day') || ''; } catch (e) { /* ignore */ }
      if (!deskDay) wbDayEl.textContent = read;
    }
  }
  if ($('clockRead') || $('clockFoot')) {
    countdown();
    setInterval(countdown, 60000);
  }

  /* ---------- scenario picker (rp.html) ---------- */
  const card = $('scenarioCard');
  if (card) {
    const STATES = {
      war: {
        era: 'Era I · Year −20',
        title: 'The Long War',
        points: [
          'Nations locked in a war with no end; diplomacy has already lost.',
          'The Philippines spends its fleets and its islands in the fighting.',
          'Every ambition is a reason to keep fighting; every grudge is a reason not to stop.',
          'No one is asking what happens after.'
        ],
        note: 'The world still looks like it will last forever. Begin as a soldier, a captain, a nation — and decide what you are willing to spend.'
      },
      unity: {
        era: 'Era II · Year 0',
        title: 'The Unification',
        points: [
          'One man has ended the war. All of mankind is one nation, working as one.',
          'The world is dead around them — nothing grows, nothing heals, nothing lasts.',
          'The truth has not yet been spoken: three years. No one knows it is a countdown.',
          'Hope, and dread, in equal measure.'
        ],
        note: 'The peace you always wanted, at the price of the world that made it possible. Begin as a citizen of the One Nation — and wonder what the man who united you is not saying.'
      },
      years: {
        era: 'Era II → III · Years 0 to 3',
        title: 'The Three Years',
        points: [
          'The truth is out: Earth becomes mankind\u2019s grave in three years.',
          'Mankind stops fighting to survive and starts working to be remembered.',
          'A continent like Atlantis has risen from the sea, bearing a gate to the unknown.',
          'Every nation on Earth is building what it can carry — or deciding to stay.'
        ],
        note: 'The miracle has happened, and no one knows if it is salvation or doom. Begin as a nation building its fleet, or as one of the stayers who will not board it.'
      },
      exodus: {
        era: 'Era III · the port of Manila',
        title: 'The Exodus',
        points: [
          'In the ruins of Manila, the Tamaraw is being retrofitted — the capital ship of what was once the Philippines.',
          'Civvies become crew; enlistment credit buys families a place aboard; the barges wait, full of hope.',
          'The emergency government\u2019s directive is clear: the ship comes before the settlers.',
          'One admiral has quietly decided that no one gets left behind.'
        ],
        note: 'The story as it begins. Begin as Jaz, as Cruz, as a refugee on the dock — or as the ship herself, being asked to carry the world.'
      }
    };
    const scEra = $('scEra');
    const scTitle = $('scTitle');
    const scPoints = $('scPoints');
    const scNote = $('scNote');

    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const s = STATES[btn.dataset.era];
        if (!s) return;
        card.classList.add('swapping');
        setTimeout(() => {
          scEra.textContent = s.era;
          scTitle.textContent = s.title;
          scPoints.innerHTML = s.points.map(p => '<li>' + p + '</li>').join('');
          scNote.textContent = s.note;
          card.classList.remove('swapping');
        }, 200);
      });
    });
  }

  /* ---------- gallery lightbox (lore.html) ---------- */
  const lb = $('lightbox');
  if (lb) {
    const lbImg = $('lbImg');
    let items = [];
    let index = 0;

    function openLb(i) {
      index = i;
      lbImg.src = items[index].getAttribute('data-full');
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.hidden = true;
      document.body.style.overflow = '';
    }
    function step(d) {
      index = (index + d + items.length) % items.length;
      lbImg.src = items[index].getAttribute('data-full');
    }

    function bindGallery(root) {
      const btns = Array.from(root.querySelectorAll('.g-item'));
      if (!btns.length) return;
      const base = items.length;
      items = items.concat(btns);
      btns.forEach((b, i) => b.addEventListener('click', () => openLb(base + i)));
    }
    const atlas = $('atlas');
    if (atlas) bindGallery(atlas);

    $('lbClose').addEventListener('click', closeLb);
    $('lbPrev').addEventListener('click', () => step(-1));
    $('lbNext').addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- chapter reader (story.html) ---------- */
  const chapterList = $('chapterList');
  if (chapterList) {
    const cnPrev = $('cnPrev');
    const cnNext = $('cnNext');
    const fontMinus = $('fontMinus');
    const fontPlus = $('fontPlus');
    const fontSizeLabel = $('fontSizeLabel');
    const chapterNav = $('chapterNav');

    // Merge consecutive parts of the same chapter into one unit.
    const chapters = (window.CHAPTERS || []).slice();
    const merged = [];
    for (const ch of chapters) {
      const last = merged[merged.length - 1];
      if (last && last.title === ch.title) {
        last.paragraphs = last.paragraphs.concat(ch.paragraphs);
      } else {
        merged.push({ title: ch.title, subtitle: ch.subtitle, paragraphs: ch.paragraphs.slice() });
      }
    }

    let current = 0;

    /* font size (persisted) */
    let size = 17;
    try { size = parseInt(localStorage.getItem('tx-font-size') || '17', 10); } catch (e) { /* ignore */ }
    size = Math.max(14, Math.min(22, size));
    function applyFont() {
      chapterList.style.fontSize = size + 'px';
      fontSizeLabel.textContent = size + 'px';
      try { localStorage.setItem('tx-font-size', String(size)); } catch (e) { /* ignore */ }
    }

    function renderToc() {
      const sel = $('csSelect');
      const count = $('csCount');
      sel.innerHTML = merged.map((ch, i) =>
        '<option value="' + i + '">' + (ch.subtitle || 'Chapter ' + (i + 1)) + ' \u2014 ' + ch.title + '</option>'
      ).join('');
      sel.value = current;
      if (count) count.textContent = (current + 1) + ' / ' + merged.length;
      sel.addEventListener('change', () => goTo(parseInt(sel.value, 10), true));
    }

    function renderChapter() {
      const ch = merged[current];
      const paras = ch.paragraphs.map(p => '<p>' + p + '</p>').join('');
      chapterList.innerHTML =
        '<article class="chapter">' +
        '<header class="chapter-head">' +
        '<span class="chapter-tag">' + (ch.subtitle || 'Chapter ' + (current + 1)) + '</span>' +
        '<h3>' + ch.title + '</h3>' +
        '</header>' +
        '<div class="chapter-body">' + paras + '</div>' +
        '</article>';
      const sel = $('csSelect');
      const count = $('csCount');
      if (sel) sel.value = current;
      if (count) count.textContent = (current + 1) + ' / ' + merged.length;
      cnPrev.disabled = current === 0;
      cnNext.disabled = current === merged.length - 1;
      applyFont();
      // Reset progress bar on chapter change.
      const progressFill = $('progressFill');
      if (progressFill) { progressFill.style.width = '0%'; }
    }

    function goTo(i, scroll) {
      current = Math.max(0, Math.min(merged.length - 1, i));
      renderChapter();
      if (scroll) {
        const bar = $('readerBar');
        const top = bar.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }

    cnPrev.addEventListener('click', () => goTo(current - 1, true));
    cnNext.addEventListener('click', () => goTo(current + 1, true));
    fontMinus.addEventListener('click', () => { size = Math.max(14, size - 1); applyFont(); });
    fontPlus.addEventListener('click', () => { size = Math.min(22, size + 1); applyFont(); });

    /* keyboard shortcuts */
    document.addEventListener('keydown', e => {
      // Ignore when typing in an input, textarea, or select.
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      // Ignore if the lightbox is open (it handles its own keys).
      const lb = $('lightbox');
      if (lb && !lb.hidden) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(current - 1, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(current + 1, true);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        size = Math.min(22, size + 1); applyFont();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        size = Math.max(14, size - 1); applyFont();
      } else if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    renderToc();
    renderChapter();
    if (merged.length < 2) chapterNav.hidden = true;

    /* reading progress bar */
    const progressFill = $('progressFill');
    const progressBar = $('progressBar');
    if (progressFill && progressBar) {
      function updateProgress() {
        const chapter = chapterList.querySelector('.chapter');
        if (!chapter) return;
        const rect = chapter.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = rect.height;
        const scrolled = window.scrollY - top + window.innerHeight * 0.3;
        const pct = Math.max(0, Math.min(100, (scrolled / height) * 100));
        progressFill.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));
      }
      window.addEventListener('scroll', updateProgress, { passive: true });
      setTimeout(updateProgress, 50);
    }

    /* keyword search */
    const searchInput = $('searchInput');
    const searchClear = $('searchClear');
    const searchCount = $('searchCount');
    const searchResults = $('searchResults');
    if (searchInput && searchResults) {
      let searchTimeout = null;

      function escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
        return text.replace(regex, '<mark class="search-hl">$1</mark>');
      }

      function doSearch() {
        const query = searchInput.value.trim();
        if (!query || query.length < 2) {
          searchResults.hidden = true;
          searchResults.innerHTML = '';
          searchCount.textContent = '';
          searchClear.hidden = true;
          chapterList.style.display = '';
          return;
        }

        searchClear.hidden = false;
        const lower = query.toLowerCase();
        const results = [];

        merged.forEach((ch, ci) => {
          ch.paragraphs.forEach((p, pi) => {
            if (p.toLowerCase().includes(lower)) {
              results.push({ ci, pi, ch, para: p });
            }
          });
        });

        if (results.length === 0) {
          searchResults.innerHTML = '<p class="search-empty">No results found for \u201c' + esc(query) + '\u201d</p>';
          searchResults.hidden = false;
          searchCount.textContent = '0 results';
          chapterList.style.display = 'none';
          return;
        }

        searchCount.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '');

        let html = '';
        results.slice(0, 100).forEach(r => {
          const snippet = r.para.length > 200 ? r.para.slice(0, 200) + '...' : r.para;
          const label = (r.ch.subtitle || 'Ch. ' + (r.ci + 1)) + ' — ' + r.ch.title;
          html += '<button class="search-item" data-chapter="' + r.ci + '">' +
            '<span class="search-chapter">' + esc(label) + '</span>' +
            '<span class="search-snippet">' + highlightText(esc(snippet), query) + '</span>' +
            '</button>';
        });
        if (results.length > 100) {
          html += '<p class="search-more">...and ' + (results.length - 100) + ' more results</p>';
        }
        searchResults.innerHTML = html;
        searchResults.hidden = false;
        chapterList.style.display = '';

        // Bind click handlers to jump to chapter.
        searchResults.querySelectorAll('.search-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const ci = parseInt(btn.dataset.chapter, 10);
            goTo(ci, true);
            searchInput.value = '';
            searchResults.hidden = true;
            searchCount.textContent = '';
            searchClear.hidden = true;
          });
        });
      }

      function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
      }

      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(doSearch, 300);
      });

      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          doSearch();
          searchInput.blur();
        }
      });

      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        doSearch();
      });
    }
  }

  /* ---------- the GM's desk (gm.html) ---------- */
  const desk = $('gmDesk');
  if (desk) {
    const store = {
      get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
      set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
      getJSON(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
      setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
    };

    const $ = id => document.getElementById(id);
    const era = $('gmEra'), day = $('gmDay'), scale = $('gmScale');
    const events = $('gmEvents'), pendText = $('gmPending');
    const player = $('gmPlayer'), char = $('gmChar'), where = $('gmWhere'), move = $('gmMove');
    const key = $('gmKey'), model = $('gmModel');
    const out = $('gmOut'), draftText = $('gmDraftText');
    const status = $('gmStatus');

    const FIELD_KEYS = [
      [era, 'tx-gm-era'], [day, 'tx-gm-day'], [scale, 'tx-gm-scale'],
      [events, 'tx-gm-events'], [pendText, 'tx-gm-pending'],
      [player, 'tx-gm-player'], [char, 'tx-gm-char'], [where, 'tx-gm-where'], [move, 'tx-gm-move']
    ];
    // hydrate
    for (const [el, k] of FIELD_KEYS) {
      const v = store.get(k, '');
      if (v) el.value = v;
      el.addEventListener('input', () => store.set(k, el.value));
    }
    key.value = store.get('tx-gm-key', '');
    model.value = store.get('tx-gm-model', 'openrouter/free');
    key.addEventListener('input', () => store.set('tx-gm-key', key.value));
    model.addEventListener('input', () => store.set('tx-gm-model', model.value));

    function setStatus(msg, ok) {
      status.textContent = msg;
      status.className = 'desk-status' + (ok ? ' ok' : ' err');
    }

    function buildSystemPrompt() {
      return [
        'You are the game master of Tamaraw Exodus, a cause-and-reaction roleplay set on a dying Earth with three years left, where a continent like Atlantis has risen from the sea bearing a gate to a new world.',
        'Write like the novel: spare, cinematic, grounded, human. Do not invent new canon (new named places, people, or powers) unless the move demands an answer; when in doubt, leave the door open.',
        '',
        'THE FOUR RULES OF THE WORLD (obey them strictly):',
        '1. Nothing lands on the same day. Every action is a ticket with a due date. Travel takes hours; building takes days; news travels at the speed of ships, riders, and rumor.',
        '2. Consequences arrive late. A battle resolves in a day; news reaches the next nation in two; an embargo bites in three; refugees arrive in five. Cause and reaction are never the same event — always show the gap between them.',
        '3. The world tells you before it happens. Include a warning line: what is coming, and how long the players have to act (e.g. \u201cthe siege continues — if unbroken, the city falls in four days\u201d).',
        '4. Every scale, one world. A person\u2019s prices, safety, and news are shaped by their nation, rippling down through the same clock.',
        '',
        'Return exactly four labeled sections, plain text:',
        'WHAT HAPPENS NOW — the immediate, same-day reaction to the move.',
        'WHAT LANDS LATER — the delayed consequence, and the day it lands.',
        'THE WORLD WARNS — the \u201cif unbroken...\u201d line, with the time the player has.',
        'THE HOOK — one line of follow-on tension to pull the next move.',
        'End with a final line: LANDS ON DAY: <the day the delayed consequence lands>'
      ].join('\n');
    }

    function buildUserPrompt() {
      return [
        'CURRENT WORLD STATE:',
        '- Era: ' + era.value + ' (' + era.options[era.selectedIndex].text + ')',
        '- Day: ' + (day.value || 'unknown'),
        '- Scale of this move: ' + scale.options[scale.selectedIndex].text,
        '- Recent events (Chronicle): ' + (events.value.trim() || 'none yet'),
        '- Pending consequences: ' + (pendText.value.trim() || 'none'),
        '',
        'THE MOVE:',
        '- Player: ' + (player.value.trim() || 'unknown'),
        '- Character: ' + (char.value.trim() || 'unknown'),
        '- Location: ' + (where.value.trim() || 'unknown'),
        '- The move: ' + (move.value.trim() || '(no move written)')
      ].join('\n');
    }

    function fullPrompt() {
      return 'SYSTEM:\n' + buildSystemPrompt() + '\n\nUSER:\n' + buildUserPrompt();
    }

    function parseDueDay(text) {
      const m = /LANDS ON DAY:\s*([^\n]+)/i.exec(text);
      return m ? m[1].trim() : '';
    }

    /* --- AI draft --- */
    $('gmDraft').addEventListener('click', async () => {
      if (!key.value.trim()) {
        setStatus('Add your OpenRouter key in the AI setup below (free models work), or use \u201cCopy prompt\u201d.', false);
        return;
      }
      setStatus('Drafting — the world is listening…', false);
      const btn = $('gmDraft');
      btn.disabled = true;
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key.value.trim(),
            'HTTP-Referer': location.origin,
            'X-Title': 'Tamaraw Exodus GM Desk'
          },
          body: JSON.stringify({
            model: model.value,
            temperature: 0.8,
            messages: [
              { role: 'system', content: buildSystemPrompt() },
              { role: 'user', content: buildUserPrompt() }
            ]
          })
        });
        const data = await res.json();
        if (!res.ok) {
          const err = (data && data.error && (data.error.message || data.error.code)) || ('HTTP ' + res.status);
          setStatus('The assistant replied with an error: ' + err + '. Check the key and model, then try again.', false);
          return;
        }
        const text = data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content : '';
        if (!text) { setStatus('The assistant returned an empty draft. Try again.', false); return; }
        draftText.value = text;
        out.hidden = false;
        setStatus('Draft ready — edit it, then approve it into the Ledger.', true);
      } catch (e) {
        setStatus('Could not reach the assistant: ' + e.message + '. Use \u201cCopy prompt\u201d instead.', false);
      } finally {
        btn.disabled = false;
      }
    });

    /* --- copy prompt (no-key fallback) --- */
    $('gmCopyPrompt').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(fullPrompt());
        setStatus('Prompt copied — paste it into any AI chat to draft the consequence.', true);
      } catch (e) {
        setStatus('Could not copy automatically — select the text in the page and copy it manually.', false);
      }
    });

    /* --- approve into ledger --- */
    $('gmApprove').addEventListener('click', () => {
      const text = draftText.value.trim();
      if (!text) { setStatus('Nothing to approve — the draft is empty.', false); return; }
      const ledger = store.getJSON('tx-gm-ledger', []);
      ledger.unshift({
        id: Date.now(),
        cause: (char.value.trim() || 'A player') + ' — ' + (move.value.trim().slice(0, 90) || 'a move'),
        effect: text,
        due: parseDueDay(text),
        status: 'pending'
      });
      store.setJSON('tx-gm-ledger', ledger);
      out.hidden = true;
      draftText.value = '';
      renderLedger();
      setStatus('Approved — the consequence is now a ticket in the Ledger, waiting for its day.', true);
    });

    $('gmCopyDraft').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(draftText.value);
        setStatus('Draft copied.', true);
      } catch (e) {
        setStatus('Could not copy automatically — select and copy manually.', false);
      }
    });

    /* --- ledger + chronicle --- */
    function esc(s) {
      return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }

    function renderLedger() {
      const ledger = store.getJSON('tx-gm-ledger', []);
      const empty = $('gmLedgerEmpty');
      empty.hidden = ledger.length > 0;
      const box = $('gmLedger');
      box.querySelectorAll('.ledger-item').forEach(n => n.remove());
      for (const t of ledger) {
        const div = document.createElement('div');
        div.className = 'ledger-item';
        div.innerHTML =
          '<div class="ledger-head"><strong>' + esc(t.cause) + '</strong>' +
          '<span class="ledger-due">due: ' + (esc(t.due) || '—') + '</span></div>' +
          '<pre class="ledger-effect">' + esc(t.effect) + '</pre>' +
          '<button class="btn btn-small" data-resolve="' + t.id + '">✓ Resolve — into the Chronicle</button>';
        box.appendChild(div);
      }
      box.querySelectorAll('[data-resolve]').forEach(b =>
        b.addEventListener('click', () => resolveTicket(parseInt(b.dataset.resolve, 10)))
      );
    }

    function resolveTicket(id) {
      const ledger = store.getJSON('tx-gm-ledger', []);
      const ticket = ledger.find(t => t.id === id);
      if (!ticket) return;
      const chronicle = store.getJSON('tx-gm-chronicle', []);
      chronicle.push({
        id: Date.now(),
        day: ticket.due || day.value || 'day unknown',
        entry: ticket.effect
      });
      store.setJSON('tx-gm-chronicle', chronicle);
      store.setJSON('tx-gm-ledger', ledger.filter(t => t.id !== id));
      renderLedger();
      renderChronicle();
      setStatus('Resolved — the world moves on. The event now lives in the Chronicle.', true);
    }

    function renderChronicle() {
      const chronicle = store.getJSON('tx-gm-chronicle', []);
      const empty = $('gmChronicleEmpty');
      empty.hidden = chronicle.length > 0;
      const box = $('gmChronicle');
      box.querySelectorAll('.chronicle-entry').forEach(n => n.remove());
      for (const c of chronicle) {
        const div = document.createElement('div');
        div.className = 'chronicle-entry';
        div.innerHTML = '<span class="chronicle-day">' + esc(c.day) + '</span><p>' + esc(c.entry) + '</p>';
        box.appendChild(div);
      }
    }

    $('gmCopyChronicle').addEventListener('click', async () => {
      const chronicle = store.getJSON('tx-gm-chronicle', []);
      const text = chronicle.map(c => c.day + ' — ' + c.entry).join('\n\n');
      try {
        await navigator.clipboard.writeText(text);
        setStatus('Chronicle copied — paste it into \u201cRecent events\u201d or the Roleplay page.', true);
      } catch (e) {
        setStatus('Could not copy automatically.', false);
      }
    });

    renderLedger();
    renderChronicle();
  }

  /* ---------- public Chronicle (rp.html) ---------- */
  // Reads the same browser storage the GM's Desk writes, so the world's
  // history appears here the moment the author resolves an event.
  const rpChronicle = $('rpChronicle');
  if (rpChronicle) {
    const esc = s => String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    function renderRpChronicle() {
      let chronicle = [];
      try { chronicle = JSON.parse(localStorage.getItem('tx-gm-chronicle')) || []; } catch (e) { /* ignore */ }
      const empty = $('rpChronicleEmpty');
      empty.hidden = chronicle.length > 0;
      rpChronicle.querySelectorAll('.chronicle-entry').forEach(n => n.remove());
      // The desk stores oldest -> newest; show newest first.
      const newest = chronicle.slice().reverse();
      for (const c of newest) {
        const div = document.createElement('div');
        div.className = 'chronicle-entry';
        div.innerHTML = '<span class="chronicle-day">' + esc(c.day) + '</span><p>' + esc(c.entry) + '</p>';
        rpChronicle.appendChild(div);
      }
    }

    renderRpChronicle();
    // Live update when the GM's Desk (another tab, same origin) resolves an event.
    window.addEventListener('storage', e => {
      if (e.key === 'tx-gm-chronicle') renderRpChronicle();
    });
  }

  /* ---------- world-state banner (rp.html) ---------- */
  // Shows era + day + latest Chronicle entry, fed by the GM's Desk.
  const wbEra = $('wbEra');
  if (wbEra) {
    const ERA_LABELS = {
      war: 'The Long War',
      unity: 'The Unification',
      years: 'The Three Years',
      exodus: 'The Exodus'
    };
    const wbDay = $('wbDay');
    const wbLatest = $('wbLatest');

    function renderBanner() {
      let era = '', day = '', chronicle = [];
      try {
        era = localStorage.getItem('tx-gm-era') || '';
        day = localStorage.getItem('tx-gm-day') || '';
        chronicle = JSON.parse(localStorage.getItem('tx-gm-chronicle')) || [];
      } catch (e) { /* ignore */ }
      wbEra.textContent = ERA_LABELS[era] || 'The Three Years';
      if (day) {
        wbDay.textContent = day;
      } else {
        // Fall back to the live clock; the countdown keeps this in sync (see countdown).
        const clockEl = $('clockRead');
        if (clockEl && clockEl.textContent !== '—') wbDay.textContent = clockEl.textContent;
      }
      // The desk stores oldest -> newest, so the last entry is the latest.
      const latest = chronicle[chronicle.length - 1];
      if (latest) {
        const text = (latest.day || '') + ' — ' + latest.entry;
        wbLatest.textContent = text.length > 160 ? text.slice(0, 157) + '…' : text;
      } else {
        wbLatest.textContent = 'The world holds its breath.';
      }
    }

    renderBanner();
    window.addEventListener('storage', e => {
      if (e.key === 'tx-gm-chronicle' || e.key === 'tx-gm-era' || e.key === 'tx-gm-day') {
        renderBanner();
      }
    });
  }
})();

/* ============================================================
   PLAYER MOVE FORM
   Submits moves via Discord webhook, or copies to clipboard.
   ============================================================ */
(function () {
  const form = document.getElementById('moveForm');
  if (!form) return;

  const $ = id => document.getElementById(id);
  const status = $('mfStatus');
  const webhookInput = $('mfWebhook');
  const copyBtn = $('mfCopy');

  // Load saved webhook URL
  try {
    const saved = localStorage.getItem('tx-mf-webhook');
    if (saved && webhookInput) webhookInput.value = saved;
  } catch (e) {}

  // Save webhook on change
  if (webhookInput) {
    webhookInput.addEventListener('input', () => {
      try { localStorage.setItem('tx-mf-webhook', webhookInput.value.trim()); } catch (e) {}
    });
  }

  function showStatus(msg, isError) {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.className = 'mf-status' + (isError ? ' mf-error' : ' mf-success');
  }

  function buildMoveText() {
    const player = $('mfPlayer').value.trim();
    const char_ = $('mfChar').value.trim();
    const where = $('mfWhere').value.trim();
    const era = $('mfEra').selectedOptions[0].text;
    const scale = $('mfScale').selectedOptions[0].text;
    const move = $('mfMove').value.trim();

    return [
      'MOVE',
      '\u2500'.repeat(30),
      'Player: ' + player,
      'Character: ' + char_,
      'Era: ' + era,
      'Scale: ' + scale,
      'Location: ' + where,
      '',
      'THE MOVE',
      '\u2500'.repeat(30),
      move,
      '\u2500'.repeat(30)
    ].join('\n');
  }

  // Copy button
  copyBtn.addEventListener('click', () => {
    const text = buildMoveText();
    navigator.clipboard.writeText(text).then(() => {
      showStatus('Move copied to clipboard — paste it into Discord.', false);
    }).catch(() => {
      showStatus('Could not copy. Select the text and copy manually.', true);
    });
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const webhook = webhookInput ? webhookInput.value.trim() : '';
    const text = buildMoveText();

    if (!webhook) {
      // No webhook — copy to clipboard
      var copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {}
      if (copied) {
        showStatus('No webhook set \u2014 move copied to clipboard. Paste it into Discord.', false);
      } else {
        showStatus('Set a Discord webhook URL to send directly, or copy the text manually.', true);
      }
      form.reset();
      if (webhookInput) webhookInput.value = '';
      return;
    }

    // Send via Discord webhook
    const sendBtn = $('mfSend');
    if (sendBtn) sendBtn.disabled = true;
    showStatus('Sending...', false);

    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '```\n' + text + '\n```' })
      });

      if (res.ok || res.status === 204) {
        showStatus('Move sent! The author will judge the consequence and post it in the Chronicle.', false);
        form.reset();
        // Restore webhook after reset
        if (webhookInput) webhookInput.value = webhook;
      } else {
        showStatus('Webhook returned an error (' + res.status + '). Check the URL and try again.', true);
      }
    } catch (err) {
      showStatus('Could not send — check your connection and the webhook URL.', true);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  });
})();
