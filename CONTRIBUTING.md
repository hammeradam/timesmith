# Contributing to timesmith

Thank you for your interest in contributing to timesmith! This document provides guidelines and information for contributors.

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 8 or higher (recommended) or npm
- TypeScript 5+

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/hammeradam/timesmith.git
   cd timesmith
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Run tests to ensure everything works:
   ```bash
   pnpm test
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Building

```bash
pnpm run build
```

### Linting

```bash
# Check for issues
pnpm run lint

# Fix automatically fixable issues
pnpm run lint:fix
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-duration-format`
- `fix/iso8601-parsing`
- `docs/update-readme`

### Commit Messages

Follow conventional commit format:
- `feat: add duration formatting options`
- `fix: handle edge cases in time parsing`
- `docs: update API documentation`
- `test: add arithmetic operation tests`

### Code Standards

- **TypeScript**: All code must be properly typed
- **Testing**: New features require comprehensive tests
- **Documentation**: Update README and JSDoc comments
- **Linting**: Code must pass ESLint checks

### Testing Requirements

- Maintain or improve test coverage (currently 100%)
- Add unit tests for new functionality
- Add integration tests for new features
- Ensure all existing tests continue to pass

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the code standards
3. **Add/update tests** for your changes
4. **Update documentation** if needed
5. **Run the full test suite** and ensure it passes
6. **Submit a pull request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots/examples if applicable

### Pull Request Checklist

- [ ] Tests pass locally (`pnpm test`)
- [ ] Code builds successfully (`pnpm run build`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] Documentation updated if needed
- [ ] New functionality includes tests
- [ ] Breaking changes are documented

## Types of Contributions

### Bug Reports

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Minimal code example

### Feature Requests

For new features:
- Describe the use case
- Explain why it belongs in timesmith
- Consider backwards compatibility
- Provide implementation ideas if possible

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear sections
- Add examples
- Improve API documentation
- Update outdated information

## Code Architecture

### Key Components

- **`time()` function**: Main entry point for creating time durations
- **`TimeBuilder` interface**: Fluent API for building and manipulating durations
- **Time unit methods**: week(), day(), hour(), minute(), second(), millisecond()
- **Conversion methods**: toWeeks(), toDays(), toHours(), toMinutes(), toSeconds(), toMilliseconds()
- **Arithmetic operations**: add(), subtract()
- **Comparison operations**: isLessThan(), isGreaterThan(), equals(), isBetween()
- **String formatting**: toString(), toISO8601String()
- **String parsing**: fromString(), fromISO8601String()
- **Input validation**: Runtime validation with clear error messages

### Design Principles

- **Type Safety**: Leverage TypeScript's type system for compile-time checks
- **Immutability**: Each operation returns a new TimeBuilder instance
- **Fluent Interface**: Method chaining for natural duration building
- **Zero Dependencies**: Lightweight with no external runtime dependencies
- **ISO 8601 Support**: Full support for ISO 8601 duration format
- **i18n Ready**: Customizable translations for human-readable output

## Release Process

Releases are automated via GitHub Actions when code is pushed to `main`:

1. Tests run on CI
2. Package is built
3. Published to npm automatically

## Questions?

If you have questions about contributing:
- Open an issue for discussion
- Check existing issues and PRs
- Review this contributing guide

Thank you for contributing to timesmith!
