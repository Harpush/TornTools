import { CustomElement } from './custom-elements/common';

export const createElement = <T extends keyof HTMLElementTagNameMap>(options: {
  type: T;
  class?: string;
  children?: HTMLElement[] | string[] | CustomElement[];
}): HTMLElementTagNameMap[T] => {
  const element = document.createElement(options.type);

  if (options.class) {
    element.classList.add(...options.class.split(' '));
  }

  if (options.children) {
    for (const child of options.children) {
      if (typeof child === 'string') {
        const textNode = document.createTextNode(child);
        element.appendChild(textNode);
      } else if ('element' in child) {
        element.appendChild(child.element);
      } else {
        element.appendChild(child);
      }
    }
  }

  return element;
};
