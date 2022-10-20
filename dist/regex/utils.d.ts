import type { BrowserVersionedRegex } from '../useragent/types.js';
export declare const DIGIT_PATTERN = "\\d";
export declare const NUMBER_PATTERN: string;
export declare const BRACED_NUMBER_PATTERN: string;
export declare const ESCAPE_SYMBOL = "\\";
/**
 * Join regex parts with "or".
 * @param parts - Some regex parts.
 * @param wrapRequired - Should always wrap with braces.
 * @returns Joined parts.
 */
export declare function joinParts(parts: string[], wrapRequired?: boolean): string;
/**
 * Join regexes with "or".
 * @param versionedBrowsersRegexes - Regexes strings array.
 * @returns Joined regexes string.
 */
export declare function joinVersionedBrowsersRegexes(versionedBrowsersRegexes: BrowserVersionedRegex[]): string;
/**
 * Find number patterns count.
 * @param regex - Target string or regex.
 * @returns Number patterns count.
 */
export declare function getNumberPatternsCount(regex: string | RegExp): number;
/**
 * Convert regex to string without slashes.
 * @param regex - Target regex.
 * @returns Regex string without slashes.
 */
export declare function regexToString(regex: RegExp): string;
/**
 * Replace number patterns.
 * @param regex - Target regex.
 * @param numbers - Number patterns to paste.
 * @param numberPatternsCount - Number patterns count to replace.
 * @returns Regex string with replaced number patterns.
 */
export declare function replaceNumberPatterns(regex: string | RegExp, numbers: string[], numberPatternsCount?: number): string;
/**
 * Transform number to digits array.
 * @param num - Target number.
 * @returns Digits array.
 */
export declare function numberToDigits(num: string | number): number[];
/**
 * Skip every char inside square braces.
 * @param skip - Current skip state.
 * @param prevChar - Previous char.
 * @param char - Current char to check.
 * @returns Should skip this char or not.
 */
export declare function skipSquareBraces(skip: boolean, prevChar: string, char: string): boolean;
/**
 * Get possible regex group postfix.
 * @param regexStr - Whole regex string.
 * @param startFrom - Index to start capture.
 * @returns Regex group postfix part.
 */
export declare function capturePostfix(regexStr: string, startFrom: number): string;
//# sourceMappingURL=utils.d.ts.map