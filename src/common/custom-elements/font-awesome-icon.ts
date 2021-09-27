import { createElement } from '../dom';

export const createFontAwesomeIcon = (name: string) =>
  createElement({
    type: 'i',
    class: `fas fa-${name}`
  });
