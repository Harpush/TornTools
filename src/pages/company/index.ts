import { bootstrapFeatures } from '../../common/feature-manager/feature-manager';
import { allPagesFeatures } from '../all-pages/all-pages';
import { CompanyLastActionFeature } from '../../features/company-last-action';
import { loadFontAwesome } from '../all-pages/font-awesome-loader';

loadFontAwesome().then(() =>
  bootstrapFeatures([...allPagesFeatures, CompanyLastActionFeature])
);

// TODO: Maybe status check here
