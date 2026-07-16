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
