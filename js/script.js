/* =========================================================
   Gazitime — front-end behaviour
   language toggle • date & clock • mobile nav • search
   sticky nav • scroll reveal • back to top
   ========================================================= */

(function () {
  'use strict';

  var LANG_KEY = 'gz-lang';
  var root = document.documentElement;
  var body = document.body;

  /* ---------- helpers ---------- */
  var BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  var BN_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  var EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var BN_DAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  var EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function toBn(value) {
    return String(value).replace(/\d/g, function (d) { return BN_DIGITS[+d]; });
  }

  /* ---------- date + clock ---------- */
  function setDate(lang) {
    var el = document.getElementById('today');
    if (!el) return;
    var now = new Date();
    if (lang === 'en') {
      el.textContent = EN_DAYS[now.getDay()] + ', ' + EN_MONTHS[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    } else {
      el.textContent = BN_DAYS[now.getDay()] + ', ' + toBn(now.getDate()) + ' ' + BN_MONTHS[now.getMonth()] + ' ' + toBn(now.getFullYear());
    }
  }

  function setClock() {
    var el = document.getElementById('liveClock');
    if (!el) return;
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var isBn = !body.classList.contains('lang-en');
    el.textContent = isBn ? toBn(h + ':' + m) : h + ':' + m;
  }

  /* ---------- language ---------- */
  function applyLang(lang) {
    var isEn = lang === 'en';

    body.classList.toggle('lang-en', isEn);
    body.classList.toggle('lang-bn', !isEn);
    root.setAttribute('lang', isEn ? 'en' : 'bn');

    document.querySelectorAll('[data-bn]').forEach(function (el) {
      var value = el.getAttribute('data-' + lang);
      if (value) el.textContent = value;
    });

    document.querySelectorAll('[data-bn-ph]').forEach(function (el) {
      var value = el.getAttribute('data-' + lang + '-ph');
      if (value) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });

    setDate(lang);
    setClock();

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
  }

  var savedLang = 'bn';
  try { savedLang = localStorage.getItem(LANG_KEY) || 'bn'; } catch (e) { /* ignore */ }
  applyLang(savedLang);

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  /* ---------- clock tick ---------- */
  setClock();
  setInterval(setClock, 15000);

  /* ---------- mobile nav ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      hamburger.innerHTML = navLinks.classList.contains('is-open')
        ? '<i class="bx bx-x"></i>'
        : '<i class="bx bx-menu"></i>';
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('is-open');
        hamburger.innerHTML = '<i class="bx bx-menu"></i>';
      }
    });
  }

  /* ---------- sticky nav + back to top ---------- */
  var navbar = document.getElementById('navbar');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('is-stuck', y > 80);
    if (toTop) toTop.classList.toggle('is-visible', y > 420);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- search ---------- */
  var searchInput = document.getElementById('searchInput');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#cards .card'));
  var emptyState = document.createElement('p');
  emptyState.className = 'empty-state';
  emptyState.style.cssText = 'padding:24px 0;color:#6b7280;font-size:.95rem;';
  emptyState.style.display = 'none';

  var cardsWrap = document.getElementById('cards');
  if (cardsWrap) {
    emptyState.style.gridColumn = '1 / -1';
    cardsWrap.appendChild(emptyState);
  }

  function runSearch() {
    var q = (searchInput && searchInput.value || '').trim().toLowerCase();
    var shown = 0;

    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      card.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });

    var isEn = body.classList.contains('lang-en');
    emptyState.textContent = isEn
      ? 'No stories matched "' + q + '".'
      : '“' + q + '” এর সাথে কোনো সংবাদ মেলেনি।';
    emptyState.style.display = shown ? 'none' : 'block';
  }

  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('.lead-main, .lead-side, .card, .box, .opinion blockquote');

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- active nav link (click based) ----------
     Several nav items point at the same anchor, so scroll-spy would light up
     several at once. Highlight only the link the reader actually clicked. */
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      links.forEach(function (l) { l.classList.remove('is-active'); });
      link.classList.add('is-active');
    });
  });

  /* ---------- document title per language ---------- */
  var titles = {
    bn: 'Gazitime — সংবাদ | News',
    en: 'Gazitime — News from Bangladesh and the world'
  };

  var originalApplyLang = applyLang;
  applyLang = function (lang) {
    originalApplyLang(lang);
    document.title = titles[lang] || titles.bn;
  };

  // re-apply immediately so the title matches the language already on screen
  applyLang(document.body.classList.contains('lang-en') ? 'en' : 'bn');
})();
