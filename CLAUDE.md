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

## Testing Notes
- **Local Testing**: Most tools work locally by opening index.html in browser
- **CORS Issues**: Subway Nutrition tool requires server due to JSON data loading
- **GitHub Pages Testing**: Use live URLs from README.md for tools with CORS issues
- **Playwright MCP Testing**: Can test tools using Playwright MCP browser tools:
  1. Commit and push changes to main branch
  2. Wait 60 seconds for GitHub Pages deployment
  3. Use `mcp__playwright__browser_navigate` to load the live tool URL
  4. Use other Playwright MCP tools for interactive testing
- **Deployment Timing**: GitHub Pages updates take 30-60 seconds after pushing

## Data Management
- JSON data files stored in tool-specific data/ directories
- Python scripts used for data processing (e.g., combine_nutrition.py)
- Nutrition data follows structured schema with consistent field names
- Data files use proper line endings (LF, not CRLF)

## Git Workflow
- Main branch: `main` (default branch for PRs and deployments)
- Recent commits show focus on line ending standardization
- Standard git workflow: commit to main → auto-deploy to GitHub Pages