/**
 * Safely finds an element by its ID
 * This utility helps avoid TypeScript errors when the element might not exist
 */
export const findElementById = (id: string): HTMLElement | null => {
  if (typeof document !== 'undefined') {
    return document.getElementById(id);
  }
  return null;
};

/**
 * Safely finds elements by their class name
 * This utility helps avoid TypeScript errors when the elements might not exist
 */
export const findElementsByClassName = (className: string): HTMLCollectionOf<Element> | null => {
  if (typeof document !== 'undefined') {
    return document.getElementsByClassName(className);
  }
  return null;
};

/**
 * Safely finds elements by their tag name
 * This utility helps avoid TypeScript errors when the elements might not exist
 */
export const findElementsByTagName = (tagName: string): HTMLCollectionOf<Element> | null => {
  if (typeof document !== 'undefined') {
    return document.getElementsByTagName(tagName);
  }
  return null;
};

/**
 * Safely creates and appends a new element to a parent element
 * This utility helps avoid TypeScript errors when the parent element might not exist
 */
export const createAndAppendElement = (
  parentElement: HTMLElement | null,
  tagName: string,
  attributes?: { [key: string]: string }
): HTMLElement | null => {
  if (parentElement && typeof document !== 'undefined') {
    const newElement = document.createElement(tagName);
    
    if (attributes) {
      for (const key in attributes) {
        newElement.setAttribute(key, attributes[key]);
      }
    }

    parentElement.appendChild(newElement);
    return newElement;
  }
  return null;
};

/**
 * Safely triggers a click event on an element if it exists
 * This utility helps avoid TypeScript errors when trying to click on elements
 */
export const safeClick = (element: Element | null): void => {
  if (element && 'click' in element) {
    (element as HTMLElement).click();
  }
};
