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
