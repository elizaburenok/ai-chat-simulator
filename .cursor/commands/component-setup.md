## Component setup

**Apply:** Generate a React component for this frame:
- use the exact hex colors, fonts, border-radius, shadows, and spacing from the design;
- do not approximate values or replace them with generic variables, use the concrete values from Figma;
- add hover states for interactive elements (buttons, links, cards) with smooth animation (transition, transform, opacity);
- use will-change for the properties that change on hover (for example, transform, opacity);
- make the layout responsive with breakpoints for mobile, tablet, and desktop (sm/md/lg);

**Apply:** Structure:
- put the component in the `components/` folder: one folder per component with `.tsx`, `.css` (BEM), and `index.ts`; use typed props;
- name props the way you would name component variants in Figma;
- add a Playground file if the component can be tested in isolation.

First, show the full component code, then briefly explain how you interpreted the layout and spacing from the Figma design.