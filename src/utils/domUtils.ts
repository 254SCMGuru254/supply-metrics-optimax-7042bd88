
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

// Adding additional DOM utility functions to support the application
export const findElementById = (id: string): HTMLElement | null => {
  return document.getElementById(id);
};

export const findElementsByClassName = (className: string): HTMLCollectionOf<Element> => {
  return document.getElementsByClassName(className);
};

export const findElementsByTagName = (tagName: string): HTMLCollectionOf<Element> => {
  return document.getElementsByTagName(tagName);
};

export const createAndAppendElement = (
  tagName: string,
  parent: HTMLElement,
  attributes?: Record<string, string>,
  innerText?: string
): HTMLElement => {
  const element = document.createElement(tagName);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (innerText) {
    element.innerText = innerText;
  }
  
  parent.appendChild(element);
  return element;
};
