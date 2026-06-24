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
  var splashSubtitle = document.getElementById('splashSubtitle');
  var splashHint = document.querySelector('.splash__hint');

  function onScroll() {
    var y = window.scrollY;
    var t = Math.min(y / 200, 1);   // 0→1 over 200px

    // Title: move up, shrink, fade
    var titleScale = 1 - 0.3 * t;     // 1 → 0.7
    var titleY     = -60 * t;          // 0 → -60px
    var titleOp    = 1 - 0.8 * t;      // 1 → 0.2
    splashTitle.style.transform = 'translateY(' + titleY + 'px) scale(' + titleScale + ')';
    splashTitle.style.opacity   = titleOp;

    // Subtitle: fade out + slight move up
    var subY  = -30 * t;
    var subOp = 1 - t;
    splashSubtitle.style.transform = 'translateY(' + subY + 'px)';
    splashSubtitle.style.opacity   = subOp;

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
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.js-animate').forEach(function (el) {
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

  // ── Initial call ────────────────────────────────
  onScroll();

})();
