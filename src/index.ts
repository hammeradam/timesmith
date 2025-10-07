export type TimeUnit = 'w' | 'd' | 'h' | 'm' | 's' | 'ms';

/**
 * Configuration options for the time builder
 */
export interface TimeOptions {
  /**
   * The initial time in milliseconds
   * @default 0
   */
  ms?: number;
}

interface TimeUnitTranslation {
  plural: string;
  singular: string;
}

export interface Translation {
  short: TimeUnitTranslation;
  long: TimeUnitTranslation;
}

export interface Translations {
  week: Translation;
  day: Translation;
  hour: Translation;
  minute: Translation;
  second: Translation;
  millisecond: Translation;
}

export const defaultTranslations: Translations = {
  week: { short: { singular: 'w', plural: 'w' }, long: { singular: 'week', plural: 'weeks' } },
  day: { short: { singular: 'd', plural: 'd' }, long: { singular: 'day', plural: 'days' } },
  hour: { short: { singular: 'h', plural: 'h' }, long: { singular: 'hour', plural: 'hours' } },
  minute: { short: { singular: 'm', plural: 'm' }, long: { singular: 'minute', plural: 'minutes' } },
  second: { short: { singular: 's', plural: 's' }, long: { singular: 'second', plural: 'seconds' } },
  millisecond: { short: { singular: 'ms', plural: 'm' }, long: { singular: 'millisecond', plural: 'milliseconds' } },
};

export interface ToStringOptions {
  /**
   * Use short or long unit forms
   * @default 'long'
   * @example
   * 'short' - w, d, h, m, s, ms
   * 'long' - week, day, hour, minute, second, millisecond
   */
  format?: 'short' | 'long';
  /**
   * Separator between time parts
   * @default ", "
   */
  separator?: string;
  /**
   * Translations to use for formatting
   * @default { week: { short: 'w', long: 'week' }, ... }
   */
  translations?: Translations;
}

export interface ToISO8601StringOptions {
  /**
   * Use short or long unit forms
   * @default 'long'
   * @example
   * 'short' - 1DT0.5S
   * 'long' - P0Y0M0W1DT0H0M0.5S
   */
  format?: 'short' | 'long';
}

export interface BuildOptions {
  /**
   * The unit to convert the final result to
   * @default 's'
   * @example
   * 'w' - weeks
   * 'd' - days
   * 'h' - hours
   * 'm' - minutes
   * 's' - seconds
   * 'ms' - milliseconds
   */
  unit?: TimeUnit;
}

interface TimeBuilderWeek extends Omit<TimeBuilder, 'week' | 'addWeeks'> {}
interface TimeBuilderDay extends Omit<TimeBuilder, 'week' | 'addWeeks' | 'day' | 'addDays'> {}
interface TimeBuilderHour extends Omit<TimeBuilder, 'week' | 'addWeeks' | 'day' | 'addDays' | 'hour' | 'addHours'> {}
interface TimeBuilderMinute extends Omit<TimeBuilder, 'week' | 'addWeeks' | 'day' | 'addDays' | 'hour' | 'addHours' | 'minute' | 'addMinutes'> {}
interface TimeBuilderSecond extends Omit<TimeBuilder, 'week' | 'addWeeks' | 'day' | 'addDays' | 'hour' | 'addHours' | 'minute' | 'addMinutes' | 'second' | 'addSeconds'> {}
interface TimeBuilderMillisecond extends Omit<TimeBuilder, 'week' | 'addWeeks' | 'day' | 'addDays' | 'hour' | 'addHours' | 'minute' | 'addMinutes' | 'second' | 'addSeconds' | 'millisecond' | 'addMilliseconds'> {}

