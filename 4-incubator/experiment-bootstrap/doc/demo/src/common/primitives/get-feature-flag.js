// @flow

import invariant from 'tiny-invariant';

export function getFeatureFlag<T>(featureFlagName: string, defaultValue: T): T {
  invariant(
    typeof defaultValue !== 'undefined',
    `getFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`);

  if (typeof value === 'undefined') return defaultValue;

  const isValid = typeof value === typeof defaultValue;
  if (!isValid) {
    invariant(
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
  invariant(
    typeof defaultValue !== 'undefined',
    `getBooleanFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`) === 'true';

  const isValid = typeof value === 'boolean';
  if (!isValid) {
    invariant(
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
  invariant(
    typeof defaultValue !== 'undefined',
    `getMultivariateFeatureFlag: a default value must be provided when querying "${featureFlagName}"!`,
  );

  const value = localStorage.getItem(`FF.${featureFlagName}`);

  const isValid = typeof value === 'string' && possibleValues.includes(value);
  if (!isValid) {
    invariant(
      isValid,
      `getMultivariateFeatureFlag: the value of "${featureFlagName}": "${String(
        value,
      )}" is not a valid string!`,
    );
    return defaultValue;
  }

  return ((value: any): string);
}
