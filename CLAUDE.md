@import AGENTS.md

## Additional Context

### Testing Infrastructure

#### Manual Testing
- **Local Testing**: Most tools work locally by opening index.html in browser
- **CORS Issues**: Subway Nutrition tool requires server due to JSON data loading
- **GitHub Pages Testing**: Use live URLs from README.md for tools with CORS issues
- **Deployment Timing**: GitHub Pages updates take 30-60 seconds after pushing

#### Automated Testing (Subway Nutrition)
- **Framework**: Playwright E2E testing with comprehensive test coverage
- **Test Execution**:
  - `npm run test:live` - Fast testing against GitHub Pages (chromium only)
  - `npm run test:local` - Testing against local dev server (chromium only)  
  - `npm test` - Full cross-browser testing (chromium, firefox, webkit)
  - `npm run test:headed` - Visual testing with browser UI
  - `npm run test:debug` - Interactive debugging mode

- **Test Coverage**: 10 comprehensive tests covering:
  - App loading and component display
  - Ingredient selection and removal
  - Nutrition calculation accuracy
  - Search and filtering functionality
  - Modal functionality and keyboard shortcuts
  - Edge cases and error handling

- **Development Workflow**: 
  1. Run tests before making changes to establish baseline
  2. Run `npm run test:live` during development for fast feedback
  3. Run full cross-browser tests before major releases
  
- **Test Infrastructure Setup**: 
  ```bash
  cd subway-nutrition/
  npm install          # Install test dependencies
  npm run test:live    # Run tests against live GitHub Pages version
  ```

### Data Management
- JSON data files stored in tool-specific data/ directories
- Python scripts used for data processing (e.g., combine_nutrition.py)
- Nutrition data follows structured schema with consistent field names
- Data files use proper line endings (LF, not CRLF)

### Development Tips
- Remember to check if the local python http server is already running, and if it is, if it's ours (serving our files)
- Remember to check for available npm scripts