export interface TimeBuilder {
  /**
   * Adds weeks to the time object
   * @param weeks - Number of weeks to add
   * @returns A time object
   */
  week: (weeks?: number) => TimeBuilderWeek;
  /**
   * Adds weeks to the time object
   * @param weeks - Number of weeks to add
   * @returns A time object
   */
  addWeeks: (weeks?: number) => TimeBuilderWeek;
  /**
   * Adds days to the time object
   * @param days - Number of days to add
   * @returns A time object
   */
  day: (days?: number) => TimeBuilderDay;
  /**
   * Adds days to the time object
   * @param days - Number of days to add
   * @returns A time object
   */
  addDays: (days?: number) => TimeBuilderDay;
  /**
   * Adds hours to the time object
   * @param hours - Number of hours to add
   * @returns A time object
   */
  hour: (hours?: number) => TimeBuilderHour;
  /**
   * Adds hours to the time object
   * @param hours - Number of hours to add
   * @returns A time object
   */
  addHours: (hours?: number) => TimeBuilderHour;
  /**
   * Adds minutes to the time object
   * @param minutes - Number of minutes to add
   * @returns A time object
   */
  minute: (minutes?: number) => TimeBuilderMinute;
  /**
   * Adds minutes to the time object
   * @param minutes - Number of minutes to add
   * @returns A time object
   */
  addMinutes: (minutes?: number) => TimeBuilderMinute;
  /**
   * Adds seconds to the time object
   * @param seconds - Number of seconds to add
   * @returns A time object
   */
  second: (seconds?: number) => TimeBuilderSecond;
  /**
   * Adds seconds to the time object
   * @param seconds - Number of seconds to add
   * @returns A time object
   */
  addSeconds: (seconds?: number) => TimeBuilderSecond;
  /**
   * Adds milliseconds to the time object
   * @param milliseconds - Number of milliseconds to add
   * @returns A time object
   */
  millisecond: (milliseconds?: number) => TimeBuilderMillisecond;
  /**
   * Adds milliseconds to the time object
   * @param milliseconds - Number of milliseconds to add
   * @returns A time object
   */
  addMilliseconds: (milliseconds?: number) => TimeBuilderMillisecond;
  /**
   * Converts the time object to a human readable string
   * @param options - Configuration options for the time builder
   * @param options.format - 'long' (default) or 'short'
   * @param options.separator - Custom separator (default: ', ')
   * @param options.translations - Custom translations object
   * @example time().day(1).hour(2).toString() // Returns "1 day, 2 hours"
   * @returns A human readable string
   */
  toString: (options?: ToStringOptions) => string;
  /**
   * Converts the time object to an ISO 8601 string
   * @example time().day(1).hour(2).toISO8601String() // Returns "P1DT2H"
   * @returns A ISO 8601 string
   */
  toISO8601String: (toISO8601StringOptions?: ToISO8601StringOptions) => string;
  /**
   * Parses a time string and returns a time object
   * @param timeString - Time string to parse
   * @example time().fromString('1d 2h 30m').build() // Returns 94200 (seconds)
   * @returns A time object
   */
  fromString: (timeString: string) => TimeBuilder;
  /**
   * Parses an ISO 8601 string and returns a time object
   * @param timeString
   * @example time().fromISO8601String('P1DT2H30M').build() // Returns 94200 (seconds)
   * @returns
   */
  fromISO8601String: (timeString: string) => TimeBuilder;
  /**
   * Builds a time object from the given options
   * @param options - Configuration options for the time builder
   * @param options.unit - Target unit for conversion (default: 's')
   * @returns A time object
   */
  build: (options?: BuildOptions) => number;
  /**
   * Returns the number of weeks in the time object
   * @returns The number of weeks in the time object
   */
  toWeeks: () => number;
  /**
   * Returns the number of days in the time object
   * @returns The number of days in the time object
   */
  toDays: () => number;
  /**
   * Returns the number of hours in the time object
   * @returns The number of hours in the time object
   */
  toHours: () => number;
  /**
   * Returns the number of minutes in the time object
   * @returns The number of minutes in the time object
   */
  toMinutes: () => number;
  /**
   * Returns the number of seconds in the time object
   * @returns The number of seconds in the time object
   */
  toSeconds: () => number;
  /**
   * Returns the number of milliseconds in the time object
   * @returns The number of milliseconds in the time object
   */
  toMilliseconds: () => number;
  /**
   * Adds another duration to the current duration
   * @param duration - The duration to add (any TimeBuilder variant)
   * @returns A new time object with the combined duration
   * @example time().hour(1).add(time().minute(30)) // Returns 1 hour 30 minutes
   */
  add: (duration: Pick<TimeBuilder, 'toMilliseconds'>) => TimeBuilder;
  /**
   * Subtracts another duration from the current duration
   * @param duration - The duration to subtract (any TimeBuilder variant)
   * @returns A new time object with the result (minimum 0)
   * @example time().hour(2).subtract(time().minute(30)) // Returns 1 hour 30 minutes
   */
  subtract: (duration: Pick<TimeBuilder, 'toMilliseconds'>) => TimeBuilder;
}

