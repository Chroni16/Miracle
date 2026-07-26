/* =====================================================================
   Miracle Eze — Portfolio interactions
   Scroll progress · reveal-on-scroll · active nav · live clock ·
   animated skill gauges · back-to-top · contact form helper
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Close mobile nav after a link is tapped ---------- */
  document.querySelectorAll('#nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var nav = document.getElementById('nav');
      if (nav.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  /* ---------- Live Lagos time stamp in the hero ---------- */
  var liveStamp = document.getElementById('liveStamp');
  if (liveStamp) {
    var updateClock = function () {
      var now = new Date();
      var formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      liveStamp.textContent = formatted + ' WAT';
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById('scrollProgress');
  var nav = document.querySelector('.site-nav');

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    if (nav) {
      nav.classList.toggle('is-scrolled', scrollTop > 12);
    }

    var backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal-on-scroll for cards & sections ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // small stagger so grids of cards don't all pop at once
          entry.target.style.transitionDelay = (i % 4) * 70 + 'ms';
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // no IntersectionObserver support: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Animated skill "stock" gauges ---------- */
  var gauges = document.querySelectorAll('.stock-gauge span[data-fill]');
  if ('IntersectionObserver' in window && gauges.length) {
    var gaugeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-fill');
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    gauges.forEach(function (g) { gaugeObserver.observe(g); });
  } else {
    gauges.forEach(function (g) { g.style.width = g.getAttribute('data-fill'); });
  }

  /* ---------- Active nav link tracking ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('section[id]')
  );
  var navLinkMap = {};
  document.querySelectorAll('#navLinks .nav-link[data-section]').forEach(function (link) {
    navLinkMap[link.getAttribute('data-section')] = link;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(navLinkMap).forEach(function (key) {
            navLinkMap[key].classList.remove('is-active');
          });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Contact form: build a pre-filled mailto ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in every field before sending.';
        status.classList.add('is-error');
        return;
      }

      var subject = encodeURIComponent('Portfolio enquiry from ' + name);
      var body = encodeURIComponent(
        message + '\n\n— ' + name + ' (' + email + ')'
      );
      var mailtoLink = 'mailto:miraclechimaobi@gmail.com?subject=' + subject + '&body=' + body;

      status.classList.remove('is-error');
      status.textContent = 'Opening your email app…';
      window.location.href = mailtoLink;

      setTimeout(function () {
        status.textContent = 'Didn\u2019t open? Email miraclechimaobi@gmail.com directly.';
      }, 1800);
    });
  }

});
