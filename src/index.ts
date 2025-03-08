export type TimeUnit = 'w' | 'd' | 'h' | 'm' | 's' | 'ms';

const TIME_CONSTANTS = {
  WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  HOUR_IN_MS: 60 * 60 * 1000,
  MINUTE_IN_MS: 60 * 1000,
  SECOND_IN_MS: 1000,
} as const;

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

export interface TimeBuilder {
  week: (weeks?: number) => TimeBuilder;
  day: (days?: number) => TimeBuilder;
  hour: (hours?: number) => TimeBuilder;
  minute: (minutes?: number) => TimeBuilder;
  second: (seconds?: number) => TimeBuilder;
  millisecond: (milliseconds?: number) => TimeBuilder;
  toString: (options?: ToStringOptions) => string;
  fromString: (timeString: string) => TimeBuilder;
  build: (options?: BuildOptions) => number;
  toWeeks: () => number;
  toDays: () => number;
  toHours: () => number;
  toMinutes: () => number;
  toSeconds: () => number;
  toMilliseconds: () => number;
}

const convertToUnit = (ms: number, unit: TimeUnit): number => {
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
};

const validateInput = (value: number, unit: string) => {
  if (value < 0) {
    throw new Error(`Invalid ${unit} value: ${value}. Must be non-negative.`);
  }
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${unit} value: ${value}. Must be finite.`);
  }
};

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

  const builder = {
    week: (weeks = 1) => {
      validateInput(weeks, 'weeks');
      return time({
        ms: ms + weeks * TIME_CONSTANTS.WEEK_IN_MS,
      });
    },
    day: (days = 1) => {
      validateInput(days, 'days');
      return time({
        ms: ms + days * TIME_CONSTANTS.DAY_IN_MS,
      });
    },
    hour: (hours = 1) => {
      validateInput(hours, 'hours');
      return time({
        ms: ms + hours * TIME_CONSTANTS.HOUR_IN_MS,
      });
    },
    minute: (minutes = 1) => {
      validateInput(minutes, 'minutes');
      return time({
        ms: ms + minutes * TIME_CONSTANTS.MINUTE_IN_MS,
      });
    },
    second: (seconds = 1) => {
      validateInput(seconds, 'seconds');
      return time({
        ms: ms + seconds * TIME_CONSTANTS.SECOND_IN_MS,
      });
    },
    millisecond: (milliseconds = 1) => {
      validateInput(milliseconds, 'milliseconds');
      return time({
        ms: ms + milliseconds,
      });
    },
    toString: (stringOptions?: ToStringOptions) => {
      const { format = 'long', separator = ', ' } = stringOptions || {};
      const isShort = format === 'short';
      const parts: string[] = [];
      let remaining = ms;

      const unitMap = {
        week: { long: 'week', short: 'w', ms: TIME_CONSTANTS.WEEK_IN_MS },
        day: { long: 'day', short: 'd', ms: TIME_CONSTANTS.DAY_IN_MS },
        hour: { long: 'hour', short: 'h', ms: TIME_CONSTANTS.HOUR_IN_MS },
        minute: { long: 'minute', short: 'm', ms: TIME_CONSTANTS.MINUTE_IN_MS },
        second: { long: 'second', short: 's', ms: TIME_CONSTANTS.SECOND_IN_MS },
        millisecond: { long: 'millisecond', short: 'ms', ms: 1 },
      } as const;

      for (const [_, { long, short: shortUnit, ms: unitMs }] of Object.entries(
        unitMap,
      )) {
        const value = Math.floor(remaining / unitMs);
        if (value > 0) {
          const unit = isShort ? shortUnit : long;
          parts.push(
            `${value}${isShort ? '' : ' '}${unit}${!isShort && value !== 1 ? 's' : ''}`,
          );
          remaining %= unitMs;
        }
      }

      return parts.join(separator);
    },
    fromString: (timeString: string) => {
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

      const timeRegex =
        /^(\d+)(w|d|h|m|s|ms|week|weeks|day|days|hour|hours|minute|minutes|second|seconds|millisecond|milliseconds)$/i;

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
    },
    toWeeks: () => ms / TIME_CONSTANTS.WEEK_IN_MS,
    toDays: () => ms / TIME_CONSTANTS.DAY_IN_MS,
    toHours: () => ms / TIME_CONSTANTS.HOUR_IN_MS,
    toMinutes: () => ms / TIME_CONSTANTS.MINUTE_IN_MS,
    toSeconds: () => ms / TIME_CONSTANTS.SECOND_IN_MS,
    toMilliseconds: () => ms,
    build: (options: BuildOptions = {}) => {
      const { unit = 's' } = options;
      return convertToUnit(ms, unit);
    },
  };

  return builder;
}
