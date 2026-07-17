import Lenis from 'lenis';

const { gsap, ScrollTrigger, SplitText, CustomEase } = window;

// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutQuint
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

// Tie Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Initialize User Custom Ease
CustomEase.create("osmo-ease","0.625, 0.05, 0, 1");

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Hero Animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Hide all reveal elements initially
  gsap.set('.gs-reveal-up', { y: 50, opacity: 0 });
  gsap.set('.gs-reveal-down', { y: -50, opacity: 0 });

  // Animate Header
  tl.to('.gs-reveal-down', {
    y: 0,
    opacity: 1,
    duration: 1,
  });

  // Animate Hero Content
  tl.to('.hero .gs-reveal-up', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.15,
  }, "-=0.5");

  // 2. Scroll Animations for other elements
  const revealElements = document.querySelectorAll('.gs-reveal-up:not(.hero .gs-reveal-up)');

  revealElements.forEach((elem) => {
    gsap.to(elem, {
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%', // trigger when top of element hits 85% of viewport
        toggleActions: 'play none none none',
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // 3.4 MWG Effect 053 (3D Rotating Text)
  const root053 = document.querySelector('.mwg_effect053')
  if (root053 && window.innerWidth >= 768) {
      const pinHeight = root053.querySelector('.pin-height')
      const containerFlip = root053.querySelector('.container-flip')
      const paragraphs = root053.querySelectorAll('.paragraphs')

      ScrollTrigger.create({
          trigger: pinHeight,
          start: 'top top',
          end: 'bottom bottom',
          pin: containerFlip,
      })

      const splits = Array.from(paragraphs).map(p => {
          const split = new SplitText(p, { type: "lines", linesClass: "line" })
          split.lines.forEach(line => {
              line.innerHTML = `<div class="line-inner">${line.innerHTML}</div>`
          })
          return split
      })

      splits.forEach((split, i) => {
          if (i > 0) {
              gsap.set(split.lines, { rotationY: 90 })
          }
      })

      const tl = gsap.timeline({
          scrollTrigger: {
              trigger: pinHeight,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true
          }
      })

      splits.forEach((split, i) => {
          if (splits[i + 1]) {
              const currentLines = split.lines
              const nextLines = splits[i + 1].lines

              tl.to(currentLines, {
                  rotationY: -90,
                  stagger: 0.07,
                  duration: 1,
                  ease: 'back.inOut(1.5)'
              })

              tl.to(nextLines, {
                  rotationY: 0,
                  stagger: 0.07,
                  duration: 1,
                  ease: 'back.inOut(1.5)'
              }, "<")
          }
      })
  }
    // 3.5 MWG Effect 001 (Horizontal Scroll Cards)
  const mwg001 = document.querySelector('.mwg_effect001');
  if (mwg001 && window.innerWidth >= 768) {
    const container = mwg001.querySelector('.horizontal-container');
    const cardsContainer = mwg001.querySelector('.cards');
    const cardsList = mwg001.querySelectorAll('.card');

    // Function to calculate scroll distance
    const getScrollDistance = () => cardsContainer.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(cardsContainer, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
            trigger: mwg001,
            pin: true,
            scrub: true,
            start: 'center center',
            end: () => '+=' + getScrollDistance(),
            invalidateOnRefresh: true
        }
    });

    cardsList.forEach(card => {
        const values = {
            // Reduced drastic X and Y movements to prevent harsh overlapping
            x: (Math.random() * 10 + 10) * (Math.random() < 0.5 ? 1 : -1),
            y: (Math.random() * 4 + 6) * (Math.random() < 0.5 ? 1 : -1),
            rotation: (Math.random() * 6 + 4) * (Math.random() < 0.5 ? 1 : -1)
        };

        gsap.fromTo(card, {
            rotation: values.rotation,
            xPercent: values.x,
            yPercent: values.y
        }, {
            rotation: -values.rotation,
            xPercent: -values.x,
            yPercent: -values.y,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 120%',
                end: 'right -20%',
                scrub: true,
            }
        });
    });
  }

// 4. Color Change (Scroll Chain)
  const themeSections = document.querySelectorAll('[data-theme]');
  themeSections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => document.body.setAttribute('data-current-theme', section.getAttribute('data-theme')),
      onEnterBack: () => document.body.setAttribute('data-current-theme', section.getAttribute('data-theme')),
    });
  });

  // 5. SIMPLE REVEAL FOR H1 & H2
  const headings = document.querySelectorAll('h1:not(.sentence), h2:not(.paragraphs)');
  
  headings.forEach(heading => {
    gsap.fromTo(
      heading,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // 6. Video Scale Animation on Scroll
  if (document.querySelector('.demo-split__media')) {
    gsap.fromTo('.demo-split__media',
      { scale: 0.85 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.video-section',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      }
    );
  }

  // 7. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const iconMenu = document.querySelector('.icon-menu');
  const iconClose = document.querySelector('.icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  if (hamburger && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        mobileMenu.classList.remove('is-open');
        iconMenu.style.display = 'block';
        iconClose.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
      } else {
        mobileMenu.classList.add('is-open');
        iconMenu.style.display = 'none';
        iconClose.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    };

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });
  }

  // 8. Smooth scrolling for anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Use lenis to scroll to the element with an offset for the fixed header
        lenis.scrollTo(targetElement, { offset: -80 });
      }
    });
  });
});

