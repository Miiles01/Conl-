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

  // 3. MWG Effect 075 (Problem Cards Animation)
  const mwgRoot = document.querySelector('.mwg_effect075')
  if (mwgRoot && window.innerWidth >= 768) {
    const pinHeight = mwgRoot.querySelector('.pin-height')
    const animationContainer = mwgRoot.querySelector('.animation-container')
    const circlesElement = mwgRoot.querySelector('.circles')
    const circles = mwgRoot.querySelectorAll('.circle')
    const angle = 5

    let currentIndex = -1

    ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: animationContainer,
        scrub: true,
        onUpdate: self => {
            const index = Math.floor(self.progress * (circles.length));

            if(index !== currentIndex && index < circles.length) {
                if(index > currentIndex) {
                    circles[index].classList.add('on')
                    gsap.set(circles[index], {
                        rotation: (index) * angle
                    })
                    gsap.from(circles[index], {
                        scale: 0.94,
                        ease: 'elastic.out(0.6, 0.3)',
                        duration: 0.5
                    })
                } else if(index < currentIndex) {
                    circles[currentIndex].classList.remove('on')
                }

                gsap.to(circlesElement, {
                    rotation: - index * angle + (angle / 2) * index,
                    ease: 'elastic.out(0.6, 0.3)',
                    duration: 0.5
                })

                currentIndex = index
            }
        },
        onLeaveBack: () => {
            currentIndex = -1
            circles.forEach(c => c.classList.remove('on'))
        }
    })
  }

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
  if (mwg001) {
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

    // 3.6 MWG Effect 040 Dual Wheel Animation
    const root040 = document.querySelector('.mwg_effect040');
    if (root040) {
        gsap.to('.scroll', {
            autoAlpha:0,
            duration:0.2,
            scrollTrigger: {
                trigger:'.mwg_effect040',
                start:'top top',
                end:'top top-=1',
                toggleActions: "play none reverse none"
            }
        });

        const leftCircle = root040.querySelector('.parent-circle-left');
        const leftItems = leftCircle.querySelectorAll('.circle');

        const rightCircle = root040.querySelector('.parent-circle-right');
        const rightItems = rightCircle.querySelectorAll('.circle');

        const angle = 14;
        const pinHeight = root040.querySelector('.pin-height');

        leftItems.forEach((el, index) => {
            gsap.set(el, {rotation: index * angle});
            gsap.set(el.querySelector('.label'), {rotation: -index * angle, yPercent: -50});
        });
        rightItems.forEach((el, index) => {
            gsap.set(el, {rotation: index * angle});
            gsap.set(el.querySelector('.media'), {rotation: -index * angle, yPercent: -50});
        });

        gsap.to(leftCircle, {
            rotation: -(180 + angle * leftItems.length),
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                pin: '.mwg_effect040 .container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        gsap.to(leftCircle.querySelectorAll('.label'), {
            rotation: '+=' + (180 + angle * leftItems.length),
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });

        gsap.to(rightCircle, {
            rotation: -(180 + angle * leftItems.length),
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        gsap.to(rightCircle.querySelectorAll('.media'), {
            rotation: '+=' + (180 + angle * leftItems.length),
            ease: 'none',
            scrollTrigger: {
                trigger: pinHeight,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
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
  gsap.fromTo('.video-placeholder',
    { scale: 0.6, borderRadius: '40px' },
    {
      scale: 1,
      borderRadius: '24px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.video-section',
        start: 'top bottom',
        end: 'center center',
        scrub: true
      }
    }
  );

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
        
        // Auto-pause background music if it's playing
        const bgM = document.getElementById('bgMusic');
        const bgMT = document.getElementById('bgMusicToggle');
        if (bgM && !bgM.paused) {
          bgM.pause();
          if (bgMT) bgMT.classList.remove('is-playing');
        }

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

  // Background Music Toggle
  const bgMusic = document.getElementById('bgMusic');
  const bgMusicToggle = document.getElementById('bgMusicToggle');
  if (bgMusic && bgMusicToggle) {
    // Set volume to a reasonable level
    bgMusic.volume = 0.3;
    
    bgMusicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        bgMusicToggle.classList.add('is-playing');
      } else {
        bgMusic.pause();
        bgMusicToggle.classList.remove('is-playing');
      }
    });
  }
