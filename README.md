# timesmith

[![npm version](https://badge.fury.io/js/timesmith.svg)](https://badge.fury.io/js/timesmith)
[![CI](https://github.com/hammeradam/timesmith/workflows/CI/badge.svg)](https://github.com/hammeradam/timesmith/actions)
[![codecov](https://codecov.io/gh/hammeradam/timesmith/branch/main/graph/badge.svg)](https://codecov.io/gh/hammeradam/timesmith)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fluent, type-safe API for time duration calculations in TypeScript with full ISO 8601 support.

## Features

- **Fluent API** - Chain time operations naturally
- **Component Extraction** - Get individual time parts (weeks, days, hours, etc.)
- **ISO 8601 Support** - Parse and format ISO 8601 duration strings
- **i18n Ready** - Full localization support with custom translations
- **Type-Safe** - Complete TypeScript support with strict typing
- **Lightweight** - Zero dependencies
- **Well Tested** - 98%+ test coverage

## Installation

```bash
pnpm add timesmith
```

Or using your preferred package manager:

```bash
npm install timesmith
yarn add timesmith
bun add timesmith
```

## Quick Start

```typescript
import { time } from 'timesmith';

// Basic usage - returns seconds by default
const duration = time()
  .day(1)
  .hour(2)
  .minute(30)
  .build(); // 94200 seconds

// Initialize with options
const duration2 = time({ h: 2, m: 30 }).build(); // 9000 seconds

// Alternative syntax using 'add' prefix
const duration3 = time()
  .addDays(1)
  .addHours(2)
  .addMinutes(30)
  .build(); // Same as duration
```

## Usage Examples

### Building Durations

```typescript
import { time } from 'timesmith';

// Initialize with time units
const duration1 = time({ d: 1, h: 2, m: 30 }).build(); // 94200 seconds

// Chain time units
const duration2 = time()
  .week(1)
  .day(2)
  .hour(3)
  .minute(45)
  .second(30)
  .build(); // Returns in seconds by default

// Combine initialization and chaining
const duration3 = time({ h: 2 })
  .minute(30)
  .build(); // 9000 seconds

// Convert to different units
const milliseconds = time()
  .hour(1)
  .build({ unit: 'ms' }); // 3600000

const minutes = time({ h: 2 }).build({ unit: 'm' }); // 120

const hours = time({ d: 1 }).build({ unit: 'h' }); // 24
```

### Unit Conversions

```typescript
// Direct conversion methods (returns total in that unit)
const weeks = time().day(14).toWeeks(); // 2
const days = time().hour(48).toDays(); // 2
const hours = time().minute(120).toHours(); // 2
const minutes = time().second(180).toMinutes(); // 3
const seconds = time().minute(2).toSeconds(); // 120
const ms = time().second(1).toMilliseconds(); // 1000
```

### Getting Individual Components

```typescript
// Extract individual time components (not totals)
const duration = time({ w: 2, d: 3, h: 5, m: 30, s: 45, ms: 500 });

duration.getWeeks(); // 2 (weeks component)
duration.getDays(); // 3 (days component, 0-6)
duration.getHours(); // 5 (hours component, 0-23)
duration.getMinutes(); // 30 (minutes component, 0-59)
duration.getSeconds(); // 45 (seconds component, 0-59)
duration.getMilliseconds(); // 500 (milliseconds component, 0-999)

// Difference between get* and to* methods
const mixed = time({ d: 10, h: 5 });
mixed.getDays(); // 3 (component: 10 days = 1 week + 3 days)
mixed.toDays(); // 10.208... (total days including hours)

// Useful for custom formatting
const d = time({ h: 26, m: 30 });
console.log(`${d.getDays()}d ${d.getHours()}h ${d.getMinutes()}m`); // "1d 2h 30m"

// Works with parsed durations
time().fromString('2w 3d 5h').getWeeks(); // 2
time().fromISO8601String('P1W2DT3H').getDays(); // 2
```

### Duration Arithmetic

```typescript
// Add durations together
const meeting = time().hour(1).minute(30);
const breakTime = time().minute(15);
const total = meeting.add(breakTime).build(); // 6300 seconds (1h 45m)

// Subtract durations
const deadline = time().day(7);
const elapsed = time().day(3).hour(6);
const remaining = deadline.subtract(elapsed).toString(); // "3 days, 18 hours"

// Chain multiple operations
const result = time()
  .hour(5)
  .add(time().minute(45))
  .subtract(time().minute(30))
  .toString(); // "5 hours, 15 minutes"

// Works with any duration format
const duration1 = time().fromString('2h 30m');
const duration2 = time().fromISO8601String('PT45M');
duration1.add(duration2).toString(); // "3 hours, 15 minutes"

// Subtract larger from smaller returns 0
const small = time().minute(30);
const large = time().hour(2);
small.subtract(large).build(); // 0
```

### Comparison Operators

```typescript
// Compare durations
const timeout = time().second(30);
const elapsed = time().second(45);

timeout.isLessThan(elapsed); // true
timeout.isLessThanOrEqual(time().second(30)); // true
elapsed.isGreaterThan(timeout); // true
elapsed.isGreaterThanOrEqual(time().second(45)); // true

// Check equality (works across different units)
time().hour(1).equals(time().minute(60)); // true
time().day(1).equals(time().hour(24)); // true

// Check if duration is within a range
const duration = time().hour(2);
duration.isBetween(time().hour(1), time().hour(3)); // true

// Combine with arithmetic
const limit = time().minute(30);
const used = time().minute(20);
const remaining = limit.subtract(used);

if (remaining.isLessThan(time().minute(5))) {
  console.log('Running low on time!');
}

// Works with any duration format
time().fromString('1h 30m').isGreaterThan(time().fromISO8601String('PT1H')); // true
```

### Cloning Durations

```typescript
// Create independent copies of durations
const original = time({ h: 2, m: 30 });
const copy = original.clone();

// Modifications to copy don't affect original
const modified = copy.hour(1); // Add another hour
console.log(original.build()); // 9000 (2h 30m)
console.log(modified.build()); // 12600 (3h 30m)

// Use clones for safe operations
const baseTimeout = time({ s: 30 });
const shortTimeout = baseTimeout.clone().subtract(time({ s: 10 }));
const longTimeout = baseTimeout.clone().add(time({ s: 10 }));

console.log(baseTimeout.build()); // 30 (unchanged)
console.log(shortTimeout.build()); // 20
console.log(longTimeout.build()); // 40

// Clone before modification to preserve original
function applyTimeMultiplier(duration: TimeBuilder, multiplier: number) {
  let result = duration.clone();
  for (let i = 1; i < multiplier; i++) {
    result = result.add(duration);
  }
  return result;
}

const oneHour = time({ h: 1 });
const threeHours = applyTimeMultiplier(oneHour, 3);
console.log(oneHour.build()); // 3600 (still 1 hour)
console.log(threeHours.build()); // 10800 (3 hours)
```

### String Formatting

```typescript
// Human-readable output (default: long format)
const readable = time()
  .day(1)
  .hour(2)
  .toString(); // "1 day, 2 hours"

// Short format
const short = time()
  .day(1)
  .hour(2)
  .toString({ format: 'short' }); // "1d, 2h"

// Custom separator
const custom = time()
  .hour(1)
  .minute(30)
  .toString({ separator: ' and ' }); // "1 hour and 30 minutes"
```

### ISO 8601 Duration Support

```typescript
// Parse ISO 8601 duration strings
const duration = time()
  .fromISO8601String('P1DT2H30M')
  .build(); // 94200 seconds

// Format as ISO 8601 (short format - omits zero values)
const iso = time()
  .day(1)
  .hour(2)
  .toISO8601String({ format: 'short' }); // "P1DT2H"

// Format as ISO 8601 (long format - includes all units)
const isoLong = time()
  .day(1)
  .hour(2)
  .toISO8601String({ format: 'long' }); // "P0Y0M0W1DT2H0M0S"

// Parse complex durations with years, months, weeks
const complex = time()
  .fromISO8601String('P1Y2M3W4DT5H6M7.5S')
  .build(); // Full ISO 8601 support including decimals
```

### String Parsing

```typescript
// Parse human-readable time strings
const fromString = time()
  .fromString('1d 2h 30m')
  .build(); // 94200 seconds

// Supports multiple formats
time().fromString('1day 2hours 30minutes').build();
time().fromString('1d 2h 30m').build();
time().fromString('1week 3days').build();

// Can be chained with other operations
const total = time()
  .fromString('1d 2h')
  .minute(30)
  .build(); // Add 30 minutes to parsed duration
```

### Localization (i18n)

```typescript
// Custom translations
const spanish = time()
  .hour(2)
  .minute(30)
  .toString({
    translations: {
      hour: {
        long: { singular: 'hora', plural: 'horas' },
        short: { singular: 'h', plural: 'h' }
      },
      minute: {
        long: { singular: 'minuto', plural: 'minutos' },
        short: { singular: 'm', plural: 'm' }
      }
    }
  }); // "2 horas, 30 minutos"

// Full translation object structure
const hungarianTranslations = {
  week: {
    long: { singular: 'hét', plural: 'hét' },
    short: { singular: 'h', plural: 'h' }
  },
  day: {
    long: { singular: 'nap', plural: 'nap' },
    short: { singular: 'nap', plural: 'nap' }
  },
  hour: {
    long: { singular: 'óra', plural: 'óra' },
    short: { singular: 'óra', plural: 'óra' }
  },
  minute: {
    long: { singular: 'perc', plural: 'perc' },
    short: { singular: 'perc', plural: 'perc' }
  },
  second: {
    long: { singular: 'másodperc', plural: 'másodperc' },
    short: { singular: 'mp', plural: 'mp' }
  },
  millisecond: {
    long: { singular: 'milliszekundum', plural: 'milliszekundum' },
    short: { singular: 'ms', plural: 'ms' }
  }
};

const hungarian = time()
  .hour(1)
  .minute(30)
  .toString({ translations: hungarianTranslations }); // "1 óra, 30 perc"
```

## API Reference

### `time(options?)`

Creates a new time builder instance.

**Options:**
- `w?: number` - Initial time in weeks (default: 0)
- `d?: number` - Initial time in days (default: 0)
- `h?: number` - Initial time in hours (default: 0)
- `m?: number` - Initial time in minutes (default: 0)
- `s?: number` - Initial time in seconds (default: 0)
- `ms?: number` - Initial time in milliseconds (default: 0)

All options can be combined to create complex initial durations.

**Returns:** `TimeBuilder`

**Examples:**
```typescript
// Initialize with a single unit
time({ h: 2 }).build(); // 7200 seconds

// Combine multiple units
time({ h: 1, m: 30, s: 45 }).build(); // 5445 seconds

// Chain after initialization
time({ d: 1 }).hour(6).build(); // 108000 seconds (1 day + 6 hours)

// Use with all time methods
time({ h: 2 }).add(time({ m: 30 })).toString(); // "2 hours, 30 minutes"
```

---

### Time Unit Methods

All methods accept an optional numeric parameter (default: 1) and return a `TimeBuilder` for chaining.

#### Short form
- `week(weeks?: number)` - Add weeks
- `day(days?: number)` - Add days
- `hour(hours?: number)` - Add hours
- `minute(minutes?: number)` - Add minutes
- `second(seconds?: number)` - Add seconds
- `millisecond(milliseconds?: number)` - Add milliseconds

#### Long form (aliases)
- `addWeeks(weeks?: number)` - Add weeks
- `addDays(days?: number)` - Add days
- `addHours(hours?: number)` - Add hours
- `addMinutes(minutes?: number)` - Add minutes
- `addSeconds(seconds?: number)` - Add seconds
- `addMilliseconds(milliseconds?: number)` - Add milliseconds

---

### Conversion Methods

Direct conversion to specific units without building.

- `toWeeks(): number` - Convert to weeks
- `toDays(): number` - Convert to days
- `toHours(): number` - Convert to hours
- `toMinutes(): number` - Convert to minutes
- `toSeconds(): number` - Convert to seconds
- `toMilliseconds(): number` - Convert to milliseconds

---

### Utility Methods

#### `clone(): TimeBuilder`

Creates an independent copy of the current duration.

**Returns:** `TimeBuilder` - A new time builder with the same duration

**Example:**
```typescript
const original = time({ h: 2, m: 30 });
const copy = original.clone();

// Modifications to copy don't affect original
const modified = copy.hour(1);
console.log(original.toHours()); // 2.5
console.log(modified.toHours()); // 3.5
```

**Use cases:**
- Preserving original values when performing calculations
- Creating variants of a base duration
- Safe function parameters that need modification

---

### Component Extraction Methods

Extract individual time components from a duration. These methods return the component value (not the total), respecting the range of each unit.

#### `getWeeks(): number`

Gets the weeks component of the duration.

**Returns:** `number` - The number of whole weeks (0-∞)

**Example:**
```typescript
time({ w: 2, d: 3 }).getWeeks(); // 2
time({ d: 14 }).getWeeks(); // 2 (14 days = 2 weeks)
time({ d: 10 }).getWeeks(); // 1 (10 days = 1 week + 3 days)
```

#### `getDays(): number`

Gets the days component of the duration (0-6, not total days).

**Returns:** `number` - The number of days after weeks are extracted (0-6)

**Example:**
```typescript
time({ w: 1, d: 3 }).getDays(); // 3
time({ d: 10 }).getDays(); // 3 (10 days = 1 week + 3 days)
time({ h: 48 }).getDays(); // 2 (48 hours = 2 days)
```

#### `getHours(): number`

Gets the hours component of the duration (0-23, not total hours).

**Returns:** `number` - The number of hours after days are extracted (0-23)

**Example:**
```typescript
time({ d: 1, h: 5 }).getHours(); // 5
time({ h: 26 }).getHours(); // 2 (26 hours = 1 day + 2 hours)
time({ m: 180 }).getHours(); // 3 (180 minutes = 3 hours)
```

#### `getMinutes(): number`

Gets the minutes component of the duration (0-59, not total minutes).

**Returns:** `number` - The number of minutes after hours are extracted (0-59)

**Example:**
```typescript
time({ h: 2, m: 30 }).getMinutes(); // 30
time({ m: 90 }).getMinutes(); // 30 (90 minutes = 1 hour + 30 minutes)
time({ s: 180 }).getMinutes(); // 3 (180 seconds = 3 minutes)
```

#### `getSeconds(): number`

Gets the seconds component of the duration (0-59, not total seconds).

**Returns:** `number` - The number of seconds after minutes are extracted (0-59)

**Example:**
```typescript
time({ m: 5, s: 45 }).getSeconds(); // 45
time({ s: 90 }).getSeconds(); // 30 (90 seconds = 1 minute + 30 seconds)
time({ ms: 5000 }).getSeconds(); // 5 (5000 ms = 5 seconds)
```

#### `getMilliseconds(): number`

Gets the milliseconds component of the duration (0-999, not total milliseconds).

**Returns:** `number` - The number of milliseconds after seconds are extracted (0-999)

**Example:**
```typescript
time({ s: 3, ms: 500 }).getMilliseconds(); // 500
time({ ms: 1500 }).getMilliseconds(); // 500 (1500 ms = 1 second + 500 ms)
time({ ms: 10500 }).getMilliseconds(); // 500 (10500 ms = 10 seconds + 500 ms)
```

**Common Use Cases:**
```typescript
// Custom time formatting
const duration = time({ h: 26, m: 30, s: 45 });
console.log(`${duration.getDays()}d ${duration.getHours()}h ${duration.getMinutes()}m ${duration.getSeconds()}s`);
// Output: "1d 2h 30m 45s"

// Building time display strings
const duration = time({ h: 50 });
const parts = [
  `${duration.getDays()} days`,
  `${duration.getHours()} hours`,
  `${duration.getMinutes()} minutes`
].filter(part => !part.startsWith('0')).join(', ');

// Difference from to* methods (component vs total)
const duration = time({ w: 2, d: 3 });
duration.getDays(); // 3 (component)
duration.toDays(); // 17 (total: 2 weeks + 3 days = 17 days)
```

---

### String Methods

#### `toString(options?): string`

Convert the duration to a human-readable string.

**Options:**
- `format?: 'long' | 'short'` - Output format (default: 'long')
  - `'long'`: "1 day, 2 hours"
  - `'short'`: "1d, 2h"
- `separator?: string` - Separator between units (default: ', ')
- `translations?: Translations` - Custom translation object

**Returns:** `string`

**Example:**
```typescript
time().day(1).hour(2).toString(); // "1 day, 2 hours"
time().day(1).hour(2).toString({ format: 'short' }); // "1d, 2h"
time().day(1).hour(2).toString({ separator: ' and ' }); // "1 day and 2 hours"
```

#### `fromString(timeString: string): TimeBuilder`

Parse a time string into a duration. Supports both short and long formats.

**Supported formats:**
- Short: `1w`, `2d`, `3h`, `4m`, `5s`, `100ms`
- Long: `1week`, `2days`, `3hours`, `4minutes`, `5seconds`, `100milliseconds`
- Plural: `2weeks`, `3days`, etc.

**Example:**
```typescript
time().fromString('1d 2h 30m').build(); // 94200 seconds
time().fromString('1day 2hours').build(); // Same result
```

**Throws:** Error if the string format is invalid

---

### ISO 8601 Methods

#### `toISO8601String(options?): string`

Convert the duration to an ISO 8601 duration string.

**Options:**
- `format?: 'short' | 'long'` - Output format (default: 'short')
  - `'short'`: Omits zero values (e.g., "P1DT2H")
  - `'long'`: Includes all units (e.g., "P0Y0M0W1DT2H0M0S")

**Returns:** `string` - ISO 8601 duration string

**Example:**
```typescript
time().day(1).hour(2).toISO8601String(); // "P1DT2H"
time().day(1).hour(2).toISO8601String({ format: 'long' }); // "P0Y0M0W1DT2H0M0S"
```

#### `fromISO8601String(timeString: string): TimeBuilder`

Parse an ISO 8601 duration string.

**Supported format:** `P[n]Y[n]M[n]W[n]DT[n]H[n]M[n]S`
- P = Period designator (required)
- Y = Years, M = Months, W = Weeks, D = Days
- T = Time designator (separates date and time components)
- H = Hours, M = Minutes, S = Seconds
- Supports decimal values (e.g., "PT1.5H" = 1.5 hours)

**Example:**
```typescript
time().fromISO8601String('P1DT2H30M').build(); // 94200 seconds
time().fromISO8601String('P1Y2M3W4D').build(); // Complex duration
time().fromISO8601String('PT0.5S').build(); // 0.5 seconds (decimals supported)
```

**Throws:** Error if the string is not a valid ISO 8601 duration

---

### Build Method

#### `build(options?): number`

Finalize the duration calculation and return as a number.

**Options:**
- `unit?: TimeUnit` - Output unit (default: 's')
  - `'w'` - weeks
  - `'d'` - days
  - `'h'` - hours
  - `'m'` - minutes
  - `'s'` - seconds (default)
  - `'ms'` - milliseconds

**Returns:** `number`

**Example:**
```typescript
time().day(1).build(); // 86400 (seconds)
time().day(1).build({ unit: 'ms' }); // 86400000 (milliseconds)
time().day(1).build({ unit: 'h' }); // 24 (hours)
```

---

### Arithmetic Methods

#### `add(duration): TimeBuilder`

Adds another duration to the current duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to add

**Returns:** `TimeBuilder` - A new time builder with the combined duration

**Example:**
```typescript
const meeting = time().hour(1).minute(30);
const breakTime = time().minute(15);
meeting.add(breakTime).toString(); // "1 hour, 45 minutes"

// Chainable
time()
  .hour(2)
  .add(time().minute(30))
  .add(time().second(45))
  .build(); // 9045 seconds
```

#### `subtract(duration): TimeBuilder`

Subtracts another duration from the current duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to subtract

**Returns:** `TimeBuilder` - A new time builder with the result (minimum 0)

**Example:**
```typescript
const total = time().hour(3);
const used = time().minute(45);
total.subtract(used).toString(); // "2 hours, 15 minutes"

// Returns 0 if result would be negative
time().hour(1).subtract(time().hour(2)).build(); // 0
```

---

### Comparison Methods

#### `isLessThan(duration): boolean`

Checks if the current duration is less than another duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to compare against

**Returns:** `boolean`

**Example:**
```typescript
time().hour(1).isLessThan(time().hour(2)); // true
time().minute(30).isLessThan(time().hour(1)); // true
```

#### `isLessThanOrEqual(duration): boolean`

Checks if the current duration is less than or equal to another duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to compare against

**Returns:** `boolean`

**Example:**
```typescript
time().hour(1).isLessThanOrEqual(time().hour(1)); // true
time().minute(60).isLessThanOrEqual(time().hour(1)); // true
```

#### `isGreaterThan(duration): boolean`

Checks if the current duration is greater than another duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to compare against

**Returns:** `boolean`

**Example:**
```typescript
time().hour(2).isGreaterThan(time().hour(1)); // true
time().day(1).isGreaterThan(time().hour(23)); // true
```

#### `isGreaterThanOrEqual(duration): boolean`

Checks if the current duration is greater than or equal to another duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to compare against

**Returns:** `boolean`

**Example:**
```typescript
time().hour(2).isGreaterThanOrEqual(time().hour(2)); // true
time().hour(1).isGreaterThanOrEqual(time().minute(60)); // true
```

#### `equals(duration): boolean`

Checks if the current duration equals another duration.

**Parameters:**
- `duration` - Any TimeBuilder instance to compare against

**Returns:** `boolean`

**Example:**
```typescript
time().hour(1).equals(time().minute(60)); // true
time().day(1).equals(time().hour(24)); // true
time().week(1).equals(time().day(7)); // true
```

#### `isBetween(min, max): boolean`

Checks if the current duration is between two other durations (inclusive).

**Parameters:**
- `min` - The minimum duration
- `max` - The maximum duration

**Returns:** `boolean`

**Example:**
```typescript
time().hour(2).isBetween(time().hour(1), time().hour(3)); // true
time().minute(90).isBetween(time().hour(1), time().hour(2)); // true
time().hour(4).isBetween(time().hour(1), time().hour(3)); // false
```

---

## Type Safety & Validation

### Input Validation

All methods validate inputs at runtime:

- **Throws on negative values**
  ```typescript
  time().hour(-1); // ❌ Throws Error: "Invalid hours value: -1. Must be non-negative."
  ```

- **Throws on non-finite values**
  ```typescript
  time().minute(Infinity); // ❌ Throws TypeError: "Invalid minutes value: Infinity. Must be finite."
  time().second(Number.NaN); // ❌ Throws TypeError: "Invalid seconds value: NaN. Must be finite."
  ```

- **Throws on invalid string formats**
  ```typescript
  time().fromString('invalid'); // ❌ Throws Error: "Invalid time string part: invalid"
  time().fromString('1x'); // ❌ Throws Error: "Invalid time string part: 1x"
  ```

- **Throws on invalid ISO 8601 strings**
  ```typescript
  time().fromISO8601String('1DT2H'); // ❌ Throws Error: "Must start with 'P'"
  ```

---

## Use Cases

### API Rate Limiting
```typescript
// Using initialization
const rateLimit = time({ h: 1 }).toMilliseconds(); // 3600000ms
setTimeout(resetLimit, rateLimit);

// Using chaining
const rateLimit2 = time().hour(1).toMilliseconds(); // 3600000ms
```

### Cache TTL
```typescript
const ttl = time({ d: 1, h: 12 }).toSeconds(); // 129600s
cache.set('key', value, ttl);
```

### Scheduling & Cron
```typescript
const interval = time({ m: 15 }).toMilliseconds(); // 900000ms
setInterval(checkUpdates, interval);
```

### Custom Time Formatting
```typescript
// Build custom time displays using component extraction
const uptime = time({ h: 73, m: 45, s: 30 });

// Format as "3d 1h 45m"
const formatted = [
  uptime.getDays() && `${uptime.getDays()}d`,
  uptime.getHours() && `${uptime.getHours()}h`,
  uptime.getMinutes() && `${uptime.getMinutes()}m`,
].filter(Boolean).join(' ');

// Or create detailed displays
const duration = time({ d: 5, h: 3, m: 30 });
console.log(`
  Weeks: ${duration.getWeeks()}
  Days: ${duration.getDays()}
  Hours: ${duration.getHours()}
  Minutes: ${duration.getMinutes()}
`);
```

### Duration Calculations
```typescript
// From string
const deadline = time()
  .fromString('2weeks 3days')
  .build({ unit: 'd' }); // 17 days

// From initialization
const deadline2 = time({ w: 2, d: 3 }).build({ unit: 'd' }); // 17 days
```

### ISO 8601 Integration
```typescript
// Parse ISO 8601 from API
const duration = time()
  .fromISO8601String(apiResponse.duration)
  .toString(); // Human-readable format

// Send ISO 8601 to API
const iso = time()
  .day(7)
  .toISO8601String(); // "P7D"
```

### Duration Arithmetic
```typescript
// Calculate total project time (using initialization)
const development = time({ d: 5, h: 3 });
const testing = time({ d: 2, h: 4 });
const deployment = time({ h: 8 });

const totalTime = development
  .add(testing)
  .add(deployment)
  .toString(); // "7 days, 15 hours"

// Calculate time remaining
const allocated = time({ w: 2 });
const spent = time({ d: 8, h: 6 });
const remaining = allocated.subtract(spent);
remaining.toString(); // "5 days, 18 hours"
```

### Cloning for Safe Calculations
```typescript
// Preserve base durations while creating variants
const baseDelay = time({ s: 5 });
const shortDelay = baseDelay.clone().subtract(time({ s: 2 }));
const longDelay = baseDelay.clone().add(time({ s: 5 }));

retry(task, { delay: shortDelay.toMilliseconds() }); // 3000ms
retry(task, { delay: baseDelay.toMilliseconds() }); // 5000ms (unchanged)
retry(task, { delay: longDelay.toMilliseconds() }); // 10000ms

// Safe function parameters
function calculateSLA(baseDuration: TimeBuilder, multiplier: number) {
  // Clone to avoid mutating the input
  let sla = baseDuration.clone();
  for (let i = 1; i < multiplier; i++) {
    sla = sla.add(baseDuration);
  }
  return sla;
}

const responseTime = time({ ms: 100 });
const slaTarget = calculateSLA(responseTime, 5); // 500ms
console.log(responseTime.toMilliseconds()); // 100 (original unchanged)
console.log(slaTarget.toMilliseconds()); // 500
```

### Duration Comparison & Validation
```typescript
// Validate timeouts (using initialization)
const requestTimeout = time({ s: 30 });
const maxTimeout = time({ m: 1 });

if (requestTimeout.isLessThanOrEqual(maxTimeout)) {
  // Safe to proceed
  fetch(url, { timeout: requestTimeout.toMilliseconds() });
}

// SLA monitoring
const responseTime = time({ ms: 250 });
const slaLimit = time({ ms: 500 });

if (responseTime.isLessThan(slaLimit)) {
  console.log('✓ Within SLA');
}

// Progress tracking
const elapsed = time({ m: 45 });
const estimated = time({ h: 1 });

const progress = (elapsed.toMilliseconds() / estimated.toMilliseconds()) * 100;
console.log(`Progress: ${progress}%`);

// Time window validation
const maintenanceWindow = time({ h: 2 });
const minWindow = time({ h: 1 });
const maxWindow = time({ h: 4 });

if (maintenanceWindow.isBetween(minWindow, maxWindow)) {
  console.log('Maintenance window is acceptable');
}
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT © [Adam Hammer](https://github.com/hammeradam)
