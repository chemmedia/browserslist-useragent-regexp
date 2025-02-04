/**
 * Get digit pattern.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param zeros - Zeros to add as prefix.
 * @returns Digit pattern.
 */
export declare function segmentRangeNumberPattern(from: number, to: number, zeros?: number): string;
/**
 * Split segment range to decade ranges.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Ranges.
 */
export declare function splitToDecadeRanges(from: number, to: number): [number, number][];
/**
 * Get common and diffs of two numbers (arrays of digits).
 * @param a - Digits.
 * @param b - Other digits.
 * @returns Common part and diffs.
 */
export declare function splitCommonDiff(a: number[], b: number[]): [string, number, number];
/**
 * Get shirter variant.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param rangeNumberPatterns - Numeric segment patterns.
 * @returns Enum or numeric segment patterns.
 */
export declare function enumOrRange(from: number, to: number, rangeNumberPatterns: string[]): string[];
/**
 * Get segment patterns.
 * @todo   Optomize. E.g. 32-99.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param digitsInNumber - How many digits should be en number. Will be filled by zeros.
 * @returns Segment patterns.
 */
export declare function segmentToNumberPatterns(from: number, to: number, digitsInNumber?: number): string[];
/**
 * Get segment or enum patterns.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Enum or numeric segment patterns.
 */
export declare function segmentToNumberPatternsOrEnum(from: number, to: number): string[];
//# sourceMappingURL=numberSegment.d.ts.map