import { createElement } from '../../dom';

// TODO: Import font awesome
import './font-awesome-icon.scss';

// TODO: Custom element?
export const createFontAwesomeIcon = (name: string, classes?: string) =>
  createElement({
    type: 'i',
    class: `fas fa-${name} ${classes}`
  });
