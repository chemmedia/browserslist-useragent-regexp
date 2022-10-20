/**
 * Get from regex part with number patterns.
 * @todo   Optimize.
 *   E.g.: (HeadlessChrome)(?:\/(\d+)\.(\d+)\.(\d+))?
 *   now: (?:\/(\d+)\.(\d+)\.(\d+))?
 *   need: (\d+)\.(\d+)\.(\d+)
 * @param regex - Target regex.
 * @param numberPatternsCount - Number patterns to extract.
 * @returns Regex part with number patterns.
 */
export declare function getNumberPatternsPart(regex: string | RegExp, numberPatternsCount?: number): string;
//# sourceMappingURL=numbersPart.d.ts.map