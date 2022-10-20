'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uaRegexesLite = require('ua-regexes-lite');
var browserslist = require('browserslist');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var browserslist__default = /*#__PURE__*/_interopDefaultLegacy(browserslist);

exports.SemverPart = void 0;
(function(SemverPart) {
    SemverPart[SemverPart["Major"] = 0] = "Major";
    SemverPart[SemverPart["Minor"] = 1] = "Minor";
    SemverPart[SemverPart["Patch"] = 2] = "Patch";
})(exports.SemverPart || (exports.SemverPart = {}));

/**
 * Check target if is 'all'.
 * @param version - Target to check.
 * @returns Is 'all' or not.
 */ function isAllVersion(version) {
    const target = Array.isArray(version) ? version[0] : version;
    return target === "all";
}

const DIGIT_PATTERN = "\\d";
const NUMBER_PATTERN = `${DIGIT_PATTERN}+`;
const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`;
const ESCAPE_SYMBOL = "\\";
/**
 * Join regex parts with "or".
 * @param parts - Some regex parts.
 * @param wrapRequired - Should always wrap with braces.
 * @returns Joined parts.
 */ function joinParts(parts, wrapRequired = false) {
    const joined = parts.join("|");
    return wrapRequired || parts.length > 1 ? `(${joined})` : joined;
}
/**
 * Join regexes with "or".
 * @param versionedBrowsersRegexes - Regexes strings array.
 * @returns Joined regexes string.
 */ function joinVersionedBrowsersRegexes(versionedBrowsersRegexes) {
    return versionedBrowsersRegexes.map((_)=>`(${_.regexString})`).join("|");
}
/**
 * Find number patterns count.
 * @param regex - Target string or regex.
 * @returns Number patterns count.
 */ function getNumberPatternsCount(regex) {
    return regex.toString().split(BRACED_NUMBER_PATTERN).length - 1;
}
/**
 * Convert regex to string without slashes.
 * @param regex - Target regex.
 * @returns Regex string without slashes.
 */ function regexToString(regex) {
    return regex.toString().replace(/^\/|\/$/g, "");
}
/**
 * Replace number patterns.
 * @param regex - Target regex.
 * @param numbers - Number patterns to paste.
 * @param numberPatternsCount - Number patterns count to replace.
 * @returns Regex string with replaced number patterns.
 */ function replaceNumberPatterns(regex, numbers, numberPatternsCount) {
    const strRegex = typeof regex === "string" ? regex : regexToString(regex);
    const numbersToReplace = typeof numberPatternsCount === "number" && numberPatternsCount < numbers.length ? numbers.slice(0, numberPatternsCount) : numbers;
    const numberedStrRegex = numbersToReplace.reduce((_, num)=>_.replace(BRACED_NUMBER_PATTERN, num), strRegex);
    return numberedStrRegex;
}
/**
 * Transform number to digits array.
 * @param num - Target number.
 * @returns Digits array.
 */ function numberToDigits(num) {
    return Array.from(num.toString()).map(Number);
}
/**
 * Skip every char inside square braces.
 * @param skip - Current skip state.
 * @param prevChar - Previous char.
 * @param char - Current char to check.
 * @returns Should skip this char or not.
 */ function skipSquareBraces(skip, prevChar, char) {
    if (char === "[" && prevChar !== ESCAPE_SYMBOL) {
        return true;
    }
    if (char === "]" && prevChar !== ESCAPE_SYMBOL) {
        return false;
    }
    return skip;
}
/**
 * Get possible regex group postfix.
 * @param regexStr - Whole regex string.
 * @param startFrom - Index to start capture.
 * @returns Regex group postfix part.
 */ function capturePostfix(regexStr, startFrom) {
    let char = regexStr[startFrom];
    switch(char){
        case "+":
        case "*":
        case "?":
            return char;
        case "(":
            {
                const nextChar = regexStr[startFrom + 1];
                const afterNextChar = regexStr[startFrom + 2];
                if (nextChar !== "?" || afterNextChar !== "=" && afterNextChar !== "!") {
                    return "";
                }
                break;
            }
        case "{":
            break;
        default:
            return "";
    }
    const regexStrLength = regexStr.length;
    let prevChar = "";
    let braceBalance = 0;
    let skip = false;
    let postfix = "";
    for(let i = startFrom; i < regexStrLength; i++){
        char = regexStr[i];
        prevChar = regexStr[i - 1];
        skip = skipSquareBraces(skip, prevChar, char);
        if (!skip && prevChar !== ESCAPE_SYMBOL && (char === "(" || char === "{")) {
            braceBalance++;
        }
        if (braceBalance > 0) {
            postfix += char;
        }
        if (!skip && prevChar !== ESCAPE_SYMBOL && braceBalance > 0 && (char === ")" || char === "}")) {
            braceBalance--;
            if (braceBalance === 0) {
                break;
            }
        }
    }
    return postfix;
}

/**
 * Get digit pattern.
 * @param digit - Ray start.
 * @param includes - Include start digit or use next.
 * @returns Digit pattern.
 */ function rayRangeDigitPattern(digit, includes) {
    const rangeStart = digit + Number(!includes);
    if (rangeStart === 0) {
        return DIGIT_PATTERN;
    }
    if (rangeStart === 9) {
        return "9";
    }
    if (rangeStart > 9) {
        return "";
    }
    return `[${rangeStart}-9]`;
}
function filterDigitPattern(pattern) {
    return pattern === DIGIT_PATTERN;
}
/**
 * Reduce number patterns by removing useless patterns.
 * @todo   Is it still useful?
 * @param raysNumberPatterns - Number patterns to filter.
 * @returns Optimized number patterns.
 */ function optimizeRaysNumberPatterns(raysNumberPatterns) {
    let prev = [];
    let partsCount = 0;
    let prevPartsCount = 0;
    return raysNumberPatterns.filter((digitsPatterns, i)=>{
        if (i > 0) {
            partsCount = digitsPatterns.filter(filterDigitPattern).length;
            prevPartsCount = prev.filter(filterDigitPattern).length;
            if (partsCount <= prevPartsCount) {
                return false;
            }
        }
        prev = digitsPatterns;
        return true;
    });
}
/**
 * Create numeric ray pattern.
 * @param from - Start from this number.
 * @returns Numeric ray pattern parts.
 */ function rayToNumberPatterns(from) {
    if (from === 0) {
        return [
            NUMBER_PATTERN
        ];
    }
    const digits = numberToDigits(from);
    const digitsCount = digits.length;
    const other = `${DIGIT_PATTERN}{${digitsCount + 1},}`;
    const zeros = digitsCount - 1;
    if (from / Math.pow(10, zeros) === digits[0]) {
        return [
            `${rayRangeDigitPattern(digits[0], true)}${DIGIT_PATTERN.repeat(zeros)}`,
            other
        ];
    }
    const raysNumberPatterns = optimizeRaysNumberPatterns(digits.map((_, i)=>{
        const ri = digitsCount - i - 1;
        const d = i <= 0;
        let prev = " ";
        return digits.map((digit, j)=>{
            if (j < ri) {
                return digit.toString();
            }
            if (!prev) {
                return "";
            }
            if (j > ri) {
                return DIGIT_PATTERN;
            }
            prev = rayRangeDigitPattern(digit, d);
            return prev;
        });
    }));
    const numberPatterns = raysNumberPatterns.map((_)=>_.join(""));
    numberPatterns.push(other);
    return numberPatterns;
}

/**
 * Get digit pattern.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param zeros - Zeros to add as prefix.
 * @returns Digit pattern.
 */ function segmentRangeNumberPattern(from, to, zeros) {
    if (to < from) {
        return "";
    }
    const zerosPrefix = typeof zeros === "number" && zeros > 0 ? "0".repeat(zeros) : "";
    if (from === to) {
        return `${zerosPrefix}${from}`;
    }
    if (from === 0 && to === 9) {
        return `${zerosPrefix}${DIGIT_PATTERN}`;
    }
    return `${zerosPrefix}[${from}-${to}]`;
}
/**
 * Split segment range to decade ranges.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Ranges.
 */ function splitToDecadeRanges(from, to) {
    const ranges = [];
    let num = from;
    let decade = 1;
    do {
        decade *= 10;
        if (num < decade) {
            ranges.push([
                num,
                Math.min(decade - 1, to)
            ]);
            num = decade;
        }
    }while (decade <= to);
    return ranges;
}
/**
 * Get common and diffs of two numbers (arrays of digits).
 * @param a - Digits.
 * @param b - Other digits.
 * @returns Common part and diffs.
 */ function splitCommonDiff(a, b) {
    const len = a.length;
    if (len !== b.length || a[0] !== b[0]) {
        return null;
    }
    let common = a[0].toString();
    let currA = 0;
    let currB = 0;
    let diffA = "";
    let diffB = "";
    for(let i = 1; i < len; i++){
        currA = a[i];
        currB = b[i];
        if (currA === currB) {
            common += currA;
        } else {
            diffA += currA;
            diffB += currB;
        }
    }
    return [
        common,
        parseInt(diffA, 10),
        parseInt(diffB, 10)
    ];
}
/**
 * Get shirter variant.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param rangeNumberPatterns - Numeric segment patterns.
 * @returns Enum or numeric segment patterns.
 */ function enumOrRange(from, to, rangeNumberPatterns) {
    const rangePartsCount = rangeNumberPatterns.length;
    const nums = [];
    let rangeIndex = 0;
    let rangeSymbolsCount = 0;
    let enumSymbolsCount = 0;
    for(let num = from; num <= to; num++){
        nums.push(num.toString());
        enumSymbolsCount += Math.floor(Math.log10(num) + 1) + 1;
        while(enumSymbolsCount > rangeSymbolsCount){
            if (rangeIndex >= rangePartsCount) {
                return rangeNumberPatterns;
            }
            rangeSymbolsCount += rangeNumberPatterns[rangeIndex++].length + 1;
        }
    }
    return nums;
}
/**
 * Get segment patterns.
 * @todo   Optomize. E.g. 32-99.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param digitsInNumber - How many digits should be en number. Will be filled by zeros.
 * @returns Segment patterns.
 */ function segmentToNumberPatterns(from, to, digitsInNumber = 0) {
    const fromDigits = numberToDigits(from);
    const digitsCount = fromDigits.length;
    if (from < 10 && to < 10 || from === to) {
        const zeros = digitsInNumber - digitsCount;
        return [
            segmentRangeNumberPattern(from, to, zeros)
        ];
    }
    const toDigits = numberToDigits(to);
    if (digitsCount !== toDigits.length) {
        const decadeRanges = splitToDecadeRanges(from, to);
        const parts = [].concat(...decadeRanges.map(([from, to])=>segmentToNumberPatterns(from, to, digitsInNumber)));
        return parts;
    }
    const commonStart = splitCommonDiff(fromDigits, toDigits);
    if (Array.isArray(commonStart)) {
        const [common, from1, to1] = commonStart;
        const digitsInNumber1 = digitsCount - common.length;
        const diffParts = segmentToNumberPatterns(from1, to1, digitsInNumber1);
        return [
            `${common}${joinParts(diffParts)}`
        ];
    }
    const range = Array.from({
        length: digitsCount - 1
    });
    const middleSegment = segmentRangeNumberPattern(fromDigits[0] + 1, toDigits[0] - 1);
    const parts1 = [
        ...range.map((_, i)=>{
            const ri = digitsCount - i - 1;
            const d = Number(i > 0);
            return fromDigits.map((digit, j)=>{
                if (j < ri) {
                    return digit;
                }
                if (j > ri) {
                    return segmentRangeNumberPattern(0, 9);
                }
                return segmentRangeNumberPattern(digit + d, 9);
            }).join("");
        }),
        // but output more readable
        ...middleSegment ? [
            `${middleSegment}${DIGIT_PATTERN.repeat(digitsCount - 1)}`
        ] : [],
        ...range.map((_, i)=>{
            const ri = digitsCount - i - 1;
            const d = Number(i > 0);
            return toDigits.map((digit, j)=>{
                if (j < ri) {
                    return digit;
                }
                if (j > ri) {
                    return segmentRangeNumberPattern(0, 9);
                }
                return segmentRangeNumberPattern(0, digit - d);
            }).join("");
        })
    ];
    return parts1;
}
/**
 * Get segment or enum patterns.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Enum or numeric segment patterns.
 */ function segmentToNumberPatternsOrEnum(from, to) {
    return enumOrRange(from, to, segmentToNumberPatterns(from, to));
}

/**
 * Get regex for given numeric range.
 * @param from - Range start.
 * @param to - Range end.
 * @returns Range pattern.
 */ function rangeToRegex(from, to = Infinity) {
    if (isAllVersion(from)) {
        return NUMBER_PATTERN;
    }
    const numberPatterns = to === Infinity ? rayToNumberPatterns(from) : segmentToNumberPatternsOrEnum(from, to);
    const regexStr = joinParts(numberPatterns);
    return regexStr;
}

/**
 * Compare two arrays.
 * @param a - Array to compare.
 * @param b - Array to compare.
 * @param from - Index to start compare from.
 * @returns Equals or not.
 */ function compareArrays(a, b, from = 0) {
    const len = a.length;
    for(let i = from; i < len; i++){
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Remove duplicates from array.
 * @param items - Items to filter.
 * @returns Uniq items.
 */ function uniq(items) {
    return items.filter((_, i)=>!items.includes(_, i + 1));
}
/**
 * Remove duplicated arrays.
 * @param items - Array of arrays to remove duplicates.
 * @returns Uniq arrays.
 */ function uniqItems(items) {
    return items.filter(Boolean).filter((a, i, items)=>items && !items.some((b, j)=>j > i && compareArrays(a, b)));
}

/**
 * Get semver from string or array.
 * @param version - Target to convert.
 * @returns Array with semver parts.
 */ function semverify(version) {
    const versionParts = Array.isArray(version) ? version : version.toString().split(".");
    if (isAllVersion(versionParts[0])) {
        return [
            versionParts[0],
            0,
            0
        ];
    }
    let versionPart = null;
    let semverPart = null;
    const semver = [
        0,
        0,
        0
    ];
    for(let i = 0; i < 3; i++){
        versionPart = versionParts[i];
        if (typeof versionPart === "undefined") {
            continue;
        }
        semverPart = typeof versionPart === "number" ? versionPart : parseInt(versionPart, 10);
        if (isNaN(semverPart)) {
            return null;
        }
        semver[i] = semverPart;
    }
    return semver;
}
/**
 * Compare semvers.
 * @param a - Semver to compare.
 * @param b - Semver to compare with.
 * @param options - Compare options.
 * @returns Equals or not.
 */ function compareSemvers(a, b, options) {
    const [major, minor, patch] = a;
    const [majorBase, minorBase, patchBase] = b;
    const { ignoreMinor , ignorePatch , allowHigherVersions  } = options;
    if (isAllVersion(majorBase)) {
        return true;
    }
    const compareMinor = !ignoreMinor;
    // const comparePatch = ignoreMinor ? false : !ignorePatch;
    const comparePatch = compareMinor && !ignorePatch;
    if (allowHigherVersions) {
        if (comparePatch && patch < patchBase || compareMinor && minor < minorBase) {
            return false;
        }
        return major >= majorBase;
    }
    if (comparePatch && patch !== patchBase || compareMinor && minor !== minorBase) {
        return false;
    }
    return major === majorBase;
}
/**
 * Get required semver parts count.
 * @param version - Semver parts or ranges.
 * @param options - Semver compare options.
 * @returns Required semver parts count.
 */ function getRequiredSemverPartsCount(version, options) {
    const { ignoreMinor , ignorePatch , allowZeroSubversions  } = options;
    let shouldRepeatCount = ignoreMinor ? 1 : ignorePatch ? 2 : 3;
    if (allowZeroSubversions) {
        for(let i = shouldRepeatCount - 1; i > 0; i--){
            if (version[i] !== 0 || shouldRepeatCount === 1) {
                break;
            }
            shouldRepeatCount--;
        }
    }
    return shouldRepeatCount;
}
/**
 * Ranged semver to regex patterns.
 * @param rangedVersion - Ranged semver.
 * @param options - Semver compare options.
 * @returns Array of regex pattern strings.
 */ function rangedSemverToRegex(rangedVersion, options) {
    const { ignoreMinor , ignorePatch , allowHigherVersions  } = options;
    const ignoreIndex = isAllVersion(rangedVersion[0]) ? 0 : ignoreMinor ? 1 : ignorePatch ? 2 : Infinity;
    if (allowHigherVersions) {
        const numberPatterns = uniqItems(rangedVersion.map((_, i)=>{
            const ri = 2 - i;
            const d = Number(i > 0);
            let start = 0;
            return rangedVersion.map((range, j)=>{
                if (j >= ignoreIndex) {
                    return BRACED_NUMBER_PATTERN;
                }
                start = Array.isArray(range) ? range[0] : range;
                if (j < ri) {
                    return start.toString();
                }
                if (j > ri) {
                    return BRACED_NUMBER_PATTERN;
                }
                return rangeToRegex(start + d);
            });
        }));
        return numberPatterns;
    }
    const numberPatterns1 = rangedVersion.map((range, i)=>{
        if (i >= ignoreIndex) {
            return BRACED_NUMBER_PATTERN;
        }
        if (Array.isArray(range)) {
            return rangeToRegex(range[0], range[1]);
        }
        return range.toString();
    });
    return [
        numberPatterns1
    ];
}

/**
 * Check version.
 * @param minVersion - Semver version.
 * @param maxVersion - Semver version.
 * @param bases - Base semver versions.
 * @param options - Semver compare options.
 * @returns Some version is matched.
 */ function someSemverMatched(minVersion, maxVersion, bases, options) {
    const compareOptions = {
        ...options,
        allowHigherVersions: true
    };
    return (!minVersion || bases.some((_)=>compareSemvers(_, minVersion, compareOptions))) && (!maxVersion || bases.some((_)=>compareSemvers(maxVersion, _, compareOptions)));
}

// const { regexes } = require('ua-regexes-lite');
/**
 * Get useragent regexes for given browsers.
 * @param browsers - Browsers.
 * @param options - Semver compare options.
 * @param targetRegexes - Override default regexes.
 * @returns User agent regexes.
 */ function getRegexesForBrowsers(browsers, options, targetRegexes = uaRegexesLite.regexes) {
    const result = [];
    let prevFamily = "";
    let prevRegexIsGlobal = false;
    targetRegexes.forEach((regex)=>{
        const requestVersions = browsers.get(regex.family);
        if (!requestVersions) {
            return;
        }
        let { version , minVersion , maxVersion  } = regex;
        if (version) {
            minVersion = version;
            maxVersion = version;
        }
        if (someSemverMatched(minVersion, maxVersion, requestVersions, options)) {
            if (prevFamily === regex.family && prevRegexIsGlobal) {
                version = undefined;
                minVersion = undefined;
                maxVersion = undefined;
                result.pop();
            }
            result.push({
                ...regex,
                version,
                minVersion,
                maxVersion,
                requestVersions
            });
        }
        prevRegexIsGlobal = !version && !minVersion && !maxVersion;
        prevFamily = regex.family;
    });
    return result;
}

/**
 * Array of numbers to array of first and last elements.
 * @param numbers - Array of numbers.
 * @returns Number or two numbers.
 */ function numbersToRanges(numbers) {
    if (typeof numbers === "number") {
        return numbers;
    }
    if (numbers.length === 1) {
        return numbers[0];
    }
    return [
        numbers[0],
        numbers[numbers.length - 1]
    ];
}

/**
 * Browsers strings to info objects.
 * @param browsersList - Browsers strings with family and version.
 * @returns Browser info objects.
 */ function parseBrowsersList(browsersList) {
    return browsersList.reduce((browsers, browser)=>{
        const [family, ...versions] = browser.split(/ |-/);
        return versions.reduce((browsers, version)=>{
            const semver = semverify(version);
            if (semver) {
                browsers.push({
                    family,
                    version: semver
                });
            }
            return browsers;
        }, browsers);
    }, []);
}
/**
 * Request browsers list.
 * @param options - Options to get browsers list.
 * @returns Browser info objects.
 */ function getBrowsersList(options = {}) {
    const { browsers , env , path  } = options;
    const browsersList = browserslist__default["default"](browsers, {
        env,
        path
    });
    const parsedBrowsers = parseBrowsersList(browsersList);
    return parsedBrowsers;
}

/**
 * Merge browser info object to map with versions.
 * @param browsers - Browser info object to merge.
 * @returns Merged browsers map.
 */ function mergeBrowserVersions(browsers) {
    const merge = new Map();
    browsers.forEach(({ family , version  })=>{
        const versions = merge.get(family);
        if (versions) {
            const strVersion = version.join(".");
            if (versions.every((_)=>_.join(".") !== strVersion)) {
                versions.push(version);
            }
            return;
        }
        merge.set(family, [
            version
        ]);
    });
    merge.forEach((versions)=>{
        versions.sort((a, b)=>{
            for(const i in a){
                if (a[i] !== b[i]) {
                    return a[i] - b[i];
                }
            }
            return 0;
        });
    });
    return merge;
}
/**
 * Versions to ranged versions.
 * @param versions - Semver versions list.
 * @returns Ranged versions list.
 */ function versionsListToRanges(versions) {
    if (versions.length < 2) {
        return versions;
    }
    const max = versions.length + 1;
    const ranges = [];
    let prev = null;
    let current = versions[0];
    let major = [
        current[exports.SemverPart.Major]
    ];
    let minor = [
        current[exports.SemverPart.Minor]
    ];
    let patch = [
        current[exports.SemverPart.Patch]
    ];
    let part = null;
    for(let i = 1; i < max; i++){
        prev = versions[i - 1];
        current = versions[i] || [];
        for(let p = exports.SemverPart.Major; p <= exports.SemverPart.Patch; p++){
            if ((p === part || part === null) && prev[p] + 1 === current[p] && compareArrays(prev, current, p + 1)) {
                part = p;
                if (p === exports.SemverPart.Major) {
                    major.push(current[exports.SemverPart.Major]);
                } else {
                    major = current[exports.SemverPart.Major];
                }
                if (p === exports.SemverPart.Minor) {
                    minor.push(current[exports.SemverPart.Minor]);
                } else {
                    minor = current[exports.SemverPart.Minor];
                }
                if (p === exports.SemverPart.Patch) {
                    patch.push(current[exports.SemverPart.Patch]);
                } else {
                    patch = current[exports.SemverPart.Patch];
                }
                break;
            }
            if (part === p || prev[p] !== current[p]) {
                ranges.push([
                    numbersToRanges(major),
                    numbersToRanges(minor),
                    numbersToRanges(patch)
                ]);
                major = [
                    current[exports.SemverPart.Major]
                ];
                minor = [
                    current[exports.SemverPart.Minor]
                ];
                patch = [
                    current[exports.SemverPart.Patch]
                ];
                part = null;
                break;
            }
        }
    }
    return ranges;
}
/**
 * Browser versions to ranged versions.
 * @param browsers - Browser map with versions.
 * @returns Browser map with ranged versions.
 */ function browserVersionsToRanges(browsers) {
    const ranged = new Map();
    browsers.forEach((versions, family)=>{
        ranged.set(family, versionsListToRanges(versions));
    });
    return ranged;
}

const OPTIMIZABLE_GROUP = /^\([\s\w\d_\-/!]+\)$/;
const CHARCLASS_UNESCAPES = /[/.$*+?[{}|()]/;
/**
 * Optimize regex string:
 * - remove unnecessary braces;
 * - remove unnecessary escapes in ranges.
 * @param regexStr - Regex string to optimize.
 * @returns Optimized regex string.
 */ function optimize(regexStr) {
    const regexStrLength = regexStr.length;
    let inGroup = false;
    let skip = false;
    let char = "";
    let prevChar = "";
    let nextChar = "";
    let postfix = "";
    let groupAccum = "";
    let optimizedRegexStr = "";
    for(let i = 0; i < regexStrLength; i++){
        char = regexStr[i];
        prevChar = regexStr[i - 1];
        nextChar = regexStr[i + 1];
        skip = skipSquareBraces(skip, prevChar, char);
        if (!skip && prevChar !== ESCAPE_SYMBOL && char === "(") {
            if (inGroup) {
                optimizedRegexStr += groupAccum;
            }
            inGroup = true;
            groupAccum = "";
        }
        if (skip && char === ESCAPE_SYMBOL && CHARCLASS_UNESCAPES.test(nextChar)) {
            i++;
            char = nextChar;
        }
        if (inGroup) {
            groupAccum += char;
        } else {
            optimizedRegexStr += char;
        }
        if (!skip && prevChar !== ESCAPE_SYMBOL && char === ")" && inGroup) {
            inGroup = false;
            postfix = capturePostfix(regexStr, i + 1);
            groupAccum += postfix;
            if (groupAccum === BRACED_NUMBER_PATTERN || OPTIMIZABLE_GROUP.test(groupAccum)) {
                groupAccum = groupAccum.substr(1, groupAccum.length - 2);
            }
            optimizedRegexStr += groupAccum;
            i += postfix.length;
        }
    }
    return optimizedRegexStr;
}

/**
 * Get from regex part with number patterns.
 * @todo   Optimize.
 *   E.g.: (HeadlessChrome)(?:\/(\d+)\.(\d+)\.(\d+))?
 *   now: (?:\/(\d+)\.(\d+)\.(\d+))?
 *   need: (\d+)\.(\d+)\.(\d+)
 * @param regex - Target regex.
 * @param numberPatternsCount - Number patterns to extract.
 * @returns Regex part with number patterns.
 */ function getNumberPatternsPart(regex, numberPatternsCount) {
    const regexStr = typeof regex === "string" ? regex : regexToString(regex);
    const regexStrLength = regexStr.length;
    const maxNumbersCount = typeof numberPatternsCount === "number" ? numberPatternsCount : getNumberPatternsCount(regexStr);
    let braceBalance = 0;
    let skip = false;
    let numberCounter = 0;
    let char = "";
    let prevChar = "";
    let numberAccum = "";
    let numberPatternsPart = "";
    for(let i = 0; i < regexStrLength; i++){
        char = regexStr[i];
        prevChar = regexStr[i - 1];
        skip = skipSquareBraces(skip, prevChar, char);
        if (!skip && prevChar !== ESCAPE_SYMBOL && char === "(") {
            braceBalance++;
            numberAccum = "";
        }
        if (braceBalance > 0 || numberCounter > 0) {
            numberPatternsPart += char;
            numberAccum += char;
        }
        if (!skip && prevChar !== ESCAPE_SYMBOL && char === ")" && braceBalance > 0) {
            braceBalance--;
            if (numberAccum === BRACED_NUMBER_PATTERN) {
                numberCounter++;
            }
            if (braceBalance === 0 && numberCounter === 0) {
                numberPatternsPart = "";
            }
            if (braceBalance === 0 && numberCounter >= maxNumbersCount) {
                numberPatternsPart += capturePostfix(regexStr, ++i);
                break;
            }
        }
    }
    return numberPatternsPart;
}

/**
 * Apply ranged sevmers to the regex.
 * @todo   if `allowHigherVersions`, apply only min version.
 * @param regex - Target regex.
 * @param versions - Ranged semvers.
 * @param options - Semver compare options.
 * @returns Regex with given versions.
 */ function applyVersionsToRegex(regex, versions, options) {
    let maxRequiredPartsCount = 1;
    const regexStr = typeof regex === "string" ? regex : regexToString(regex);
    const numberPatternsCount = getNumberPatternsCount(regexStr);
    const suitableVersions = versions.map((version)=>{
        const requiredPartsCount = getRequiredSemverPartsCount(version, options);
        maxRequiredPartsCount = Math.max(maxRequiredPartsCount, requiredPartsCount);
        return numberPatternsCount >= requiredPartsCount ? version : null;
    }).filter(Boolean);
    if (!suitableVersions.length) {
        return null;
    }
    const numberPatternsPart = getNumberPatternsPart(regexStr, maxRequiredPartsCount);
    const versionsRegexPart = joinParts(uniq([].concat(...suitableVersions.map((version)=>rangedSemverToRegex(version, options).map((parts)=>replaceNumberPatterns(numberPatternsPart, parts, maxRequiredPartsCount))))));
    const regexWithVersions = regexStr.replace(numberPatternsPart, versionsRegexPart);
    return regexWithVersions;
}
/**
 * Apply browser versions to info objects.
 * @param browserRegexes - Objects with requested browser version and regex.
 * @param browsers - Ranged versions of browsers.
 * @param options - Semver compare options.
 * @returns Objects with requested browser version and regex special for this version.
 */ function applyVersionsToRegexes(browserRegexes, browsers, options) {
    const versionedRegexes = [];
    browserRegexes.forEach(({ family , regex: sourceRegex , version , requestVersions , ...other })=>{
        const sourceRegexString = regexToString(sourceRegex);
        let regex = null;
        let regexString = "";
        if (version) {
            regex = sourceRegex;
            regexString = sourceRegexString;
        } else {
            regexString = applyVersionsToRegex(sourceRegexString, browsers.get(family), options);
            regex = new RegExp(regexString);
        }
        if (regexString && regex) {
            versionedRegexes.push({
                family,
                sourceRegex,
                sourceRegexString,
                regex,
                regexString,
                version,
                requestVersions,
                requestVersionsStrings: requestVersions.map((_)=>isAllVersion(_) ? String(_[0]) : _.join(".")),
                ...other
            });
        }
    });
    return versionedRegexes;
}

/**
 * Optimize all regexes.
 * @param regexes - Objects with info about compiled regexes.
 * @returns Objects with info about optimized regexes.
 */ function optimizeAll(regexes) {
    return regexes.map(({ regexString , ...regex })=>{
        const optimizedRegexStr = optimize(regexString);
        const optimizedRegex = new RegExp(optimizedRegexStr);
        return {
            ...regex,
            regex: optimizedRegex,
            regexString: optimizedRegexStr
        };
    });
}

const defaultOptions = {
    ignoreMinor: false,
    ignorePatch: true,
    allowZeroSubversions: false,
    allowHigherVersions: false
};
/**
 * Compile browserslist query to regexes.
 * @param options - Browserslist and semver compare options.
 * @returns Objects with info about compiled regexes.
 */ function getUserAgentRegexes(options = {}) {
    const { browsers , env , path , ...otherOptions } = options;
    const finalOptions = {
        ...defaultOptions,
        ...otherOptions
    };
    const browsersList = getBrowsersList({
        browsers,
        env,
        path
    });
    const mergedBrowsers = mergeBrowserVersions(browsersList);
    const rangedBrowsers = browserVersionsToRanges(mergedBrowsers);
    const sourceRegexes = getRegexesForBrowsers(mergedBrowsers, finalOptions);
    const versionedRegexes = applyVersionsToRegexes(sourceRegexes, rangedBrowsers, finalOptions);
    const optimizedRegexes = optimizeAll(versionedRegexes);
    return optimizedRegexes;
}
/**
 * Compile browserslist query to regex.
 * @param options - Browserslist and semver compare options.
 * @returns Compiled regex.
 */ function getUserAgentRegex(options = {}) {
    const regexes = getUserAgentRegexes(options);
    const regexStr = joinVersionedBrowsersRegexes(regexes);
    const regex = new RegExp(regexStr);
    return regex;
}

exports.BRACED_NUMBER_PATTERN = BRACED_NUMBER_PATTERN;
exports.CHARCLASS_UNESCAPES = CHARCLASS_UNESCAPES;
exports.DIGIT_PATTERN = DIGIT_PATTERN;
exports.ESCAPE_SYMBOL = ESCAPE_SYMBOL;
exports.NUMBER_PATTERN = NUMBER_PATTERN;
exports.OPTIMIZABLE_GROUP = OPTIMIZABLE_GROUP;
exports.applyVersionsToRegex = applyVersionsToRegex;
exports.applyVersionsToRegexes = applyVersionsToRegexes;
exports.browserVersionsToRanges = browserVersionsToRanges;
exports.capturePostfix = capturePostfix;
exports.compareSemvers = compareSemvers;
exports.defaultOptions = defaultOptions;
exports.enumOrRange = enumOrRange;
exports.getBrowsersList = getBrowsersList;
exports.getNumberPatternsCount = getNumberPatternsCount;
exports.getNumberPatternsPart = getNumberPatternsPart;
exports.getRegexesForBrowsers = getRegexesForBrowsers;
exports.getRequiredSemverPartsCount = getRequiredSemverPartsCount;
exports.getUserAgentRegex = getUserAgentRegex;
exports.getUserAgentRegexes = getUserAgentRegexes;
exports.isAllVersion = isAllVersion;
exports.joinParts = joinParts;
exports.joinVersionedBrowsersRegexes = joinVersionedBrowsersRegexes;
exports.mergeBrowserVersions = mergeBrowserVersions;
exports.numberToDigits = numberToDigits;
exports.numbersToRanges = numbersToRanges;
exports.optimize = optimize;
exports.optimizeAll = optimizeAll;
exports.optimizeRaysNumberPatterns = optimizeRaysNumberPatterns;
exports.parseBrowsersList = parseBrowsersList;
exports.rangeToRegex = rangeToRegex;
exports.rangedSemverToRegex = rangedSemverToRegex;
exports.rayRangeDigitPattern = rayRangeDigitPattern;
exports.rayToNumberPatterns = rayToNumberPatterns;
exports.regexToString = regexToString;
exports.replaceNumberPatterns = replaceNumberPatterns;
exports.segmentRangeNumberPattern = segmentRangeNumberPattern;
exports.segmentToNumberPatterns = segmentToNumberPatterns;
exports.segmentToNumberPatternsOrEnum = segmentToNumberPatternsOrEnum;
exports.semverify = semverify;
exports.skipSquareBraces = skipSquareBraces;
exports.someSemverMatched = someSemverMatched;
exports.splitCommonDiff = splitCommonDiff;
exports.splitToDecadeRanges = splitToDecadeRanges;
exports.versionsListToRanges = versionsListToRanges;
//# sourceMappingURL=index.js.map
