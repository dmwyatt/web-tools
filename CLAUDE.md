## Repository Overview
- Collection of simple, self-contained web utilities hosted on GitHub Pages
- Each tool is a standalone HTML page with minimal dependencies
- No build process or package management - tools run directly in browser
- Repository URL: https://github.com/dmwyatt/web-tools.git
- Live tools accessible at: https://dmwyatt.github.io/web-tools/[tool-name]/

## Repository Structure
```
web-tools/
├── README.md                                    # Main project documentation
├── .gitignore                                  # Git ignore rules
├── fan-grille-drill-template-generator/        # Alpine.js-based tool
│   └── index.html                              # Self-contained HTML with inline CSS/JS
├── ford-tow-calc/                              # Chart.js-based calculator
│   └── index.html                              # Self-contained HTML with inline CSS/JS
├── rectangle-vent-drill-template-generator/    # Simple HTML tool
│   └── index.html                              # Self-contained HTML
├── subway-nutrition/                           # Most complex tool
│   ├── index.html                              # Main HTML structure
│   ├── script.js                               # External JavaScript file
│   ├── styles.css                              # External CSS file
│   ├── package.json                            # npm dependencies (testing only)
│   ├── playwright.config.js                    # E2E test configuration
│   ├── tests/                                  # E2E test files
│   │   └── e2e.spec.js                         # Comprehensive test suite
│   └── data/                                   # JSON data files and Python build script
│       ├── *.json                              # Nutrition data files
│       ├── master-nutrition.json               # Combined data file
│       └── combine_nutrition.py               # Python script to merge data files
└── test-results/                              # Ignored test output directory
```

## Technology Stack
- **Core**: Vanilla HTML, CSS, JavaScript (ES6+)
- **Libraries used**:
  - Alpine.js v3.14.0 (fan-grille tool)
  - Chart.js (ford-tow-calc)
- **Data**: JSON files for structured data (subway nutrition)
- **Testing**: Playwright (E2E testing for subway-nutrition tool)
- **Deployment**: GitHub Pages (automatic on push to main)

## Development Patterns
- Tools are self-contained with minimal external dependencies
- Most tools embed CSS and JavaScript inline in HTML
- Complex tools (subway-nutrition) use separate files for maintainability
- No build process - tools work directly from source
- System fonts used for consistency across platforms

## File Management Rules
- Keep README.md updated with all available tools and their live URLs
- Each tool should have its own directory with descriptive name
- Use kebab-case for directory names
- Prefer self-contained HTML files over multiple file structures
- Only separate CSS/JS when complexity demands it (like subway-nutrition)

## Testing Infrastructure

### Manual Testing
- **Local Testing**: Most tools work locally by opening index.html in browser
- **CORS Issues**: Subway Nutrition tool requires server due to JSON data loading
- **GitHub Pages Testing**: Use live URLs from README.md for tools with CORS issues
- **Deployment Timing**: GitHub Pages updates take 30-60 seconds after pushing

### Automated Testing (Subway Nutrition)
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

## Data Management
- JSON data files stored in tool-specific data/ directories
- Python scripts used for data processing (e.g., combine_nutrition.py)
- Nutrition data follows structured schema with consistent field names
- Data files use proper line endings (LF, not CRLF)

## Git Workflow
- Main branch: `main` (default branch for PRs and deployments)
- Recent commits show focus on line ending standardization
- Standard git workflow: commit to main → auto-deploy to GitHub Pages

## Development Tips
- remember to check if the local python http server is already running, and if it is, if it's ours (serving our files)