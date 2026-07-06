# Styling

`@flowui/ui` exposes two styling hooks:

1. `@flowui/ui/tailwind` for Tailwind theme and plugin setup.
2. `@flowui/ui/styles.css` for the package CSS custom properties.

## Tailwind preset

Apply the preset before local overrides so your app can extend it deliberately:

```ts
import preset from "@flowui/ui/tailwind"

const config = {
  presets: [preset],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "hsl(var(--primary))",
        },
      },
    },
  },
}

export default config
```

## CSS variables

The stylesheet at `@flowui/ui/styles.css` provides the tokens used by the packaged components. Import it once in your app shell or global stylesheet.

If your host app already owns the same variables, keep a single source of truth and avoid importing both definitions.

## Scoped imports

The package supports focused imports to avoid pulling unrelated feature areas into callsites:

- `@flowui/ui/primitives`
- `@flowui/ui/fields`
- `@flowui/ui/charts`
- `@flowui/ui/modal`
- `@flowui/ui/wizard`
- `@flowui/ui/webcam`
- `@flowui/ui/time-picker`
- `@flowui/ui/cloud-storage`
