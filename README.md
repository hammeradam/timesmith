# timesmith

[![npm version](https://badge.fury.io/js/timesmith.svg)](https://badge.fury.io/js/timesmith)
[![CI](https://github.com/hammeradam/timesmith/workflows/CI/badge.svg)](https://github.com/hammeradam/timesmith/actions)
[![codecov](https://codecov.io/gh/hammeradam/timesmith/branch/main/graph/badge.svg)](https://codecov.io/gh/hammeradam/timesmith)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fluent, type-safe API for time duration calculations in TypeScript with full ISO 8601 support.

## Features

- **Fluent API** - Chain time operations naturally
- **ISO 8601 Support** - Parse and format ISO 8601 duration strings
- **i18n Ready** - Full localization support with custom translations
- **Type-Safe** - Complete TypeScript support with strict typing
- **Lightweight** - Zero dependencies
- **Well Tested** - 97%+ test coverage

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

// Alternative syntax using 'add' prefix
const duration2 = time()
  .addDays(1)
  .addHours(2)
  .addMinutes(30)
  .build(); // Same result
```

## Usage Examples

### Building Durations

```typescript
import { time } from 'timesmith';

// Chain time units
const duration = time()
  .week(1)
  .day(2)
  .hour(3)
  .minute(45)
  .second(30)
  .build(); // Returns in seconds by default

// Convert to different units
const milliseconds = time()
  .hour(1)
  .build({ unit: 'ms' }); // 3600000

const minutes = time()
  .hour(2)
  .build({ unit: 'm' }); // 120

const hours = time()
  .day(1)
  .build({ unit: 'h' }); // 24
```

### Unit Conversions

```typescript
// Direct conversion methods
const weeks = time().day(14).toWeeks(); // 2
const days = time().hour(48).toDays(); // 2
const hours = time().minute(120).toHours(); // 2
const minutes = time().second(180).toMinutes(); // 3
const seconds = time().minute(2).toSeconds(); // 120
const ms = time().second(1).toMilliseconds(); // 1000
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
- `ms?: number` - Initial time in milliseconds (default: 0)

**Returns:** `TimeBuilder`

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

## Type Safety & Validation

### Progressive API

The TimeBuilder interface progressively removes methods as you use them, preventing invalid combinations:

```typescript
time()
  .week(1) // ✅ Can use week()
  .week(1); // ❌ TypeScript error - week() no longer available

time()
  .day(1) // ✅ Can use day()
  .hour(2) // ✅ Can use hour()
  .day(1); // ❌ TypeScript error - day() no longer available
```

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
const rateLimit = time().hour(1).toMilliseconds(); // 3600000ms
setTimeout(resetLimit, rateLimit);
```

### Cache TTL
```typescript
const ttl = time().day(1).hour(12).toSeconds(); // 129600s
cache.set('key', value, ttl);
```

### Scheduling & Cron
```typescript
const interval = time().minute(15).toMilliseconds(); // 900000ms
setInterval(checkUpdates, interval);
```

### Duration Calculations
```typescript
const deadline = time()
  .fromString('2weeks 3days')
  .build({ unit: 'd' }); // 17 days
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

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT © [Adam Hammer](https://github.com/hammeradam)
