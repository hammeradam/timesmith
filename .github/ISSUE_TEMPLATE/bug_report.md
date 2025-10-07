---
name: Bug Report
about: Create a report to help us improve timesmith
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## To Reproduce

Steps to reproduce the behavior:

1. Install timesmith version: `X.X.X`
2. Run the following code:
   ```typescript
   // Your code here
   ```
3. See error

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

What actually happened instead.

## Environment

- **OS**: [e.g. macOS 14.0, Ubuntu 22.04]
- **Node.js version**: [e.g. 20.17.0]
- **timesmith version**: [e.g. 2.4.0]
- **TypeScript version**: [e.g. 5.3.3]

## Code Sample

```typescript
// Minimal reproducible example
import { time } from 'timesmith';

const duration = time({ h: 1, m: 30 }).build();
console.log(duration); // Expected: 5400
```

## Error Messages

```
// Paste any error messages here
```

## Additional Context

Add any other context about the problem here.

## Possible Solution

If you have ideas about what might be causing the issue or how to fix it, please share them here.
