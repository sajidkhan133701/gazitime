(function () {
  var bn = '০১২৩৪৫৬৭৮৯';
  function dg(n) {
    return String(n).replace(/\d/g, function (x) { return bn[+x]; });
  }

  // 1. count this page view (article pages only)
  var body = document.body;
  var slug = body.getAttribute('data-slug');
  if (slug && location.protocol === 'https:') {
    fetch('/api/view', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        slug: slug,
        title: body.getAttribute('data-title') || '',
        cat: body.getAttribute('data-cat') || ''
      })
    }).catch(function () {});
  }

  // 2. hydrate the "জনপ্রিয়" tab with real counts
  var box = document.getElementById('popular-list');
  if (!box) return;
  fetch('/api/popular?n=5')
    .then(function (r) { return r.json(); })
    .then(function (items) {
      if (!Array.isArray(items) || !items.length) return;
      var html = '';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (!it.title) continue;
        html += '<li class="tab-row"><span class="tab-rank">' + dg(i + 1) + '</span>' +
                '<a class="tab-title" href="/news/' + it.slug + '/">' + it.title + '</a></li>';
      }
      if (html) box.innerHTML = html;
    })
    .catch(function () {});
})();

/* sticky nav shadow */
(function () {
  var nav = document.querySelector('.navbar-area');
  if (!nav) return;
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