const TIME_CONSTANTS = {
  YEAR_IN_MS: 365 * 24 * 60 * 60 * 1000,
  MONTH_IN_MS: 30 * 24 * 60 * 60 * 1000,
  WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  HOUR_IN_MS: 60 * 60 * 1000,
  MINUTE_IN_MS: 60 * 1000,
  SECOND_IN_MS: 1000,
} as const;

function convertToUnit(ms: number, unit: TimeUnit): number {
  switch (unit) {
    case 'w':
      return ms / TIME_CONSTANTS.WEEK_IN_MS;
    case 'd':
      return ms / TIME_CONSTANTS.DAY_IN_MS;
    case 'h':
      return ms / TIME_CONSTANTS.HOUR_IN_MS;
    case 'm':
      return ms / TIME_CONSTANTS.MINUTE_IN_MS;
    case 's':
      return ms / TIME_CONSTANTS.SECOND_IN_MS;
    case 'ms':
      return ms;
  }
}

function validateInput(value: number, unit: string) {
  if (value < 0) {
    throw new Error(`Invalid ${unit} value: ${value}. Must be non-negative.`);
  }
  if (!Number.isFinite(value)) {
    throw new TypeError(`Invalid ${unit} value: ${value}. Must be finite.`);
  }
}

function addWeeks(currentMs: number, weeks = 1) {
  validateInput(weeks, 'weeks');
  return time({
    ms: currentMs + weeks * TIME_CONSTANTS.WEEK_IN_MS,
  });
}

function addDays(currentMs: number, days = 1) {
  validateInput(days, 'days');
  return time({
    ms: currentMs + days * TIME_CONSTANTS.DAY_IN_MS,
  });
}

function addHours(currentMs: number, hours = 1) {
  validateInput(hours, 'hours');
  return time({
    ms: currentMs + hours * TIME_CONSTANTS.HOUR_IN_MS,
  });
}

function addMinutes(currentMs: number, minutes = 1) {
  validateInput(minutes, 'minutes');
  return time({
    ms: currentMs + minutes * TIME_CONSTANTS.MINUTE_IN_MS,
  });
}

function addSeconds(currentMs: number, seconds = 1) {
  validateInput(seconds, 'seconds');
  return time({
    ms: currentMs + seconds * TIME_CONSTANTS.SECOND_IN_MS,
  });
}

function addMilliseconds(currentMs: number, milliseconds = 1) {
  validateInput(milliseconds, 'milliseconds');
  return time({
    ms: currentMs + milliseconds,
  });
}

function toString(currentMs: number, toStringOptions?: ToStringOptions) {
  const { format = 'long', separator = ', ', translations = defaultTranslations } = toStringOptions || {};
  const isShort = format === 'short';
  const parts: string[] = [];
  let remaining = currentMs;

  const unitMap = {
    week: { long: translations.week.long, short: translations.week.short, ms: TIME_CONSTANTS.WEEK_IN_MS },
    day: { long: translations.day.long, short: translations.day.short, ms: TIME_CONSTANTS.DAY_IN_MS },
    hour: { long: translations.hour.long, short: translations.hour.short, ms: TIME_CONSTANTS.HOUR_IN_MS },
    minute: { long: translations.minute.long, short: translations.minute.short, ms: TIME_CONSTANTS.MINUTE_IN_MS },
    second: { long: translations.second.long, short: translations.second.short, ms: TIME_CONSTANTS.SECOND_IN_MS },
    millisecond: { long: translations.millisecond.long, short: translations.millisecond.short, ms: 1 },
  } as const;

  for (const [_, { long, short, ms: unitMs }] of Object.entries(
    unitMap,
  )) {
    const value = Math.floor(remaining / unitMs);
    const isPlural = value !== 1;
    if (value > 0) {
      parts.push(
        `${value}${isShort ? '' : ' '}${isPlural ? isShort ? short.plural : long.plural : isShort ? short.singular : long.singular}`,
      );
      remaining %= unitMs;
    }
  }

  return parts.join(separator);
}

