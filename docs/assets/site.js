// Smooth-scroll only for an actual in-page link click, never on load/reload with
// a #hash already in the URL (that used to animate via CSS scroll-behavior: smooth).
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', '#' + id);
  });
})();

// Theme toggle, persisted to the [data-theme] attribute (matches index.html behaviour)
(function () {
  var root = document.documentElement, btn = document.getElementById('tt');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var dark = matchMedia('(prefers-color-scheme: dark)').matches;
    var cur = root.getAttribute('data-theme') || (dark ? 'dark' : 'light');
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });
})();
