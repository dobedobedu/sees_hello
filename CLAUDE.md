# Claude AI Guidelines

## Project Overview
This document provides guidelines for Claude AI when working on this repository.

## Code Style & Conventions

### General
- Follow existing code patterns and conventions
- Maintain consistent indentation (check existing files)
- Use meaningful variable and function names
- Add comments only for complex logic

### For Web Projects (had_me_at_hello)
- Use React functional components with hooks
- Follow Next.js best practices
- Use TypeScript when available
- Tailwind CSS for styling
- Keep components small and focused
- Use proper error handling with try/catch

### For iOS Projects (TapTap Mind, TapTap Sun)
- Follow Swift style guide
- Use SwiftUI for UI components
- MVVM architecture pattern
- Proper error handling with Result types
- Use Combine for reactive programming where appropriate
- Follow Apple's Human Interface Guidelines

## Testing Requirements
- Write unit tests for new functions
- Ensure all tests pass before creating PR
- Test on relevant platforms/devices

## Git Conventions
- Use conventional commits:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code restructuring
  - `test:` for tests
  - `chore:` for maintenance

## Security
- Never commit sensitive data
- Use environment variables for secrets
- Validate all user inputs
- Follow OWASP guidelines for web apps

## Performance
- Optimize for mobile devices
- Lazy load when possible
- Minimize bundle sizes
- Use proper caching strategies

## Documentation
- Update README when adding features
- Document complex functions
- Include usage examples for new APIs

## Specific Instructions
<!-- Add project-specific instructions here -->
- For had_me_at_hello: Focus on user experience and real-time features
- For TapTap Mind: Prioritize mental health sensitivity and privacy
- For TapTap Sun: Optimize for battery life and offline functionality