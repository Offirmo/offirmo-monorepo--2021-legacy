// @flow

import React, { Component } from 'react';

import { isNotAdmin } from '../../common/experiments/requirements';
import fundleExperiment from '../../common/experiments/groot-333-fundles';

import './index.css';

const fundleTouchpoint = fundleExperiment.declareTouchpoint({
  touchpointKey: 'component2',
  extraRequirements: {
    'not-admin': isNotAdmin,
  },
});

export default class C2 extends Component<{}> {
  render() {
    const { shouldRun } = fundleTouchpoint.resolve();

    const copy = shouldRun ? 'A better CTA' : 'A boring CTA';

    return <button className="c2">Button: {copy}</button>;
  }
}
