import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RESPONSIVE_WIDTH = 1024;

export function initSaaSyDark() {
  let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
  const collapseBtn = document.getElementById('collapse-btn');
  const collapseHeaderItems = document.getElementById('collapsed-header-items');

  if (!collapseBtn || !collapseHeaderItems) {
    return undefined;
  }

  const onHeaderClickOutside = (event) => {
    if (!collapseHeaderItems.contains(event.target) && !collapseBtn.contains(event.target)) {
      toggleHeader();
    }
  };

  const toggleHeader = () => {
    if (isHeaderCollapsed) {
      collapseHeaderItems.classList.add('opacity-100');
      collapseHeaderItems.style.width = '60vw';
      collapseBtn.classList.remove('bi-list');
      collapseBtn.classList.add('bi-x', 'max-lg:tw-fixed');
      isHeaderCollapsed = false;
      setTimeout(() => window.addEventListener('click', onHeaderClickOutside), 1);
    } else {
      collapseHeaderItems.classList.remove('opacity-100');
      collapseHeaderItems.style.width = '0vw';
      collapseBtn.classList.remove('bi-x', 'max-lg:tw-fixed');
      collapseBtn.classList.add('bi-list');
      isHeaderCollapsed = true;
      window.removeEventListener('click', onHeaderClickOutside);
    }
  };

  const responsive = () => {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
      collapseHeaderItems.style.width = '';
      isHeaderCollapsed = false;
    } else if (!isHeaderCollapsed) {
      collapseHeaderItems.style.width = '0vw';
      isHeaderCollapsed = true;
    }
  };

  collapseBtn.addEventListener('click', toggleHeader);
  window.addEventListener('resize', responsive);

  gsap.set('.reveal-up', { opacity: 0, y: '100%' });

  gsap.to('#dashboard', {
    boxShadow: '0px 15px 25px -5px #7e22ceaa',
    duration: 0.3,
    scrollTrigger: {
      trigger: '#hero-section',
      start: '60% 60%',
      end: '80% 80%',
    },
  });

  gsap.to('#dashboard', {
    scale: 1,
    translateY: 0,
    rotateX: '0deg',
    scrollTrigger: {
      trigger: '#hero-section',
      start: window.innerWidth > RESPONSIVE_WIDTH ? 'top 95%' : 'top 70%',
      end: 'bottom bottom',
      scrub: 1,
    },
  });

  document.querySelectorAll('.faq-accordion').forEach((btn) => {
    btn.addEventListener('click', function handleFaqClick() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (!content) return;

      if (content.style.maxHeight === '200px') {
        content.style.maxHeight = '0px';
        content.style.padding = '0px 18px';
      } else {
        content.style.maxHeight = '200px';
        content.style.padding = '20px 18px';
      }
    });
  });

  gsap.utils.toArray('section').forEach((section) => {
    const revealUptimeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: section,
        start: '10% 80%',
        end: '20% 90%',
      },
    });

    revealUptimeline.to(section.querySelectorAll('.reveal-up'), {
      opacity: 1,
      duration: 0.8,
      y: '0%',
      stagger: 0.2,
    });
  });

  return () => {
    collapseBtn.removeEventListener('click', toggleHeader);
    window.removeEventListener('resize', responsive);
    window.removeEventListener('click', onHeaderClickOutside);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
  };
}
