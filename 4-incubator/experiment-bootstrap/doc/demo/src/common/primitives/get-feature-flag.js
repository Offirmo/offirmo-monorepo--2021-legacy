// @flow

import assert from 'tiny-assert';

export function getFeatureFlag<T>(featureFlagName: string, defaultValue: T): T {
  assert(
    typeof defaultValue !== 'undefined',
    `getFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`);

  if (typeof value === 'undefined') return defaultValue;

  const isValid = typeof value === typeof defaultValue;
  if (!isValid) {
    assert(
      isValid,
      `getFeatureFlag: the value of "${featureFlagName}": "${String(
        value,
      )}"  is not of the expected type!`,
    );
    return defaultValue;
  }

  // $FlowFixMe
  return value;
}

export function getBooleanFeatureFlag(
  featureFlagName: string,
  defaultValue: boolean,
): boolean {
  assert(
    typeof defaultValue !== 'undefined',
    `getBooleanFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`) === 'true';

  const isValid = typeof value === 'boolean';
  if (!isValid) {
    assert(
      isValid,
      `getBooleanFeatureFlag: the value of "${featureFlagName}": "${String(
        value,
      )}"  is not a valid boolean!`,
    );
    return defaultValue;
  }

  return value;
}

export function getMultivariateFeatureFlag(
  featureFlagName: string,
  defaultValue: string,
  possibleValues: string[] = [],
): string {
  assert(
    typeof defaultValue !== 'undefined',
    `getMultivariateFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`);

  const isValid = typeof value === 'string' && possibleValues.includes(value);
  if (!isValid) {
    assert(
      isValid,
      `getMultivariateFeatureFlag: the value of "${featureFlagName}": "${String(
        value,
      )}" is not a valid string!`,
    );
    return defaultValue;
  }

  return ((value: any): string);
}
