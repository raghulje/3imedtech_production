/**
 * Smooth scroll utility with optimized performance
 */

interface ScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
}

// Easing functions for smooth animations
export const easingFunctions = {
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },
};

/**
 * Smooth scroll to element with custom easing
 */
export const smoothScrollToElement = (
  element: HTMLElement | null,
  options: ScrollOptions = {}
): void => {
  if (!element) return;

  const {
    offset = 100,
    duration = 800,
    easing = easingFunctions.easeInOutCubic,
  } = options;

  const startPosition = window.pageYOffset;
  const elementPosition = element.getBoundingClientRect().top + startPosition;
  const targetPosition = elementPosition - offset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easing(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Smooth scroll to top
 */
export const smoothScrollToTop = (duration: number = 600): void => {
  const startPosition = window.pageYOffset;
  const distance = -startPosition;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easingFunctions.easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Smooth scroll to hash section
 */
export const smoothScrollToHash = (
  hash: string,
  options: ScrollOptions = {}
): void => {
  const id = hash.replace('#', '');
  const element = document.getElementById(id);
  
  if (element) {
    smoothScrollToElement(element, options);
  }
};

