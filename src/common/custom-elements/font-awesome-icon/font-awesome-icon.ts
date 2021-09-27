import { createElement } from '../../dom';

// TODO: Import font awesome
import './font-awesome-icon.css';

export const createFontAwesomeIcon = (name: string) =>
  createElement({
    type: 'i',
    class: `fas fa-${name}`
  });
