import type { SemverLike, Semver, RangedSemver, SemverCompareOptions } from './types.js';
/**
 * Get semver from string or array.
 * @param version - Target to convert.
 * @returns Array with semver parts.
 */
export declare function semverify(version: SemverLike): Semver | null;
/**
 * Compare semvers.
 * @param a - Semver to compare.
 * @param b - Semver to compare with.
 * @param options - Compare options.
 * @returns Equals or not.
 */
export declare function compareSemvers(a: Semver, b: Semver, options: SemverCompareOptions): boolean;
/**
 * Get required semver parts count.
 * @param version - Semver parts or ranges.
 * @param options - Semver compare options.
 * @returns Required semver parts count.
 */
export declare function getRequiredSemverPartsCount(version: Semver | RangedSemver, options: SemverCompareOptions): number;
/**
 * Ranged semver to regex patterns.
 * @param rangedVersion - Ranged semver.
 * @param options - Semver compare options.
 * @returns Array of regex pattern strings.
 */
export declare function rangedSemverToRegex(rangedVersion: RangedSemver, options: SemverCompareOptions): string[][];
//# sourceMappingURL=semver.d.ts.map