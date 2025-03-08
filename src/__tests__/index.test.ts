import { describe, expect, it } from 'vitest';
import { time } from '../index';

describe('timespan', () => {
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
});
