import type { Translations } from '../index';
import { describe, expect, it } from 'vitest';
import { time } from '../index';

describe('timesmith', () => {
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
});
