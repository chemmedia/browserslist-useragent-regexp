import { Semver, RangedSemver } from '../semver/index.js';
import type { Browser, BrowsersVersions, RangedBrowsersVersions } from './types.js';
/**
 * Merge browser info object to map with versions.
 * @param browsers - Browser info object to merge.
 * @returns Merged browsers map.
 */
export declare function mergeBrowserVersions(browsers: Browser[]): BrowsersVersions;
/**
 * Versions to ranged versions.
 * @param versions - Semver versions list.
 * @returns Ranged versions list.
 */
export declare function versionsListToRanges(versions: Semver[]): RangedSemver[];
/**
 * Browser versions to ranged versions.
 * @param browsers - Browser map with versions.
 * @returns Browser map with ranged versions.
 */
export declare function browserVersionsToRanges(browsers: BrowsersVersions): RangedBrowsersVersions;
//# sourceMappingURL=optimize.d.ts.map