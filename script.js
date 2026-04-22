

$(document).ready(function () {

  /*STICKY NAVBAR */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }
  });


  /*MENU*/
  $('#hamburger').on('click', function () {
    $('#navLinks').toggleClass('open');
    $(this).toggleClass('active');
  });

  // Close on link click
  $('#navLinks a').on('click', function () {
    $('#navLinks').removeClass('open');
    $('#hamburger').removeClass('active');
  });


  /*SMOOTH SCROLL (anchor links)*/
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.hash);
    if (target.length) {
      e.preventDefault();
      const offset = parseInt($('#navbar').css('height')) || 68;
      $('html, body').animate({ scrollTop: target.offset().top - offset }, 700, 'swing');
    }
  });


  /*product cards*/
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger delay based on card position
          const delay = (entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Assign stagger delays and observe
  $('[data-animate]').each(function (i) {
    $(this).attr('data-delay', i * 100);
    animObserver.observe(this);
  });


  /*GALLERY FILTER*/
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');

    // Update active button
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    // Show/hide items
    if (filter === 'all') {
      $('.gallery-item').each(function (i) {
        const $el = $(this);
        setTimeout(() => {
          $el.removeClass('hidden').css({ opacity: 0, transform: 'scale(0.92)' });
          requestAnimationFrame(() => {
            $el.css({ transition: 'opacity 0.4s, transform 0.4s', opacity: 1, transform: 'scale(1)' });
          });
        }, i * 40);
      });
    } else {
      $('.gallery-item').each(function () {
        if ($(this).data('cat') === filter) {
          $(this).removeClass('hidden').css({ opacity: 0, transform: 'scale(0.92)' });
          setTimeout(() => {
            $(this).css({ transition: 'opacity 0.4s, transform 0.4s', opacity: 1, transform: 'scale(1)' });
          }, 50);
        } else {
          $(this).addClass('hidden');
        }
      });
    }
  });


  /*LIGHTBOX */
  let currentImages = [];
  let currentIndex = 0;

  function buildImageList() {
    currentImages = [];
    $('.gallery-item:not(.hidden)').each(function () {
      currentImages.push({
        src: $(this).find('img').attr('src'),
        alt: $(this).find('img').attr('alt') || ''
      });
    });
  }

  function openLightbox(index) {
    buildImageList();
    currentIndex = index;
    showLightboxImage(currentIndex);
    $('#lightbox').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeLightbox() {
    $('#lightbox').removeClass('open');
    $('body').css('overflow', '');
  }

  function showLightboxImage(index) {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentIndex = index;
    const img = currentImages[currentIndex];
    $('#lbImg').attr('src', img.src).attr('alt', img.alt);
    $('#lbCaption').text(img.alt);
  }

  // Open on gallery item click
  $(document).on('click', '.gallery-item', function () {
    buildImageList();
    const allVisible = $('.gallery-item:not(.hidden)');
    const idx = allVisible.index(this);
    openLightbox(idx);
  });

  // Close button
  $('#lbClose').on('click', closeLightbox);

  // Click outside image
  $('#lightbox').on('click', function (e) {
    if ($(e.target).is('#lightbox')) closeLightbox();
  });

  // Navigation
  $('#lbPrev').on('click', function () { showLightboxImage(currentIndex - 1); });
  $('#lbNext').on('click', function () { showLightboxImage(currentIndex + 1); });

  // Keyboard
  $(document).on('keydown', function (e) {
    if (!$('#lightbox').hasClass('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  document.getElementById('lightbox').addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.getElementById('lightbox').addEventListener('touchend', function (e) {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) showLightboxImage(currentIndex + 1);
      else showLightboxImage(currentIndex - 1);
    }
  }, { passive: true });


  /*CONTACT FORM*/
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    const $btn = $(this).find('[type="submit"]');
    const name  = $('#fname').val().trim();
    const phone = $('#fphone').val().trim();
    const msg   = $('#fmsg').val().trim();

    // Simple validation
    if (!name || !phone || !msg) {
      // Shake effect on empty fields
      $(this).find('input, textarea').each(function () {
        if (!$(this).val().trim()) {
          $(this).css('border-color', '#e03030');
          setTimeout(() => $(this).css('border-color', ''), 2000);
        }
      });
      return;
    }

    // Loading state
    const origHtml = $btn.html();
    $btn.html('<i class="bi bi-hourglass-split"></i> Sending...').prop('disabled', true);

    // Simulate AJAX request
    $.ajax({
      url: '#',
      method: 'POST',
      data: { name, phone, message: msg },
      complete: function () {
        // Always succeed (simulated)
        setTimeout(() => {
          $btn.html(origHtml).prop('disabled', false);
          $('#contactForm')[0].reset();
          $('#formSuccess').fadeIn(400);
          setTimeout(() => $('#formSuccess').fadeOut(400), 5000);
        }, 1000);
      }
    }).fail(function () {
      // Fallback for local file (no server)
      setTimeout(() => {
        $btn.html(origHtml).prop('disabled', false);
        $('#contactForm')[0].reset();
        $('#formSuccess').fadeIn(400);
        setTimeout(() => $('#formSuccess').fadeOut(400), 5000);
      }, 1000);
    });
  });

  // Clear validation errors on input
  $('#contactForm input, #contactForm textarea').on('input', function () {
    $(this).css('border-color', '');
  });


  /*ACTIVE NAV LINK on scroll*/
  const sections = ['hero', 'about', 'products', 'gallery', 'contact'];
  $(window).on('scroll.nav', function () {
    const scrollY = $(this).scrollTop() + 100;
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (
        scrollY >= el.offsetTop &&
        scrollY < el.offsetTop + el.offsetHeight
      ) {
        $('.nav-links a').removeClass('nav-active');
        $(`.nav-links a[href="#${id}"]`).addClass('nav-active');
      }
    });
  });

}); // end document.ready
