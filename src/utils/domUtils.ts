
/**
 * Safely triggers a click event on an element
 * @param element The element to click
 * @returns true if the click was triggered, false otherwise
 */
export const safeClick = (element: Element | null): boolean => {
  if (!element) return false;
  
  // Modern approach using the click() method if available
  if (typeof (element as HTMLElement).click === 'function') {
    (element as HTMLElement).click();
    return true;
  }
  
  // Fallback: Create and dispatch a click event
  try {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(clickEvent);
    return true;
  } catch (error) {
    console.error('Failed to trigger click event:', error);
    return false;
  }
};
