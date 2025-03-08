# timesmith

A fluent API for time duration calculations in TypeScript.

## Installation

```bash
pnpm add timesmith
```

Or using your preferred package manager:

```bash
npm install timesmith
yarn add timesmith
```

## Usage

```typescript
import { time } from 'timesmith';

// Basic usage
const duration = time()
  .day(1)
  .hour(2)
  .minute(30)
  .build(); // Returns seconds by default

// Convert to different units
const inMilliseconds = time()
  .hour(1)
  .build({ unit: 'ms' }); // 3600000

// Parse from string
const fromString = time()
  .fromString('1d 2h 30m')
  .build();

// Human readable output
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
const customSeparator = time()
  .hour(1)
  .minute(30)
  .toString({ separator: ' | ' }); // "1 hour | 30 minutes"

// Localization
const spanish = time()
  .hour(2)
  .toString({
    translations: {
      hour: {
        long: { singular: 'hora', plural: 'horas' },
        short: { singular: 'h', plural: 'h' }
      }
    }
  }); // "2 horas"
```

## API Reference

### time(options?)

Creates a new time builder instance.

### Methods

- `week(weeks?)`: Add weeks
- `day(days?)`: Add days
- `hour(hours?)`: Add hours
- `minute(minutes?)`: Add minutes
- `second(seconds?)`: Add seconds
- `millisecond(milliseconds?)`: Add milliseconds
- `toString(options?)`: Convert to human readable string
  - `options.format`: 'long' (default) or 'short'
  - `options.separator`: Custom separator (default: ', ')
  - `options.translations`: Custom translations object
- `fromString(timeString)`: Parse from string
- `build(options?)`: Build the final value
  - `options.unit`: Output unit ('w', 'd', 'h', 'm', 's', 'ms')

### Validation

- Throws on negative values
- Throws on non-finite values
- Throws on invalid string formats in `fromString()`

## License

MIT
