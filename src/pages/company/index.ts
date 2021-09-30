import { bootstrapFeatures } from '../../common/feature-manager/feature-manager';
import { allPagesFeatures } from '../all-pages/all-pages';
import { CompanyLastActionFeature } from '../../features/company-last-action';

bootstrapFeatures([...allPagesFeatures, CompanyLastActionFeature]);