function fromString(timeString: string) {
  const parts = timeString.trim().split(/\s+/);
  let totalMs = 0;

  const unitMap = {
    w: TIME_CONSTANTS.WEEK_IN_MS,
    week: TIME_CONSTANTS.WEEK_IN_MS,
    weeks: TIME_CONSTANTS.WEEK_IN_MS,
    d: TIME_CONSTANTS.DAY_IN_MS,
    day: TIME_CONSTANTS.DAY_IN_MS,
    days: TIME_CONSTANTS.DAY_IN_MS,
    h: TIME_CONSTANTS.HOUR_IN_MS,
    hour: TIME_CONSTANTS.HOUR_IN_MS,
    hours: TIME_CONSTANTS.HOUR_IN_MS,
    m: TIME_CONSTANTS.MINUTE_IN_MS,
    minute: TIME_CONSTANTS.MINUTE_IN_MS,
    minutes: TIME_CONSTANTS.MINUTE_IN_MS,
    s: TIME_CONSTANTS.SECOND_IN_MS,
    second: TIME_CONSTANTS.SECOND_IN_MS,
    seconds: TIME_CONSTANTS.SECOND_IN_MS,
    ms: 1,
    millisecond: 1,
    milliseconds: 1,
  } as const;

  const timeRegex
    = /^(\d+)([wdhms]|ms|week|weeks|day|days|hour|hours|minute|minutes|second|seconds|millisecond|milliseconds)$/i;

  for (const part of parts) {
    const matches = part.match(timeRegex);
    if (!matches) {
      throw new Error(`Invalid time string part: ${part}`);
    }

    const [_, valueStr, unit] = matches;
    const value = Number(valueStr);

    if (!unit) {
      throw new Error(`Invalid time string part: ${part}`);
    }

    const unitMs = unitMap[unit.toLowerCase() as keyof typeof unitMap];

    validateInput(value, unit);
    totalMs += value * unitMs;
  }

  return time({ ms: totalMs });
}

function toISO8601String(currentMs: number, toISO8601StringOptions?: ToStringOptions) {
  const { format = 'long' } = toISO8601StringOptions || {};
  let remaining = currentMs;

  const unitMap = {
    year: { abbr: 'Y', ms: TIME_CONSTANTS.YEAR_IN_MS },
    month: { abbr: 'M', ms: TIME_CONSTANTS.MONTH_IN_MS },
    week: { abbr: 'W', ms: TIME_CONSTANTS.WEEK_IN_MS },
    day: { abbr: 'D', ms: TIME_CONSTANTS.DAY_IN_MS },
    hour: { abbr: 'H', ms: TIME_CONSTANTS.HOUR_IN_MS },
    minute: { abbr: 'M', ms: TIME_CONSTANTS.MINUTE_IN_MS },
    second: { abbr: 'S', ms: TIME_CONSTANTS.SECOND_IN_MS },
  } as const;

  let result = 'P';

  for (const [_, { abbr, ms: unitMs }] of Object.entries(
    unitMap,
  )) {
    if (abbr === 'S') {
      const amount = remaining / unitMs;

      if (amount > 0 || format === 'long') {
        result += `${amount}${abbr}`;
      }
    }
    else {
      const amount = Math.floor(remaining / unitMs);

      if (amount > 0 || format === 'long') {
        result += `${amount}${abbr}`;
      }
    }

    if (abbr === 'D') {
      result += 'T';
    }

    remaining %= unitMs;
  }

  return result;
}

function fromISO8601String(timeString: string) {
  let totalMs = 0;

  // Validate the string starts with 'P'
  if (!timeString.startsWith('P')) {
    throw new Error(`Invalid ISO 8601 duration string: ${timeString}. Must start with 'P'.`);
  }

  const largeUnitMap = {
    Y: TIME_CONSTANTS.YEAR_IN_MS,
    M: TIME_CONSTANTS.MONTH_IN_MS,
    W: TIME_CONSTANTS.WEEK_IN_MS,
    D: TIME_CONSTANTS.DAY_IN_MS,
  } as const;

  const smallUnitMap = {
    H: TIME_CONSTANTS.HOUR_IN_MS,
    M: TIME_CONSTANTS.MINUTE_IN_MS,
    S: TIME_CONSTANTS.SECOND_IN_MS,
  } as const;

  // Split by 'T' to separate date and time parts
  const [datePart, timePart] = timeString.split('T');

  // Remove the 'P' prefix from date part
  const dateString = datePart.substring(1);

  // Parse date part (P[n]Y[n]M[n]W[n]D)
  if (dateString) {
    const dateRegex = /(\d+(?:\.\d+)?)([YMWD])/g;
    const matches = [...dateString.matchAll(dateRegex)];

    for (const match of matches) {
      const value = Number.parseFloat(match[1]);
      const unit = match[2] as keyof typeof largeUnitMap;

      if (!Number.isFinite(value) || value < 0) {
        throw new Error(`Invalid value in ISO 8601 duration: ${value}${unit}`);
      }

      totalMs += value * largeUnitMap[unit];
    }
  }

  // Parse time part (T[n]H[n]M[n]S)
  if (timePart) {
    const timeRegex = /(\d+(?:\.\d+)?)([HMS])/g;
    const matches = [...timePart.matchAll(timeRegex)];

    for (const match of matches) {
      const value = Number.parseFloat(match[1]);
      const unit = match[2] as keyof typeof smallUnitMap;

      if (!Number.isFinite(value) || value < 0) {
        throw new Error(`Invalid value in ISO 8601 duration: ${value}${unit}`);
      }

      totalMs += value * smallUnitMap[unit];
    }
  }

  return time({ ms: totalMs });
}

