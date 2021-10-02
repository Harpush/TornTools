import { bootstrapFeatures } from '../../common/feature-manager/feature-manager';
import { allPagesFeatures } from '../all-pages/all-pages';
import { loadFontAwesome } from './font-awesome-loader';

loadFontAwesome().then(() => {
  bootstrapFeatures(allPagesFeatures);
});
