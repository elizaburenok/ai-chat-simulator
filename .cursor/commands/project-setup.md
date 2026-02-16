## Project setup

- **Scan:** Detect tokens/, design-tokens/, or theme/ folders; check for css-variables.css and token imports in components.
- **Plan:** If tokens exist, include: (1) importing token CSS in the entry point first, (2) optional path aliases for tokens, (3) no changes to token files.
- **Apply:** In main.tsx, import token CSS before App. Preserve component folder structure and barrel exports.
- **Prototype projects:** If package.json is missing, start from scratch: npm init, add dependencies, create entry point and index.html.