function build(currentMs: number, options: BuildOptions = {}) {
  const { unit = 's' } = options;
  return convertToUnit(currentMs, unit);
}

function add(currentMs: number, duration: Pick<TimeBuilder, 'toMilliseconds'>) {
  const durationMs = duration.toMilliseconds();
  return time({ ms: currentMs + durationMs });
}

function subtract(currentMs: number, duration: Pick<TimeBuilder, 'toMilliseconds'>) {
  const durationMs = duration.toMilliseconds();
  // Ensure result is not negative
  return time({ ms: Math.max(0, currentMs - durationMs) });
}

/**
 * Creates a time builder for converting between different time units
 * @param options - Configuration options for the time builder
 * @param options.ms - Initial time in milliseconds (default: 0)
 * @param options.unit - Target unit for conversion (default: 's')
 * @returns A builder object for chaining time conversions
 * @throws {Error} When input values are negative or not finite
 *
 * @example Convert to seconds (default)
 * ```ts
 * time().day(1).hour(2).minute(30).build()
 * // Returns: 94200 (seconds)
 * ```
 *
 * @example Convert to milliseconds
 * ```ts
 * time({ unit: 'ms' }).hour(1).build()
 * // Returns: 3600000 (milliseconds)
 * ```
 *
 * @example Get human readable string
 * ```ts
 * time().day(1).hour(2).toString()
 * // Returns: "1 day, 2 hours"
 * ```
 */
export function time(options?: TimeOptions): TimeBuilder {
  const { ms = 0 } = options || {};

  return {
    week: (weeks = 1) => addWeeks(ms, weeks),
    addWeeks: (weeks = 1) => addWeeks(ms, weeks),
    day: (days = 1) => addDays(ms, days),
    addDays: (days = 1) => addDays(ms, days),
    hour: (hours = 1) => addHours(ms, hours),
    addHours: (hours = 1) => addHours(ms, hours),
    minute: (minutes = 1) => addMinutes(ms, minutes),
    addMinutes: (minutes = 1) => addMinutes(ms, minutes),
    second: (seconds = 1) => addSeconds(ms, seconds),
    addSeconds: (seconds = 1) => addSeconds(ms, seconds),
    millisecond: (milliseconds = 1) => addMilliseconds(ms, milliseconds),
    addMilliseconds: (milliseconds = 1) => addMilliseconds(ms, milliseconds),
    toString: (toStringOptions?: ToStringOptions) => toString(ms, toStringOptions),
    fromString: (timeString: string) => fromString(timeString),
    toISO8601String: (toISO8601StringOptions?: ToISO8601StringOptions) => toISO8601String(ms, toISO8601StringOptions),
    fromISO8601String: (timeString: string) => fromISO8601String(timeString),
    toWeeks: () => ms / TIME_CONSTANTS.WEEK_IN_MS,
    toDays: () => ms / TIME_CONSTANTS.DAY_IN_MS,
    toHours: () => ms / TIME_CONSTANTS.HOUR_IN_MS,
    toMinutes: () => ms / TIME_CONSTANTS.MINUTE_IN_MS,
    toSeconds: () => ms / TIME_CONSTANTS.SECOND_IN_MS,
    toMilliseconds: () => ms,
    build: (options: BuildOptions = {}) => build(ms, options),
    add: (duration: Pick<TimeBuilder, 'toMilliseconds'>) => add(ms, duration),
    subtract: (duration: Pick<TimeBuilder, 'toMilliseconds'>) => subtract(ms, duration),
  };
}
