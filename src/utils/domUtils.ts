
/**
 * Safely handles click events on DOM elements by checking if the element exists and has a click method
 */
export const safeClick = (element: Element | null) => {
  if (element && 'click' in element) {
    (element as HTMLElement).click();
  }
};

