// @flow

import bowser from 'bowser';

import {
  LATEST_CHROME_VERSION,
  LATEST_FIREFOX_VERSION,
} from '../../../../../src';

export function isChromeOrFirefoxLast2Versions(): boolean {
  if (bowser.name === 'Chrome') {
    if (bowser.check({ chrome: String(LATEST_CHROME_VERSION - 1) }, true)) {
      return true;
    }
  } else if (bowser.name === 'Firefox') {
    if (bowser.check({ firefox: String(LATEST_FIREFOX_VERSION - 1) }, true)) {
      return true;
    }
  }

  return false;
}

export function isEnglishVariant(): boolean {
  return navigator.language.startsWith('en');
}

export function isAdmin(): boolean {
  return true;
}

export function isNotAdmin(): boolean {
  return !isAdmin();
}

export function isEvaluator(): boolean {
  return true; // TODO
}
