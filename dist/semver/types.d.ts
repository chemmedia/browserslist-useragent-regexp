export interface SemverCompareOptions {
    ignoreMinor?: boolean;
    ignorePatch?: boolean;
    allowZeroSubversions?: boolean;
    allowHigherVersions?: boolean;
}
export declare type Semver = [
    number,
    number,
    number
];
export declare type SemverRange = number | number[];
export declare type RangedSemver = [
    SemverRange,
    SemverRange,
    SemverRange
];
export declare type SemverLike = string | (number | string)[];
export declare enum SemverPart {
    Major = 0,
    Minor = 1,
    Patch = 2
}
//# sourceMappingURL=types.d.ts.map