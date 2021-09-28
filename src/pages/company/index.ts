import { bootstrapFeatures } from '../../common/feature-manager/feature-manager';
import { allPagesFeatures } from '../all-pages/all-pages';
import { FeatureOne } from '../../features/feature-one';

bootstrapFeatures([...allPagesFeatures, FeatureOne]);
