(function () {
  'use strict';

  var body = document.body;

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () { menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    io.observe(el);
  });

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
      var start = performance.now(), dur = 1400;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { co.observe(c); });

  /* ---------- Contact form (Formspree, no page reload) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) return; // not configured yet: normal submit
    e.preventDefault();
    status.className = 'status';
    status.textContent = 'Sending...';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('fail');
      form.reset();
      status.className = 'status ok';
      status.textContent = "Thanks! I'll get back to you soon.";
    }).catch(function () {
      status.className = 'status err';
      status.textContent = 'Something went wrong. Please email me directly.';
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
