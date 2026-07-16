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

  // Fade-in on scroll
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
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

  // Contact form -> WhatsApp
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var WHATSAPP_NUMBER = '593992744444';

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nombre = form.nombre.value.trim();
      var telefono = form.telefono.value.trim();
      var mensaje = form.mensaje.value.trim();

      if (!nombre || !telefono || !mensaje) {
        status.textContent = 'Por favor completa todos los campos.';
        status.classList.add('is-error');
        return;
      }

      status.classList.remove('is-error');
      status.textContent = 'Abriendo WhatsApp...';

      var text =
        'Hola ADT AUTOS, soy ' + nombre +
        '. Teléfono: ' + telefono +
        '. Mensaje: ' + mensaje;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');

      form.reset();
    });
  }
})();
