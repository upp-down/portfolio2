/* ========================================
   SIXIA ZHOU · Portfolio — Scripts
   零外部依赖，纯原生 JavaScript
   功能：滚动联动、入场动画、悬停交互、移动端触摸
   ======================================== */

(function () {
  'use strict';

  // ── Scroll Progress Bar ─────────────────────────
  var scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ── Back to Top Button ──────────────────────────
  var backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (window.scrollY > window.innerHeight * 0.8) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Splash Scroll Parallax ──────────────────────
  var splashTitle = document.getElementById('splashTitle');
  var splashTagline = document.querySelector('.splash__tagline');
  var splashLead = document.getElementById('splashSubtitle');
  var splashHint = document.querySelector('.splash__hint');
  var splashMasthead = document.querySelector('.splash__masthead');
  var splashIssue = document.querySelector('.splash__issue');

  function onScroll() {
    var y = window.scrollY;
    var t = Math.min(y / 300, 1);   // 0→1 over 300px

    // Title: fade out + slight scale down
    var titleScale = 1 - 0.15 * t;
    var titleOp    = 1 - 0.9 * t;
    splashTitle.style.transform = 'translateY(' + (-40 * t) + 'px) scale(' + titleScale + ')';
    splashTitle.style.opacity   = Math.max(0, titleOp);

    // Tagline: fade out + move up
    if (splashTagline) {
      splashTagline.style.opacity = Math.max(0, 0.6 - t * 2);
      splashTagline.style.transform = 'translateY(' + (-25 * t) + 'px)';
    }

    // Lead text: fade out
    if (splashLead) {
      splashLead.style.opacity = Math.max(0, 1 - t * 1.5);
      splashLead.style.transform = 'translateY(' + (-20 * t) + 'px)';
    }

    // Masthead & issue: fade out
    if (splashMasthead) {
      splashMasthead.style.opacity = Math.max(0, 0.7 - t * 2);
    }
    if (splashIssue) {
      splashIssue.style.opacity = Math.max(0, 1 - t * 2);
    }

    // Scroll hint: fade out faster
    if (splashHint) {
      splashHint.style.opacity = Math.max(0, 0.5 - t * 2);
    }

    // Update progress bar & back-to-top
    updateScrollProgress();
    updateBackToTop();
  }

  // rAF-throttled scroll handler for smoother performance
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── IntersectionObserver (threshold 0.15, once) ──
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.js-animate').forEach(function (el) {
      observer.observe(el);
    });

    // Second observer: js-reveal elements (custom stagger, no default fadeUp)
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.js-reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.js-animate, .js-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ── Card Interaction: clear transform after entry animation ──
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('animationend', function (e) {
      if (e.animationName === 'cardEnter') {
        card.style.transform = 'none';
      }
    });

    var img = card.querySelector('.card__img img');
    if (img) {
      img.addEventListener('animationend', function (e) {
        if (e.animationName === 'imgSlideIn' || e.animationName === 'imgSlideInMobile') {
          img.style.transform = 'none';
        }
      });
    }
  });

  // ── Mobile Touch: toggle .is-hover on tap ──────
  var activeCard = null;

  document.querySelectorAll('.card[data-card]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();

      if (card.classList.contains('is-hover')) {
        card.classList.remove('is-hover');
        activeCard = null;
        return;
      }

      if (activeCard && activeCard !== card) {
        activeCard.classList.remove('is-hover');
      }

      card.classList.add('is-hover');
      activeCard = card;
    });
  });

  // Tap outside cards → deactivate
  document.addEventListener('click', function (e) {
    if (activeCard && !e.target.closest('.card')) {
      activeCard.classList.remove('is-hover');
      activeCard = null;
    }
  });

  // ── Splash Entrance Animation ───────────────────
  var splash = document.getElementById('splash');
  if (splash) {
    // Check reduced motion preference
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Skip animations, show everything immediately
      splash.classList.add('is-loaded');
    } else {
      // Short delay so the browser renders the initial state first
      setTimeout(function () {
        splash.classList.add('is-loaded');
      }, 120);
    }
  }

  // ── Initial call ────────────────────────────────
  onScroll();

})();
