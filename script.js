(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Nav: solid on scroll + mobile menu
  var nav = $('#nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('#nav-toggle');
  var menu = $('#mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Mission: word-by-word reveal tied to scroll position
  var mission = $('#mission-text');
  if (mission) {
    var raw = mission.getAttribute('data-text');
    var highlight = (mission.getAttribute('data-highlight') || '').toLowerCase().split('|').filter(Boolean);
    var words = raw.split(' ');
    mission.innerHTML = words.map(function (w) {
      var clean = w.toLowerCase().replace(/[^a-z0-9']/g, '');
      var hl = highlight.indexOf(clean) !== -1 ? ' hl' : '';
      return '<span class="w' + hl + '">' + w + '</span>';
    }).join(' ');
    var spans = $$('.w', mission);
    var update = function () {
      var r = mission.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.85, end = vh * 0.35;
      var p = (start - r.top) / (start - end + r.height * 0.6);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Feature cards: tap to expand
  $$('.feature').forEach(function (card) {
    card.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
      var tap = $('.tap', card);
      if (tap) tap.textContent = open ? 'TAP TO CLOSE' : 'TAP TO LEARN MORE';
    });
  });

  // Benefits: cycle highlight
  var benefits = $$('.benefit');
  if (benefits.length) {
    var bi = 0;
    setInterval(function () {
      benefits[bi].classList.remove('active');
      bi = (bi + 1) % benefits.length;
      benefits[bi].classList.add('active');
    }, 1600);
  }

  // FAQ accordion
  $$('.faq-item').forEach(function (item) {
    var q = $('.faq-q', item);
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Footer year
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // In-app browser (Instagram/TikTok) hint: shown only if a store tap did not leave the page
  var ua = navigator.userAgent || '';
  var inApp = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|TikTok|musical_ly|BytedanceWebview|Snapchat|Twitter|LinkedInApp|Pinterest|Line\//i.test(ua)
    || (/iPhone|iPad|iPod/.test(ua) && /AppleWebKit/.test(ua) && !/Safari|CriOS|FxiOS|EdgiOS/.test(ua));
  var iab = $('#iab');
  if (inApp && iab) {
    var steps = $('#iab-steps');
    steps.innerHTML = /Android/i.test(ua)
      ? 'Tap <b>⋮</b> up there, then <b>Open in Chrome</b>.'
      : 'Tap <b>···</b> up there, then <b>Open in Safari</b>.';
    $('#iab-close').addEventListener('click', function () { iab.classList.remove('show'); });
    var left = false;
    var markLeft = function () { left = true; };
    window.addEventListener('pagehide', markLeft);
    window.addEventListener('blur', markLeft);
    document.addEventListener('visibilitychange', function () { if (document.hidden) markLeft(); });
    $$('.store').forEach(function (b) {
      b.addEventListener('click', function () {
        left = false;
        setTimeout(function () { if (!left && !document.hidden) iab.classList.add('show'); }, 1800);
      });
    });
  }
})();
