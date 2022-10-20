import type { UserAgentRegexOptions } from './types.js';
export declare const defaultOptions: {
    ignoreMinor: boolean;
    ignorePatch: boolean;
    allowZeroSubversions: boolean;
    allowHigherVersions: boolean;
};
/**
 * Compile browserslist query to regexes.
 * @param options - Browserslist and semver compare options.
 * @returns Objects with info about compiled regexes.
 */
export declare function getUserAgentRegexes(options?: UserAgentRegexOptions): import("../useragent/types.js").BrowserVersionedRegex[];
/**
 * Compile browserslist query to regex.
 * @param options - Browserslist and semver compare options.
 * @returns Compiled regex.
 */
export declare function getUserAgentRegex(options?: UserAgentRegexOptions): RegExp;
//# sourceMappingURL=useragentRegex.d.ts.map