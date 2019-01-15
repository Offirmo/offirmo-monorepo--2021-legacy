import { declareExperiment } from '../../../../../../src';
import { getBooleanFeatureFlag } from '../../primitives/get-feature-flag';
import {
  isChromeOrFirefoxLast2Versions,
  isEnglishVariant,
} from '../requirements';

const fundleCohortPicker = () => 'variation';

function triggerAnalytics(eventId, details = {}) {
  console.info(`⚡ analytics: "fundle.${eventId}"`, details);
}

const experiment = declareExperiment({
  experimentKey: 'Fundle',
  isOn: () => getBooleanFeatureFlag('experiment.fundle', false),
  cohortPicker: fundleCohortPicker,
  requirements: {
    browser: isChromeOrFirefoxLast2Versions,
    lang: isEnglishVariant,
  },
  triggerAnalytics,
});

export default experiment;
