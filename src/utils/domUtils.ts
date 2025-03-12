
/**
 * Safely clicks a DOM element if it exists and has a click method
 * @param element The DOM element to click
 * @returns true if the click was successful, false otherwise
 */
export const safeClick = (element: Element | null): boolean => {
  if (element && 'click' in element && typeof (element as HTMLElement).click === 'function') {
    (element as HTMLElement).click();
    return true;
  }
  return false;
};

/**
 * Creates a safe wrapper for click events on DOM elements
 * @param callback Function to execute when element is safely clicked
 */
export const createSafeClickHandler = (callback: () => void) => {
  return (element: Element | null) => {
    if (safeClick(element)) {
      callback();
    }
  };
};
