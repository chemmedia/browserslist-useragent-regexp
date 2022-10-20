export declare const OPTIMIZABLE_GROUP: RegExp;
export declare const CHARCLASS_UNESCAPES: RegExp;
/**
 * Optimize regex string:
 * - remove unnecessary braces;
 * - remove unnecessary escapes in ranges.
 * @param regexStr - Regex string to optimize.
 * @returns Optimized regex string.
 */
export declare function optimize(regexStr: string): string;
//# sourceMappingURL=optimize.d.ts.map