// --- VIDEO TESTIMONIALS & SWIPER INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.swiper-video-container');
  const overlays = document.querySelectorAll('.video-overlay');

  overlays.forEach(overlay => {
    overlay.addEventListener('click', function() {
      const container = this.previousElementSibling; // The .swiper-video-container is right before the overlay
      const iframe = container.querySelector('iframe');
      
      if (this.classList.contains('is-playing')) {
        // Pause playing
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
        this.classList.remove('is-playing');
        this.classList.add('is-paused');
      } else if (this.classList.contains('is-paused')) {
        // Resume playing
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
        this.classList.remove('is-paused');
        this.classList.add('is-playing');
      } else {
        // Pause all other videos by clearing their iframes
        sliders.forEach(c => c.innerHTML = '');
        overlays.forEach(o => {
          o.classList.remove('is-playing');
          o.classList.remove('is-paused');
          o.classList.remove('has-started');
        });

        const videoId = container.getAttribute('data-video-id');
        container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

        this.classList.add('is-playing');
        this.classList.add('has-started');
      }
    });
  });

  // Initialize Swiper
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.video-testimonials-slider', {
      loop: true,
      slidesPerView: 1.2,
      spaceBetween: 20,
      centeredSlides: true,
      breakpoints: {
        768: {
          slidesPerView: 1.5,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 1.8,
          spaceBetween: 40,
        }
      },
      on: {
        slideChangeTransitionStart: function () {
          // Stop videos when sliding
          sliders.forEach(container => container.innerHTML = '');
          overlays.forEach(o => o.classList.remove('is-playing'));
        }
      }
    });
  }
});


// Fachadas de video: círculo verde + play blanco; al clic reproducen CON sonido y controles
document.querySelectorAll('.video-facade[data-video-id]').forEach(facade => {
  facade.addEventListener('click', () => {
    const id = facade.getAttribute('data-video-id');
    facade.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    facade.classList.add('is-playing');
  }, { once: true });
});

document.querySelectorAll('.video-facade-local').forEach(facade => {
  const video = facade.querySelector('video');
  if (!video) return;
  facade.addEventListener('click', () => {
    video.muted = false;
    video.volume = 1;
    video.setAttribute('controls', '');
    video.play();
    facade.classList.add('is-playing');
  }, { once: true });
});

// Download Form Logic
const downloadForm = document.getElementById('download-form');
const downloadEmail = document.getElementById('download-email');
const downloadError = document.getElementById('download-error');

if (downloadForm && downloadEmail && downloadError) {
  downloadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = downloadEmail.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      downloadError.style.display = 'block';
      downloadEmail.style.borderColor = '#EF7E81';
    } else {
      downloadError.style.display = 'none';
      downloadEmail.style.borderColor = 'rgba(0,0,0,0.1)';
      
      // Trigger download
      const a = document.createElement('a');
      a.href = './Conlu-Actividades-Gratis.zip';
      a.download = 'Conlu-Actividades-Gratis.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      downloadEmail.value = '';
      downloadEmail.placeholder = '¡Gracias! Descarga iniciada.';
    }
  });

  downloadEmail.addEventListener('input', () => {
    downloadError.style.display = 'none';
    downloadEmail.style.borderColor = 'rgba(0,0,0,0.1)';
  });
}

// --- TESTIMONIALS MOBILE ARROWS ---
document.addEventListener('DOMContentLoaded', () => {
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  const scrollLeftBtn = document.querySelector('.mobile-scroll-arrow.left');
  const scrollRightBtn = document.querySelector('.mobile-scroll-arrow.right');

  if (testimonialsCarousel && scrollLeftBtn && scrollRightBtn) {
    const getScrollAmount = () => {
      const card = testimonialsCarousel.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 16 : 320;
    };

    scrollLeftBtn.addEventListener('click', () => {
      testimonialsCarousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      testimonialsCarousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }
});

