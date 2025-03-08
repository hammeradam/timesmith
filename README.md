# timesmith

A fluent API for time duration calculations in TypeScript.

## Installation

```bash
npm install timesmith
```

## Usage

```typescript
import { time } from 'timesmith';

// Basic usage
const duration = time()
  .day(1)
  .hour(2)
  .minute(30)
  .build();

// Convert to different units
const inMilliseconds = time()
  .hour(1)
  .build({ unit: 'ms' });

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
  .toString({ short: true }); // "1d 2h"
```

## API Reference

### time(options?)

Creates a new time builder instance.

Options:
- `ms`: Initial time in milliseconds (default: 0)

### Methods

- `week(weeks?)`: Add weeks
- `day(days?)`: Add days
- `hour(hours?)`: Add hours
- `minute(minutes?)`: Add minutes
- `second(seconds?)`: Add seconds
- `millisecond(milliseconds?)`: Add milliseconds
- `toString(options?)`: Convert to human readable string
- `fromString(timeString)`: Parse from string
- `build(options?)`: Build the final value
- `toWeeks()`: Convert to weeks
- `toDays()`: Convert to days
- `toHours()`: Convert to hours
- `toMinutes()`: Convert to minutes
- `toSeconds()`: Convert to seconds
- `toMilliseconds()`: Convert to milliseconds

## License

MIT