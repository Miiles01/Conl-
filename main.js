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
  if (mwgRoot) {
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
    if (root053) {
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

  // 5. MASKED TEXT REVEAL FOR H1 & H2 (Osmo Code)
  const headings = document.querySelectorAll('h1:not(.sentence), h2:not(.paragraphs)');
  
  headings.forEach(heading => {
    SplitText.create(heading, {
      type: "lines, words, chars",
      linesClass: "line",
      wordsClass: "word",
      charsClass: "letter"
    });

    const lines = heading.querySelectorAll('.line');
    
    // Mask the lines by wrapping them in overflow: hidden
    lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'block';
      // Prevent descenders (j, g, p, y) from getting cut off by the mask
      wrapper.style.paddingBottom = '0.25em';
      wrapper.style.marginBottom = '-0.25em';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.fromTo(
      lines,
      { yPercent: 110 },
      { 
        yPercent: 0, 
        duration: 0.8, 
        stagger: 0.08, 
        ease: "osmo-ease",
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
