
/**
 * Safely triggers a click event on a DOM element
 * This utility helps avoid TypeScript errors when clicking DOM elements
 * 
 * @param element The element to click on
 * @returns void
 */
export const safeClick = (element: Element | null) => {
  if (element && 'click' in element && typeof element.click === 'function') {
    element.click();
  } else {
    console.warn('Element does not have a click method');
  }
};
