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
    });

    it('should throw on non-finite values', () => {
      expect(() => time().minute(Number.POSITIVE_INFINITY)).toThrow();
      expect(() => time().second(Number.NaN)).toThrow();
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
});
