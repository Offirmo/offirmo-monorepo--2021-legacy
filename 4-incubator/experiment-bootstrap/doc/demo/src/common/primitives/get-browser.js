// @flow

import bowser from 'bowser';

export interface BrowserInfos {
  name: string;
  version: number;
}

export default function getBrowser(): BrowserInfos {
  return {
    name: bowser.name,
    version: Number(bowser.version),
  };
}
