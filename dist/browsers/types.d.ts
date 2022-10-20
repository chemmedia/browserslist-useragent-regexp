import type { Semver, RangedSemver } from '../semver/types.js';
export interface Browser {
    family: string;
    version: Semver;
}
export interface BrowserslistRequest {
    browsers?: string | string[];
    env?: string;
    path?: string;
}
export declare type BrowsersVersions = Map<string, Semver[]>;
export declare type RangedBrowsersVersions = Map<string, RangedSemver[]>;
//# sourceMappingURL=types.d.ts.map