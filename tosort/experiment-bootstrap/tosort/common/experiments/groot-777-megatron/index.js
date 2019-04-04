// @flow

import { declareExperiment } from '../../../../../../src';
import { getBooleanFeatureFlag } from '../../primitives/get-feature-flag';

import {
  isChromeOrFirefoxLast2Versions,
  isEnglishVariant,
} from '../requirements';

function triggerAnalytics(eventId, details = {}) {
  console.info(`⚡ analytics: "megatron.${eventId}"`, details);
}

const experiment = declareExperiment({
  experimentKey: 'Megatron',
  isOn: () => getBooleanFeatureFlag('experiment.megatron', false),
  cohortPicker: () => 'control',
  requirements: {
    browser: isChromeOrFirefoxLast2Versions,
    lang: isEnglishVariant,
  },
  triggerAnalytics,
});

export default experiment;
