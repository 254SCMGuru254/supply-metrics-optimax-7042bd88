
/**
 * Safely clicks on a DOM element
 * @param element The element to click
 * @returns void
 */
export const safeClick = (element: Element | null): void => {
  if (!element) {
    console.warn('Element is null or undefined');
    return;
  }
  
  if (element instanceof HTMLElement) {
    element.click();
  } else {
    console.warn('Element is not an HTMLElement and cannot be clicked directly');
  }
};

/**
 * Adds a CSS class to an element
 * @param element The element to add the class to
 * @param className The class name to add
 */
export const addClass = (element: Element | null, className: string): void => {
  if (!element) return;
  element.classList.add(className);
};

/**
 * Removes a CSS class from an element
 * @param element The element to remove the class from
 * @param className The class name to remove
 */
export const removeClass = (element: Element | null, className: string): void => {
  if (!element) return;
  element.classList.remove(className);
};

/**
 * Toggles a CSS class on an element
 * @param element The element to toggle the class on
 * @param className The class name to toggle
 */
export const toggleClass = (element: Element | null, className: string): void => {
  if (!element) return;
  element.classList.toggle(className);
};

/**
 * Checks if an element has a specific CSS class
 * @param element The element to check
 * @param className The class name to check for
 * @returns boolean
 */
export const hasClass = (element: Element | null, className: string): boolean => {
  if (!element) return false;
  return element.classList.contains(className);
};
