import { RangedSemver, SemverCompareOptions } from '../semver/index.js';
import type { RangedBrowsersVersions } from '../browsers/types.js';
import type { BrowserRegex, BrowserVersionedRegex } from '../useragent/types.js';
/**
 * Apply ranged sevmers to the regex.
 * @todo   if `allowHigherVersions`, apply only min version.
 * @param regex - Target regex.
 * @param versions - Ranged semvers.
 * @param options - Semver compare options.
 * @returns Regex with given versions.
 */
export declare function applyVersionsToRegex(regex: string | RegExp, versions: RangedSemver[], options: SemverCompareOptions): string;
/**
 * Apply browser versions to info objects.
 * @param browserRegexes - Objects with requested browser version and regex.
 * @param browsers - Ranged versions of browsers.
 * @param options - Semver compare options.
 * @returns Objects with requested browser version and regex special for this version.
 */
export declare function applyVersionsToRegexes(browserRegexes: BrowserRegex[], browsers: RangedBrowsersVersions, options: SemverCompareOptions): BrowserVersionedRegex[];
//# sourceMappingURL=versions.d.ts.map