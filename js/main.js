(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // Mobile nav toggle
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Fade-in on scroll. Elements that share a parent (e.g. cards in a
  // grid) cascade in with a small stagger instead of popping in at once.
  var fadeEls = document.querySelectorAll('.fade-in');
  var STAGGER_MS = 70;
  var MAX_DELAY_MS = 420;

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.prototype.filter.call(
              el.parentElement.children,
              function (child) { return child.classList.contains('fade-in'); }
            );
            var index = siblings.indexOf(el);
            var delay = Math.min(Math.max(index, 0) * STAGGER_MS, MAX_DELAY_MS);
            el.style.transitionDelay = delay + 'ms';
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Stat counters: count up from 0 to the target value once the stat
  // scrolls into view. Static final value is in the markup already,
  // so a JS failure just means no animation, never a missing number.
  var counterEls = document.querySelectorAll('.stat-number[data-count-target]');

  function formatCount(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10);
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1100;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.floor(eased * target)) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target) + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counterEls.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // Before/after comparison sliders.
  // Desktop: the reveal follows the cursor as it moves over the image
  // (no click-and-drag needed). Touch: follows the finger while dragging.
  // Keyboard: the underlying range input still works with arrow keys.
  document.querySelectorAll('.compare-frame').forEach(function (frame) {
    var range = frame.querySelector('.compare-range');
    var before = frame.querySelector('.compare-before');
    var handle = frame.querySelector('.compare-handle');

    function update(value) {
      value = Math.max(0, Math.min(100, value));
      before.style.clipPath = 'inset(0 ' + (100 - value) + '% 0 0)';
      handle.style.left = value + '%';
      range.value = value;
    }

    function updateFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      var percent = ((clientX - rect.left) / rect.width) * 100;
      update(percent);
    }

    frame.addEventListener('mousemove', function (event) {
      updateFromClientX(event.clientX);
    });

    frame.addEventListener('touchmove', function (event) {
      if (event.touches.length) {
        updateFromClientX(event.touches[0].clientX);
      }
    }, { passive: true });

    range.addEventListener('input', function () {
      update(Number(range.value));
    });

    update(Number(range.value));
  });

  // Contact form -> WhatsApp
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var WHATSAPP_NUMBER = '593992744444';

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nombre = form.nombre.value.trim();
      var apellido = form.apellido.value.trim();
      var servicio = form.servicio.value.trim();
      var telefono = form.telefono.value.trim();
      var correo = form.correo.value.trim();
      var mensaje = form.mensaje.value.trim();

      if (!nombre || !apellido || !servicio || !telefono || !correo || !mensaje) {
        status.textContent = 'Por favor completa todos los campos.';
        status.classList.add('is-error');
        return;
      }

      status.classList.remove('is-error');
      status.textContent = 'Abriendo WhatsApp...';

      var text =
        'Hola ADT AUTOS, soy ' + nombre + ' ' + apellido +
        '. Servicio de interés: ' + servicio +
        '. Teléfono: ' + telefono +
        '. Correo: ' + correo +
        '. Mensaje: ' + mensaje;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');

      form.reset();
    });
  }
})();
