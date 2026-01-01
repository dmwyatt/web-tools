# Agent Instructions for web-tools

This document provides guidance for AI agents working on this repository.

## Repository Overview

This is a collection of self-contained web tools published via GitHub Pages. Each tool is a standalone HTML/CSS/JavaScript application that runs entirely in the browser.

## Adding a New Tool

### Quick Start

1. **Create a new directory** for the tool in the repository root
   - Use kebab-case naming (e.g., `my-new-tool`)
   - The directory name becomes part of the URL

2. **Create an `index.html` file** in that directory
   - Must be a complete, self-contained HTML document
   - Include all CSS and JavaScript inline or via CDN links
   - No build process - it should work by opening the file directly in a browser

3. **Test locally** by opening the `index.html` file in a browser

4. **Update `README.md`** to add the new tool to the "Available Tools" list

5. **Push to main** - GitHub Pages automatically publishes changes from the main branch

### Tool Requirements

- **Self-contained**: All code in a single directory
- **No dependencies**: Don't use npm, build tools, or local dependencies
- **CDN libraries only**: Use CDN-hosted libraries (Alpine.js, Chart.js, etc.) if needed
- **Works offline-capable**: Should function when opened as a local file
- **Responsive**: Should work on mobile and desktop browsers

## Architecture Reference

### Examine Existing Tools

Before building a new tool, **look at existing implementations** to understand patterns and best practices:

#### Simple Tools (Good Starting Points)
- `fan-grille-drill-template-generator/` - Uses Alpine.js for reactivity, generates SVG templates
- `ford-tow-calc/` - Simple calculator interface
- `speech-synthesis-tester/` - Web API demonstration

#### Advanced Tools
- `font-metrics/` - Canvas manipulation, complex visualizations
- `subway-nutrition/` - Data-driven interface with filtering

### Common Patterns

**Framework Choice**: Most tools use Alpine.js (v3) via CDN for reactive UI
```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.0/dist/cdn.min.js"></script>
```

**Styling**: Inline CSS using system fonts and simple, modern design
- System font stack for consistency
- Dark or light themes depending on tool purpose
- Responsive layouts using CSS Grid/Flexbox

**No External Data**: Tools should work without network requests (except CDN libraries)
- Embed data directly in the HTML/JavaScript
- Use localStorage for persistence if needed

## GitHub Pages Deployment

The repository uses GitHub Pages with these settings:
- **Source**: Deploy from main branch
- **Directory**: Root (/)
- **URL Pattern**: `https://dmwyatt.github.io/web-tools/<directory-name>/`

No build process or GitHub Actions required - changes pushed to main are automatically published.

## File Organization

```
web-tools/
├── tool-name/
│   └── index.html          # Complete tool
├── another-tool/
│   └── index.html
├── README.md               # User-facing documentation
├── AGENTS.md              # This file
└── .gitignore
```

## Best Practices

1. **Keep it simple**: Prefer vanilla JavaScript or lightweight frameworks
2. **Pin CDN versions**: Always specify exact version numbers for CDN libraries
3. **Include documentation**: Add comments or help text within the tool itself
4. **Test thoroughly**: Verify in multiple browsers before committing
5. **Accessibility**: Use semantic HTML and proper ARIA labels where appropriate

## Examples to Study

- For Alpine.js patterns: See `fan-grille-drill-template-generator/index.html`
- For canvas/drawing: See `font-metrics/index.html`
- For form-based tools: See `ford-tow-calc/index.html`
- For data visualization: See `subway-nutrition/index.html`
