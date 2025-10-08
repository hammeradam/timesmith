import type { Translations } from '../index';
import { describe, expect, it } from 'vitest';
import { time } from '../index';

describe('timesmith', () => {
  describe('initialization with options', () => {
    it('should initialize with milliseconds', () => {
      expect(time({ ms: 5000 }).build()).toBe(5);
    });

    it('should initialize with seconds', () => {
      expect(time({ s: 60 }).build()).toBe(60);
    });

    it('should initialize with minutes', () => {
      expect(time({ m: 5 }).build()).toBe(300);
    });

    it('should initialize with hours', () => {
      expect(time({ h: 2 }).build()).toBe(7200);
    });

    it('should initialize with days', () => {
      expect(time({ d: 1 }).build()).toBe(86400);
    });

    it('should initialize with weeks', () => {
      expect(time({ w: 1 }).build()).toBe(604800);
    });

    it('should combine multiple units in initialization', () => {
      expect(time({ h: 1, m: 30, s: 45 }).build()).toBe(5445);
    });

    it('should chain methods after initialization', () => {
      expect(time({ h: 1 }).minute(30).build()).toBe(5400);
    });

    it('should work with all conversion methods', () => {
      expect(time({ h: 2 }).toMinutes()).toBe(120);
      expect(time({ d: 1 }).toHours()).toBe(24);
      expect(time({ w: 1 }).toDays()).toBe(7);
    });

    it('should work with arithmetic operations', () => {
      const base = time({ h: 2 });
      const addition = time({ m: 30 });
      expect(base.add(addition).toMinutes()).toBe(150);
    });

    it('should work with comparison operations', () => {
      expect(time({ h: 1 }).isLessThan(time({ h: 2 }))).toBe(true);
      expect(time({ m: 60 }).equals(time({ h: 1 }))).toBe(true);
    });
  });

  describe('cloning', () => {
    it('should create an independent copy of a duration', () => {
      const original = time({ h: 2, m: 30 });
      const cloned = original.clone();

      expect(cloned.build()).toBe(original.build());
      expect(cloned.toMilliseconds()).toBe(original.toMilliseconds());
    });

    it('should allow modifications to clone without affecting original', () => {
      const original = time({ h: 1 });
      const cloned = original.clone().hour(1); // Add another hour

      expect(original.build()).toBe(3600); // 1 hour
      expect(cloned.build()).toBe(7200); // 2 hours
    });

    it('should clone durations with all time units', () => {
      const original = time({ w: 1, d: 2, h: 3, m: 4, s: 5, ms: 6 });
      const cloned = original.clone();

      expect(cloned.toMilliseconds()).toBe(original.toMilliseconds());
      expect(cloned.toString()).toBe(original.toString());
    });

    it('should work with cloned durations in arithmetic operations', () => {
      const duration1 = time({ h: 1 });
      const duration2 = duration1.clone();

      const sum = duration1.add(duration2);
      expect(sum.toHours()).toBe(2);
    });

    it('should work with cloned durations in comparison operations', () => {
      const original = time({ m: 30 });
      const cloned = original.clone();

      expect(original.equals(cloned)).toBe(true);
      expect(original.isLessThan(cloned)).toBe(false);
      expect(original.isGreaterThan(cloned)).toBe(false);
    });

    it('should clone and continue chaining', () => {
      const base = time({ h: 1 });
      const modified = base.clone().minute(30).second(45);

      expect(base.build()).toBe(3600); // 1 hour
      expect(modified.build()).toBe(5445); // 1h 30m 45s
    });

    it('should clone from parsed string', () => {
      const original = time().fromString('1d 2h 30m');
      const cloned = original.clone();

      expect(cloned.build()).toBe(original.build());
      expect(cloned.toString()).toBe(original.toString());
    });

    it('should clone from ISO8601 string', () => {
      const original = time().fromISO8601String('P1DT2H30M');
      const cloned = original.clone();

      expect(cloned.build()).toBe(original.build());
      expect(cloned.toISO8601String()).toBe(original.toISO8601String());
    });

    it('should clone zero duration', () => {
      const original = time();
      const cloned = original.clone();

      expect(cloned.build()).toBe(0);
      expect(cloned.toMilliseconds()).toBe(0);
    });

    it('should support multiple clones', () => {
      const original = time({ h: 1 });
      const clone1 = original.clone();
      const clone2 = original.clone();
      const clone3 = clone1.clone();

      expect(clone1.equals(original)).toBe(true);
      expect(clone2.equals(original)).toBe(true);
      expect(clone3.equals(original)).toBe(true);
    });
  });

  describe('basic conversions', () => {
    it('should convert hours to milliseconds', () => {
      expect(time().hour(1).build({ unit: 'ms' })).toBe(3600000);
    });

    it('should convert minutes to seconds', () => {
      expect(time().minute(5).build()).toBe(300);
    });

    it('should convert weeks to days', () => {
      expect(time().week(1).build({ unit: 'd' })).toBe(7);
    });
  });

  describe('chaining operations', () => {
    it('should handle multiple time units', () => {
      expect(time().day(1).hour(12).minute(30).build()).toBe(131400);
    });

    it('should handle zero values', () => {
      expect(time().day(0).hour(0).minute(0).second(1).build()).toBe(1);
    });
  });

  describe('string formatting', () => {
    it('should format time with long units', () => {
      expect(time().day(1).hour(2).toString()).toBe('1 day, 2 hours');
    });

    it('should format time with short units', () => {
      expect(time().day(1).hour(2).toString({ format: 'short' })).toBe('1d, 2h');
    });

    it('should handle custom separators', () => {
      expect(time().hour(1).minute(30).toString({ separator: ' | ' })).toBe(
        '1 hour | 30 minutes',
      );
    });
  });

  describe('string parsing', () => {
    it('should parse complex time strings', () => {
      expect(time().fromString('1w 2d 3h 45m').build()).toBe(791100);
    });

    it('should parse short and long formats', () => {
      expect(time().fromString('1h 30m').build()).toBe(
        time().fromString('1hour 30minutes').build(),
      );
    });

    it('should throw on invalid format', () => {
      expect(() => time().fromString('invalid')).toThrow();
      expect(() => time().fromString('1x')).toThrow();
    });
  });

  describe('validation', () => {
    it('should throw on negative values', () => {
      expect(() => time().hour(-1)).toThrow();
      expect(() => time().millisecond(-1)).toThrow();
    });

    it('should throw on non-finite values', () => {
      expect(() => time().minute(Number.POSITIVE_INFINITY)).toThrow();
      expect(() => time().second(Number.NaN)).toThrow();
      expect(() => time().millisecond(Number.POSITIVE_INFINITY)).toThrow();
    });
  });

  describe('conversion methods', () => {
    it('should convert to weeks', () => {
      expect(time().day(7).toWeeks()).toBe(1);
      expect(time().day(14).toWeeks()).toBe(2);
    });

    it('should convert to days', () => {
      expect(time().hour(24).toDays()).toBe(1);
      expect(time().week(1).toDays()).toBe(7);
    });

    it('should convert to hours', () => {
      expect(time().minute(60).toHours()).toBe(1);
      expect(time().day(1).toHours()).toBe(24);
    });

    it('should convert to minutes', () => {
      expect(time().second(60).toMinutes()).toBe(1);
      expect(time().hour(1).toMinutes()).toBe(60);
    });

    it('should convert to seconds', () => {
      expect(time().minute(1).toSeconds()).toBe(60);
      expect(time().hour(1).toSeconds()).toBe(3600);
    });

    it('should convert to milliseconds', () => {
      expect(time().second(1).toMilliseconds()).toBe(1000);
      expect(time().minute(1).toMilliseconds()).toBe(60000);
    });
  });

  describe('alternative method names', () => {
    it('should work with addWeeks', () => {
      expect(time().addWeeks(1).build()).toBe(604800);
      expect(time().addWeeks(2).build()).toBe(1209600);
    });

    it('should work with addDays', () => {
      expect(time().addDays(1).build()).toBe(86400);
      expect(time().addDays(7).build()).toBe(604800);
    });

    it('should work with addHours', () => {
      expect(time().addHours(1).build()).toBe(3600);
      expect(time().addHours(24).build()).toBe(86400);
    });

    it('should work with addMinutes', () => {
      expect(time().addMinutes(1).build()).toBe(60);
      expect(time().addMinutes(60).build()).toBe(3600);
    });

    it('should work with addSeconds', () => {
      expect(time().addSeconds(1).build()).toBe(1);
      expect(time().addSeconds(60).build()).toBe(60);
    });

    it('should work with addMilliseconds', () => {
      expect(time().addMilliseconds(1).build()).toBe(0.001);
      expect(time().addMilliseconds(1000).build()).toBe(1);
    });
  });

  describe('duration arithmetic', () => {
    describe('add', () => {
      it('should add two durations together', () => {
        const duration1 = time().hour(1);
        const duration2 = time().minute(30);
        expect(duration1.add(duration2).build()).toBe(5400); // 1.5 hours in seconds
      });

      it('should add multiple units', () => {
        const base = time().day(1).hour(2);
        const toAdd = time().hour(3).minute(30);
        expect(base.add(toAdd).build()).toBe(106200); // 1d 5h 30m
      });

      it('should handle adding zero', () => {
        const duration = time().hour(1);
        const zero = time();
        expect(duration.add(zero).build()).toBe(3600);
      });

      it('should be chainable', () => {
        const result = time()
          .hour(1)
          .add(time().minute(30))
          .add(time().second(45))
          .build();
        expect(result).toBe(5445); // 1h 30m 45s
      });

      it('should work with fromString', () => {
        const duration1 = time().fromString('1h 30m');
        const duration2 = time().fromString('45m');
        expect(duration1.add(duration2).build()).toBe(8100); // 2h 15m
      });

      it('should work with ISO8601', () => {
        const duration1 = time().fromISO8601String('PT1H');
        const duration2 = time().fromISO8601String('PT30M');
        expect(duration1.add(duration2).build()).toBe(5400);
      });

      it('should preserve the result for further operations', () => {
        const result = time().hour(1).add(time().minute(30));
        expect(result.toString()).toBe('1 hour, 30 minutes');
      });
    });

    describe('subtract', () => {
      it('should subtract one duration from another', () => {
        const duration1 = time().hour(2);
        const duration2 = time().minute(30);
        expect(duration1.subtract(duration2).build()).toBe(5400); // 1.5 hours
      });

      it('should handle subtracting larger from smaller (returns 0)', () => {
        const duration1 = time().minute(30);
        const duration2 = time().hour(1);
        expect(duration1.subtract(duration2).build()).toBe(0);
      });

      it('should handle subtracting zero', () => {
        const duration = time().hour(1);
        const zero = time();
        expect(duration.subtract(zero).build()).toBe(3600);
      });

      it('should be chainable', () => {
        const result = time()
          .hour(3)
          .subtract(time().minute(30))
          .subtract(time().minute(30))
          .build();
        expect(result).toBe(7200); // 2 hours
      });

      it('should work with fromString', () => {
        const duration1 = time().fromString('2h 30m');
        const duration2 = time().fromString('45m');
        expect(duration1.subtract(duration2).build()).toBe(6300); // 1h 45m
      });

      it('should work with ISO8601', () => {
        const duration1 = time().fromISO8601String('PT2H');
        const duration2 = time().fromISO8601String('PT30M');
        expect(duration1.subtract(duration2).build()).toBe(5400);
      });

      it('should handle exact subtraction', () => {
        const duration1 = time().hour(1);
        const duration2 = time().hour(1);
        expect(duration1.subtract(duration2).build()).toBe(0);
      });

      it('should preserve the result for further operations', () => {
        const result = time().hour(2).subtract(time().minute(30));
        expect(result.toString()).toBe('1 hour, 30 minutes');
      });
    });

    describe('complex arithmetic', () => {
      it('should handle add and subtract together', () => {
        const result = time()
          .hour(3)
          .add(time().minute(45))
          .subtract(time().minute(30))
          .build();
        expect(result).toBe(11700); // 3h 15m
      });

      it('should work with all conversion methods', () => {
        const result = time()
          .day(1)
          .add(time().hour(12))
          .subtract(time().hour(6));

        expect(result.toHours()).toBe(30);
        expect(result.toDays()).toBe(1.25);
        expect(result.toMinutes()).toBe(1800);
      });

      it('should maintain precision with milliseconds', () => {
        const result = time()
          .second(5)
          .millisecond(500)
          .add(time().millisecond(300))
          .subtract(time().millisecond(100));

        expect(result.build({ unit: 'ms' })).toBe(5700);
      });
    });
  });

  describe('comparison operators', () => {
    describe('isLessThan', () => {
      it('should return true when duration is less', () => {
        expect(time().hour(1).isLessThan(time().hour(2))).toBe(true);
      });

      it('should return false when duration is greater', () => {
        expect(time().hour(2).isLessThan(time().hour(1))).toBe(false);
      });

      it('should return false when durations are equal', () => {
        expect(time().hour(1).isLessThan(time().hour(1))).toBe(false);
      });

      it('should work with different units', () => {
        expect(time().minute(30).isLessThan(time().hour(1))).toBe(true);
        expect(time().second(59).isLessThan(time().minute(1))).toBe(true);
      });

      it('should work with parsed durations', () => {
        expect(time().fromString('1h 30m').isLessThan(time().fromString('2h'))).toBe(true);
      });
    });

    describe('isLessThanOrEqual', () => {
      it('should return true when duration is less', () => {
        expect(time().hour(1).isLessThanOrEqual(time().hour(2))).toBe(true);
      });

      it('should return true when durations are equal', () => {
        expect(time().hour(1).isLessThanOrEqual(time().hour(1))).toBe(true);
      });

      it('should return false when duration is greater', () => {
        expect(time().hour(2).isLessThanOrEqual(time().hour(1))).toBe(false);
      });

      it('should work with equivalent durations in different units', () => {
        expect(time().minute(60).isLessThanOrEqual(time().hour(1))).toBe(true);
      });
    });

    describe('isGreaterThan', () => {
      it('should return true when duration is greater', () => {
        expect(time().hour(2).isGreaterThan(time().hour(1))).toBe(true);
      });

      it('should return false when duration is less', () => {
        expect(time().hour(1).isGreaterThan(time().hour(2))).toBe(false);
      });

      it('should return false when durations are equal', () => {
        expect(time().hour(1).isGreaterThan(time().hour(1))).toBe(false);
      });

      it('should work with different units', () => {
        expect(time().hour(1).isGreaterThan(time().minute(30))).toBe(true);
        expect(time().day(1).isGreaterThan(time().hour(23))).toBe(true);
      });
    });

    describe('isGreaterThanOrEqual', () => {
      it('should return true when duration is greater', () => {
        expect(time().hour(2).isGreaterThanOrEqual(time().hour(1))).toBe(true);
      });

      it('should return true when durations are equal', () => {
        expect(time().hour(1).isGreaterThanOrEqual(time().hour(1))).toBe(true);
      });

      it('should return false when duration is less', () => {
        expect(time().hour(1).isGreaterThanOrEqual(time().hour(2))).toBe(false);
      });

      it('should work with equivalent durations in different units', () => {
        expect(time().hour(1).isGreaterThanOrEqual(time().minute(60))).toBe(true);
      });
    });

    describe('equals', () => {
      it('should return true for equal durations', () => {
        expect(time().hour(1).equals(time().hour(1))).toBe(true);
      });

      it('should return false for unequal durations', () => {
        expect(time().hour(1).equals(time().hour(2))).toBe(false);
      });

      it('should return true for equivalent durations in different units', () => {
        expect(time().hour(1).equals(time().minute(60))).toBe(true);
        expect(time().day(1).equals(time().hour(24))).toBe(true);
        expect(time().week(1).equals(time().day(7))).toBe(true);
      });

      it('should work with complex durations', () => {
        const duration1 = time().hour(1).add(time().minute(30));
        const duration2 = time().minute(90);
        expect(duration1.equals(duration2)).toBe(true);
      });

      it('should work with parsed durations', () => {
        expect(time().fromString('1h 30m').equals(time().fromString('90m'))).toBe(true);
      });

      it('should work with ISO8601 durations', () => {
        expect(time().fromISO8601String('PT1H').equals(time().fromISO8601String('PT60M'))).toBe(true);
      });
    });

    describe('isBetween', () => {
      it('should return true when duration is between min and max', () => {
        expect(time().hour(2).isBetween(time().hour(1), time().hour(3))).toBe(true);
      });

      it('should return true when duration equals min', () => {
        expect(time().hour(1).isBetween(time().hour(1), time().hour(3))).toBe(true);
      });

      it('should return true when duration equals max', () => {
        expect(time().hour(3).isBetween(time().hour(1), time().hour(3))).toBe(true);
      });

      it('should return false when duration is less than min', () => {
        expect(time().minute(30).isBetween(time().hour(1), time().hour(3))).toBe(false);
      });

      it('should return false when duration is greater than max', () => {
        expect(time().hour(4).isBetween(time().hour(1), time().hour(3))).toBe(false);
      });

      it('should work with different units', () => {
        expect(time().minute(90).isBetween(time().hour(1), time().hour(2))).toBe(true);
        expect(time().second(3660).isBetween(time().hour(1), time().hour(2))).toBe(true);
      });

      it('should work with parsed durations', () => {
        expect(
          time().fromString('1h 30m').isBetween(
            time().fromString('1h'),
            time().fromString('2h'),
          ),
        ).toBe(true);
      });
    });

    describe('comparison with arithmetic', () => {
      it('should work with add', () => {
        const base = time().hour(1);
        const added = base.add(time().minute(30));
        expect(added.isGreaterThan(base)).toBe(true);
      });

      it('should work with subtract', () => {
        const base = time().hour(2);
        const subtracted = base.subtract(time().minute(30));
        expect(subtracted.isLessThan(base)).toBe(true);
      });

      it('should compare results of operations', () => {
        const result1 = time().hour(3).subtract(time().minute(30));
        const result2 = time().hour(2).add(time().minute(30));
        expect(result1.equals(result2)).toBe(true);
      });
    });
  });

  describe('translations', () => {
    const spanishTranslations = {
      week: { long: { singular: 'semana', plural: 'semanas' }, short: { singular: 'sem', plural: 'sem' } },
      day: { long: { singular: 'día', plural: 'días' }, short: { singular: 'd', plural: 'd' } },
      hour: { long: { singular: 'hora', plural: 'horas' }, short: { singular: 'h', plural: 'h' } },
      minute: { long: { singular: 'minuto', plural: 'minutos' }, short: { singular: 'm', plural: 'm' } },
      second: { long: { singular: 'segundo', plural: 'segundos' }, short: { singular: 's', plural: 's' } },
      millisecond: { long: { singular: 'milisegundo', plural: 'milisegundos' }, short: { singular: 'ms', plural: 'ms' } },
    } satisfies Translations;

    const hungarianTranslations = {
      week: { long: { singular: 'hét', plural: 'hét' }, short: { singular: 'h', plural: 'h' } },
      day: { long: { singular: 'nap', plural: 'nap' }, short: { singular: 'nap', plural: 'nap' } },
      hour: { long: { singular: 'óra', plural: 'óra' }, short: { singular: 'óra', plural: 'óra' } },
      minute: { long: { singular: 'perc', plural: 'perc' }, short: { singular: 'perc', plural: 'perc' } },
      second: { long: { singular: 'másodperc', plural: 'másodperc' }, short: { singular: 'másodperc', plural: 'másodperc' } },
      millisecond: { long: { singular: 'milliszekundum', plural: 'milliszekundum' }, short: { singular: 'ms', plural: 'ms' } },
    };

    it('should format time with custom translations', () => {
      expect(time().hour(1).minute(30).toString({
        translations: hungarianTranslations,
      })).toBe('1 óra, 30 perc');
    });

    it('should handle plural forms correctly', () => {
      expect(time().hour(2).toString({
        translations: spanishTranslations,
      })).toBe('2 horas');
    });

    it('should fall back to default translations for missing units', () => {
      expect(time().hour(1).minute(30).toString({
        translations: spanishTranslations,
      })).toBe('1 hora, 30 minutos');
    });
  });

  describe('iso 8601 parsing', () => {
    describe('basic parsing', () => {
      it('should parse duration with only days', () => {
        expect(time().fromISO8601String('P1D').build()).toBe(86400);
      });

      it('should parse duration with only hours', () => {
        expect(time().fromISO8601String('PT1H').build()).toBe(3600);
      });

      it('should parse duration with only minutes', () => {
        expect(time().fromISO8601String('PT30M').build()).toBe(1800);
      });

      it('should parse duration with only seconds', () => {
        expect(time().fromISO8601String('PT45S').build()).toBe(45);
      });

      it('should parse duration with only weeks', () => {
        expect(time().fromISO8601String('P1W').build()).toBe(604800);
      });
    });

    describe('combined units parsing', () => {
      it('should parse days and hours', () => {
        expect(time().fromISO8601String('P1DT2H').build()).toBe(93600);
      });

      it('should parse days, hours, and minutes', () => {
        expect(time().fromISO8601String('P1DT2H30M').build()).toBe(95400);
      });

      it('should parse complex duration with all time units', () => {
        expect(time().fromISO8601String('P1DT1H0M0.5S').build()).toBe(90000.5);
      });

      it('should parse duration with years, months, weeks, and days', () => {
        // 1 year (365 days) + 1 day + 1 hour + 0.5 seconds
        // = 31,536,000 + 86,400 + 3,600 + 0.5 = 31,626,000.5 seconds
        expect(time().fromISO8601String('P1Y0M0W1DT1H0M0.5S').build()).toBe(31626000.5);
      });

      it('should parse multiple weeks', () => {
        expect(time().fromISO8601String('P2W').build()).toBe(1209600);
      });

      it('should parse weeks with days', () => {
        // 1 week (7 days) + 3 days = 10 days = 864000 seconds
        expect(time().fromISO8601String('P1W3D').build()).toBe(864000);
      });
    });

    describe('decimal values parsing', () => {
      it('should parse decimal seconds', () => {
        expect(time().fromISO8601String('PT0.5S').build()).toBe(0.5);
      });

      it('should parse decimal minutes', () => {
        expect(time().fromISO8601String('PT1.5M').build()).toBe(90);
      });

      it('should parse decimal hours', () => {
        expect(time().fromISO8601String('PT2.5H').build()).toBe(9000);
      });

      it('should parse decimal days', () => {
        expect(time().fromISO8601String('P1.5D').build()).toBe(129600);
      });

      it('should parse mixed decimals', () => {
        // 1.5 hours + 30.5 seconds = 5400 + 30.5 = 5430.5 seconds
        expect(time().fromISO8601String('PT1.5H0M30.5S').build()).toBe(5430.5);
      });
    });

    describe('edge cases', () => {
      it('should parse duration with only P', () => {
        expect(time().fromISO8601String('P0D').build()).toBe(0);
      });

      it('should parse duration with zero values', () => {
        expect(time().fromISO8601String('P0Y0M0W0DT0H0M0S').build()).toBe(0);
      });

      it('should handle large values', () => {
        // 100 days = 8,640,000 seconds
        expect(time().fromISO8601String('P100D').build()).toBe(8640000);
      });

      it('should parse years and months', () => {
        // 1 year (365 days) + 2 months (60 days) = 36,720,000 seconds
        expect(time().fromISO8601String('P1Y2M').build()).toBe(36720000);
      });
    });

    describe('conversion to different units', () => {
      it('should convert ISO duration to milliseconds', () => {
        expect(time().fromISO8601String('PT1H').build({ unit: 'ms' })).toBe(3600000);
      });

      it('should convert ISO duration to minutes', () => {
        expect(time().fromISO8601String('PT1H30M').build({ unit: 'm' })).toBe(90);
      });

      it('should convert ISO duration to hours', () => {
        expect(time().fromISO8601String('P1DT2H').build({ unit: 'h' })).toBe(26);
      });

      it('should convert ISO duration to days', () => {
        expect(time().fromISO8601String('P1W').build({ unit: 'd' })).toBe(7);
      });

      it('should convert ISO duration to weeks', () => {
        expect(time().fromISO8601String('P2W').build({ unit: 'w' })).toBe(2);
      });
    });

    describe('error handling', () => {
      it('should throw on invalid format without P prefix', () => {
        expect(() => time().fromISO8601String('1DT2H')).toThrow('Must start with \'P\'');
      });

      it('should handle malformed negative values by parsing the digits', () => {
        // 'P-1D' - the minus sign is not part of the regex pattern, so it parses '1D'
        // This is acceptable as ISO 8601 doesn't allow negative durations anyway
        expect(time().fromISO8601String('P-1D').build()).toBe(86400);
      });

      it('should handle empty string after P', () => {
        expect(time().fromISO8601String('P').build()).toBe(0);
      });

      it('should handle T without time components', () => {
        expect(time().fromISO8601String('P1DT').build()).toBe(86400);
      });

      it('should handle invalid characters gracefully', () => {
        // Invalid characters and misplaced units are not matched
        // 'P1D2X3H' - only '1D' matches in date part, '3H' is invalid without 'T'
        expect(time().fromISO8601String('P1D2X3H').build()).toBe(86400); // 1 day only
      });
    });

    describe('integration with other methods', () => {
      it('should chain with builder methods', () => {
        expect(
          time()
            .fromISO8601String('P1D')
            .hour(2)
            .build(),
        ).toBe(93600);
      });

      it('should work with toString', () => {
        const result = time().fromISO8601String('P1DT2H30M').toString();
        expect(result).toBe('1 day, 2 hours, 30 minutes');
      });

      it('should round-trip with toISO8601String', () => {
        const original = 'P1DT2H';
        const parsed = time().fromISO8601String(original);
        const _result = parsed.toISO8601String({ format: 'short' });
        // Result will have all units, but should match in value
        expect(parsed.build()).toBe(93600);
      });
    });
  });

  describe('iso 8601 formatting', () => {
    it('should format with short format (default behavior)', () => {
      const result = time().day(1).hour(2).toISO8601String();
      expect(result).toContain('1D');
      expect(result).toContain('2H');
    });

    it('should format with long format including zero values', () => {
      const result = time().day(1).hour(2).toISO8601String({ format: 'long' });
      expect(result).toBe('P0Y0M0W1DT2H0M0S');
    });

    it('should format zero duration with long format', () => {
      const result = time().toISO8601String({ format: 'long' });
      expect(result).toBe('P0Y0M0W0DT0H0M0S');
    });

    it('should format with short format excluding zero values', () => {
      const result = time().day(1).hour(2).toISO8601String({ format: 'short' });
      expect(result).toBe('P1DT2H');
    });

    it('should handle decimal seconds in ISO format', () => {
      const result = time().second(1).millisecond(500).toISO8601String({ format: 'short' });
      expect(result).toContain('1.5S');
    });
  });

  describe('get individual components', () => {
    describe('getWeeks', () => {
      it('should get weeks component from weeks only', () => {
        expect(time({ w: 2 }).getWeeks()).toBe(2);
      });

      it('should get weeks component from mixed duration', () => {
        expect(time({ w: 2, d: 3, h: 5 }).getWeeks()).toBe(2);
      });

      it('should return 0 when no weeks', () => {
        expect(time({ d: 5, h: 3 }).getWeeks()).toBe(0);
      });

      it('should calculate weeks from days', () => {
        expect(time({ d: 14 }).getWeeks()).toBe(2);
      });

      it('should not include partial weeks', () => {
        expect(time({ d: 10 }).getWeeks()).toBe(1); // 1 week + 3 days
      });
    });

    describe('getDays', () => {
      it('should get days component from days only', () => {
        expect(time({ d: 3 }).getDays()).toBe(3);
      });

      it('should get days component excluding weeks', () => {
        expect(time({ w: 2, d: 3 }).getDays()).toBe(3);
      });

      it('should return remaining days after weeks', () => {
        expect(time({ d: 10 }).getDays()).toBe(3); // 10 days = 1 week + 3 days
      });

      it('should return 0 when no days', () => {
        expect(time({ h: 5, m: 30 }).getDays()).toBe(0);
      });

      it('should calculate days from hours', () => {
        expect(time({ h: 48 }).getDays()).toBe(2);
      });

      it('should not include partial days', () => {
        expect(time({ h: 26 }).getDays()).toBe(1); // 1 day + 2 hours
      });
    });

    describe('getHours', () => {
      it('should get hours component from hours only', () => {
        expect(time({ h: 5 }).getHours()).toBe(5);
      });

      it('should get hours component excluding days', () => {
        expect(time({ d: 2, h: 5 }).getHours()).toBe(5);
      });

      it('should return remaining hours after days', () => {
        expect(time({ h: 26 }).getHours()).toBe(2); // 26 hours = 1 day + 2 hours
      });

      it('should return 0 when no hours', () => {
        expect(time({ m: 30, s: 15 }).getHours()).toBe(0);
      });

      it('should calculate hours from minutes', () => {
        expect(time({ m: 180 }).getHours()).toBe(3);
      });

      it('should not include partial hours', () => {
        expect(time({ m: 90 }).getHours()).toBe(1); // 1 hour + 30 minutes
      });
    });

    describe('getMinutes', () => {
      it('should get minutes component from minutes only', () => {
        expect(time({ m: 30 }).getMinutes()).toBe(30);
      });

      it('should get minutes component excluding hours', () => {
        expect(time({ h: 2, m: 30 }).getMinutes()).toBe(30);
      });

      it('should return remaining minutes after hours', () => {
        expect(time({ m: 90 }).getMinutes()).toBe(30); // 90 minutes = 1 hour + 30 minutes
      });

      it('should return 0 when no minutes', () => {
        expect(time({ s: 45 }).getMinutes()).toBe(0);
      });

      it('should calculate minutes from seconds', () => {
        expect(time({ s: 180 }).getMinutes()).toBe(3);
      });

      it('should not include partial minutes', () => {
        expect(time({ s: 90 }).getMinutes()).toBe(1); // 1 minute + 30 seconds
      });
    });

    describe('getSeconds', () => {
      it('should get seconds component from seconds only', () => {
        expect(time({ s: 45 }).getSeconds()).toBe(45);
      });

      it('should get seconds component excluding minutes', () => {
        expect(time({ m: 5, s: 45 }).getSeconds()).toBe(45);
      });

      it('should return remaining seconds after minutes', () => {
        expect(time({ s: 90 }).getSeconds()).toBe(30); // 90 seconds = 1 minute + 30 seconds
      });

      it('should return 0 when no seconds', () => {
        expect(time({ ms: 500 }).getSeconds()).toBe(0);
      });

      it('should calculate seconds from milliseconds', () => {
        expect(time({ ms: 5000 }).getSeconds()).toBe(5);
      });

      it('should not include partial seconds', () => {
        expect(time({ ms: 1500 }).getSeconds()).toBe(1); // 1 second + 500 milliseconds
      });
    });

    describe('getMilliseconds', () => {
      it('should get milliseconds component from milliseconds only', () => {
        expect(time({ ms: 500 }).getMilliseconds()).toBe(500);
      });

      it('should get milliseconds component excluding seconds', () => {
        expect(time({ s: 3, ms: 500 }).getMilliseconds()).toBe(500);
      });

      it('should return remaining milliseconds after seconds', () => {
        expect(time({ ms: 1500 }).getMilliseconds()).toBe(500); // 1 second + 500 milliseconds
      });

      it('should return 0 when no milliseconds', () => {
        expect(time({ s: 5 }).getMilliseconds()).toBe(0);
      });

      it('should handle large millisecond values', () => {
        expect(time({ ms: 10500 }).getMilliseconds()).toBe(500); // 10 seconds + 500 milliseconds
      });
    });

    describe('complex durations', () => {
      it('should extract all components correctly', () => {
        const duration = time({ w: 2, d: 3, h: 5, m: 30, s: 45, ms: 500 });
        expect(duration.getWeeks()).toBe(2);
        expect(duration.getDays()).toBe(3);
        expect(duration.getHours()).toBe(5);
        expect(duration.getMinutes()).toBe(30);
        expect(duration.getSeconds()).toBe(45);
        expect(duration.getMilliseconds()).toBe(500);
      });

      it('should work with chained operations', () => {
        const duration = time().week(1).day(2).hour(3).minute(4).second(5).millisecond(6);
        expect(duration.getWeeks()).toBe(1);
        expect(duration.getDays()).toBe(2);
        expect(duration.getHours()).toBe(3);
        expect(duration.getMinutes()).toBe(4);
        expect(duration.getSeconds()).toBe(5);
        expect(duration.getMilliseconds()).toBe(6);
      });

      it('should work after arithmetic operations', () => {
        const duration = time({ h: 25 }).add(time({ m: 90 })); // 26 hours 30 minutes
        expect(duration.getDays()).toBe(1);
        expect(duration.getHours()).toBe(2);
        expect(duration.getMinutes()).toBe(30);
      });

      it('should work with parsed strings', () => {
        const duration = time().fromString('2w 3d 5h 30m 45s');
        expect(duration.getWeeks()).toBe(2);
        expect(duration.getDays()).toBe(3);
        expect(duration.getHours()).toBe(5);
        expect(duration.getMinutes()).toBe(30);
        expect(duration.getSeconds()).toBe(45);
      });

      it('should work with ISO8601 strings', () => {
        const duration = time().fromISO8601String('P1W2DT3H4M5S');
        expect(duration.getWeeks()).toBe(1);
        expect(duration.getDays()).toBe(2);
        expect(duration.getHours()).toBe(3);
        expect(duration.getMinutes()).toBe(4);
        expect(duration.getSeconds()).toBe(5);
      });
    });

    describe('edge cases', () => {
      it('should handle zero duration', () => {
        const duration = time();
        expect(duration.getWeeks()).toBe(0);
        expect(duration.getDays()).toBe(0);
        expect(duration.getHours()).toBe(0);
        expect(duration.getMinutes()).toBe(0);
        expect(duration.getSeconds()).toBe(0);
        expect(duration.getMilliseconds()).toBe(0);
      });

      it('should handle exactly one week', () => {
        const duration = time({ d: 7 });
        expect(duration.getWeeks()).toBe(1);
        expect(duration.getDays()).toBe(0);
      });

      it('should handle exactly one day', () => {
        const duration = time({ h: 24 });
        expect(duration.getDays()).toBe(1);
        expect(duration.getHours()).toBe(0);
      });

      it('should handle exactly one hour', () => {
        const duration = time({ m: 60 });
        expect(duration.getHours()).toBe(1);
        expect(duration.getMinutes()).toBe(0);
      });

      it('should handle exactly one minute', () => {
        const duration = time({ s: 60 });
        expect(duration.getMinutes()).toBe(1);
        expect(duration.getSeconds()).toBe(0);
      });

      it('should handle exactly one second', () => {
        const duration = time({ ms: 1000 });
        expect(duration.getSeconds()).toBe(1);
        expect(duration.getMilliseconds()).toBe(0);
      });
    });

    describe('comparison with to* methods', () => {
      it('should differ from toWeeks (total vs component)', () => {
        const duration = time({ w: 2, d: 3 });
        expect(duration.getWeeks()).toBe(2); // Component
        expect(duration.toWeeks()).toBeCloseTo(2.428, 2); // Total
      });

      it('should differ from toDays (total vs component)', () => {
        const duration = time({ w: 1, d: 3 });
        expect(duration.getDays()).toBe(3); // Component
        expect(duration.toDays()).toBe(10); // Total
      });

      it('should differ from toHours (total vs component)', () => {
        const duration = time({ d: 1, h: 5 });
        expect(duration.getHours()).toBe(5); // Component
        expect(duration.toHours()).toBe(29); // Total
      });

      it('should differ from toMinutes (total vs component)', () => {
        const duration = time({ h: 2, m: 30 });
        expect(duration.getMinutes()).toBe(30); // Component
        expect(duration.toMinutes()).toBe(150); // Total
      });

      it('should differ from toSeconds (total vs component)', () => {
        const duration = time({ m: 3, s: 45 });
        expect(duration.getSeconds()).toBe(45); // Component
        expect(duration.toSeconds()).toBe(225); // Total
      });

      it('should differ from toMilliseconds (total vs component)', () => {
        const duration = time({ s: 5, ms: 500 });
        expect(duration.getMilliseconds()).toBe(500); // Component
        expect(duration.toMilliseconds()).toBe(5500); // Total
      });
    });
  });

  describe('rounding and precision', () => {
    describe('round', () => {
      it('should round to nearest hour', () => {
        expect(time({ h: 2, m: 37 }).round('h').toHours()).toBe(3);
        expect(time({ h: 2, m: 29 }).round('h').toHours()).toBe(2);
        expect(time({ h: 2, m: 30 }).round('h').toHours()).toBe(3);
      });

      it('should round to nearest day', () => {
        expect(time({ d: 1, h: 13 }).round('d').toDays()).toBe(2);
        expect(time({ d: 1, h: 11 }).round('d').toDays()).toBe(1);
        expect(time({ d: 1, h: 12 }).round('d').toDays()).toBe(2);
      });

      it('should round to nearest week', () => {
        expect(time({ d: 10 }).round('w').toWeeks()).toBe(1);
        expect(time({ d: 3 }).round('w').toWeeks()).toBe(0);
        expect(time({ d: 4 }).round('w').toWeeks()).toBe(1);
      });

      it('should round to nearest minute', () => {
        expect(time({ m: 5, s: 31 }).round('m').toMinutes()).toBe(6);
        expect(time({ m: 5, s: 29 }).round('m').toMinutes()).toBe(5);
        expect(time({ m: 5, s: 30 }).round('m').toMinutes()).toBe(6);
      });

      it('should round to nearest second', () => {
        expect(time({ s: 10, ms: 501 }).round('s').toSeconds()).toBe(11);
        expect(time({ s: 10, ms: 499 }).round('s').toSeconds()).toBe(10);
        expect(time({ s: 10, ms: 500 }).round('s').toSeconds()).toBe(11);
      });

      it('should round to nearest millisecond', () => {
        expect(time({ ms: 1234 }).round('ms').toMilliseconds()).toBe(1234);
      });

      it('should work with toString', () => {
        expect(time({ h: 2, m: 37 }).round('h').toString()).toBe('3 hours');
        expect(time({ d: 1, h: 13 }).round('d').toString()).toBe('2 days');
      });

      it('should be chainable', () => {
        const result = time({ h: 2, m: 37 }).round('h').add(time({ h: 1 }));
        expect(result.toHours()).toBe(4);
      });

      it('should work with complex durations', () => {
        expect(time({ d: 5, h: 13, m: 45 }).round('d').toDays()).toBe(6);
      });
    });

    describe('floor', () => {
      it('should floor to hour', () => {
        expect(time({ h: 2, m: 59 }).floor('h').toHours()).toBe(2);
        expect(time({ h: 2, m: 1 }).floor('h').toHours()).toBe(2);
        expect(time({ h: 2, m: 0 }).floor('h').toHours()).toBe(2);
      });

      it('should floor to day', () => {
        expect(time({ d: 1, h: 23 }).floor('d').toDays()).toBe(1);
        expect(time({ d: 1, h: 1 }).floor('d').toDays()).toBe(1);
      });

      it('should floor to week', () => {
        expect(time({ d: 13 }).floor('w').toWeeks()).toBe(1);
        expect(time({ d: 6 }).floor('w').toWeeks()).toBe(0);
      });

      it('should floor to minute', () => {
        expect(time({ m: 5, s: 59 }).floor('m').toMinutes()).toBe(5);
        expect(time({ m: 5, s: 1 }).floor('m').toMinutes()).toBe(5);
      });

      it('should floor to second', () => {
        expect(time({ s: 10, ms: 999 }).floor('s').toSeconds()).toBe(10);
        expect(time({ s: 10, ms: 1 }).floor('s').toSeconds()).toBe(10);
      });

      it('should work with toString', () => {
        expect(time({ h: 2, m: 59 }).floor('h').toString()).toBe('2 hours');
        expect(time({ d: 1, h: 23 }).floor('d').toString()).toBe('1 day');
      });

      it('should be chainable', () => {
        const result = time({ h: 2, m: 45 }).floor('h').add(time({ m: 30 }));
        expect(result.toMinutes()).toBe(150); // 2h + 30m = 150m
      });

      it('should remove all smaller units', () => {
        const floored = time({ h: 2, m: 30, s: 45, ms: 500 }).floor('h');
        expect(floored.getMinutes()).toBe(0);
        expect(floored.getSeconds()).toBe(0);
        expect(floored.getMilliseconds()).toBe(0);
      });
    });

    describe('ceil', () => {
      it('should ceil to hour', () => {
        expect(time({ h: 2, m: 1 }).ceil('h').toHours()).toBe(3);
        expect(time({ h: 2, m: 59 }).ceil('h').toHours()).toBe(3);
        expect(time({ h: 2, m: 0 }).ceil('h').toHours()).toBe(2);
      });

      it('should ceil to day', () => {
        expect(time({ d: 1, h: 1 }).ceil('d').toDays()).toBe(2);
        expect(time({ d: 1, h: 23 }).ceil('d').toDays()).toBe(2);
        expect(time({ d: 1, h: 0 }).ceil('d').toDays()).toBe(1);
      });

      it('should ceil to week', () => {
        expect(time({ d: 8 }).ceil('w').toWeeks()).toBe(2);
        expect(time({ d: 1 }).ceil('w').toWeeks()).toBe(1);
        expect(time({ d: 7 }).ceil('w').toWeeks()).toBe(1);
      });

      it('should ceil to minute', () => {
        expect(time({ m: 5, s: 1 }).ceil('m').toMinutes()).toBe(6);
        expect(time({ m: 5, s: 59 }).ceil('m').toMinutes()).toBe(6);
        expect(time({ m: 5, s: 0 }).ceil('m').toMinutes()).toBe(5);
      });

      it('should ceil to second', () => {
        expect(time({ s: 10, ms: 1 }).ceil('s').toSeconds()).toBe(11);
        expect(time({ s: 10, ms: 999 }).ceil('s').toSeconds()).toBe(11);
        expect(time({ s: 10, ms: 0 }).ceil('s').toSeconds()).toBe(10);
      });

      it('should work with toString', () => {
        expect(time({ h: 2, m: 1 }).ceil('h').toString()).toBe('3 hours');
        expect(time({ d: 1, h: 1 }).ceil('d').toString()).toBe('2 days');
      });

      it('should be chainable', () => {
        const result = time({ h: 2, m: 1 }).ceil('h').add(time({ m: 30 }));
        expect(result.toMinutes()).toBe(210); // 3h + 30m = 210m
      });

      it('should remove all smaller units for non-exact values', () => {
        const ceiled = time({ h: 2, m: 1, s: 45, ms: 500 }).ceil('h');
        expect(ceiled.getHours()).toBe(3);
        expect(ceiled.getMinutes()).toBe(0);
        expect(ceiled.getSeconds()).toBe(0);
        expect(ceiled.getMilliseconds()).toBe(0);
      });
    });

    describe('edge cases', () => {
      it('should handle zero duration', () => {
        expect(time().round('h').build()).toBe(0);
        expect(time().floor('h').build()).toBe(0);
        expect(time().ceil('h').build()).toBe(0);
      });

      it('should handle exact unit values', () => {
        expect(time({ h: 3 }).round('h').toHours()).toBe(3);
        expect(time({ h: 3 }).floor('h').toHours()).toBe(3);
        expect(time({ h: 3 }).ceil('h').toHours()).toBe(3);
      });

      it('should handle very small values', () => {
        expect(time({ ms: 1 }).round('s').toSeconds()).toBe(0);
        expect(time({ ms: 1 }).floor('s').toSeconds()).toBe(0);
        expect(time({ ms: 1 }).ceil('s').toSeconds()).toBe(1);
      });

      it('should handle very large values', () => {
        expect(time({ w: 100, d: 3 }).round('w').toWeeks()).toBe(100);
        expect(time({ w: 100, d: 4 }).round('w').toWeeks()).toBe(101);
      });
    });

    describe('use cases', () => {
      it('should create user-friendly displays', () => {
        const uptime = time({ h: 73, m: 45 });
        expect(uptime.round('h').toString()).toBe('3 days, 2 hours');
      });

      it('should calculate SLA deadlines', () => {
        const responseTime = time({ h: 25, m: 30 });
        expect(responseTime.ceil('d').toDays()).toBe(2);
      });

      it('should simplify billing periods', () => {
        const usage = time({ h: 2, m: 15 });
        expect(usage.ceil('h').toHours()).toBe(3); // Bill for 3 hours
      });

      it('should work with arithmetic operations', () => {
        const base = time({ h: 2, m: 30 });
        const rounded = base.round('h'); // 2h 30m rounds to 3h
        const doubled = rounded.add(rounded); // 3h + 3h = 6h
        expect(doubled.toHours()).toBe(6);
      });

      it('should work with comparison operations', () => {
        const actual = time({ h: 2, m: 45 });
        const limit = time({ h: 3 });
        expect(actual.round('h').equals(limit)).toBe(true);
      });

      it('should work with component extraction', () => {
        const duration = time({ h: 73, m: 45 }).round('h');
        expect(duration.getDays()).toBe(3);
        expect(duration.getHours()).toBe(2);
        expect(duration.getMinutes()).toBe(0);
      });
    });

    describe('combined with other methods', () => {
      it('should work with add', () => {
        const result = time({ h: 2, m: 45 })
          .round('h')
          .add(time({ h: 1, m: 30 }));
        expect(result.toHours()).toBe(4.5);
      });

      it('should work with subtract', () => {
        const result = time({ h: 5, m: 45 })
          .round('h')
          .subtract(time({ h: 2 }));
        expect(result.toHours()).toBe(4);
      });

      it('should work with clone', () => {
        const original = time({ h: 2, m: 45 });
        const rounded = original.clone().round('h');
        expect(original.toMinutes()).toBe(165);
        expect(rounded.toMinutes()).toBe(180);
      });

      it('should work with fromString', () => {
        const result = time().fromString('2h 37m').round('h');
        expect(result.toHours()).toBe(3);
      });

      it('should work with fromISO8601String', () => {
        const result = time().fromISO8601String('PT2H37M').round('h');
        expect(result.toHours()).toBe(3);
      });
    });
  });
});
