# ⬡ NEO ALERT

> A futuristic, glassmorphism-inspired toast notification library. Zero dependencies, framework-agnostic, ~3KB gzipped.

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)
[![Size](https://img.shields.io/badge/size-~3KB_gzip-brightgreen)](#)

**[Live Demo →](https://github.com/Senpai-Gab/neo-alert.git)**

---

## Features

- Glassmorphism UI — backdrop blur, soft borders, layered shadows
- 4 toast types: success, error, warning, info
- 4 positions: top-right, top-left, bottom-right, bottom-left
- Auto-dismiss with animated progress bar
- Pause on hover
- Drag to dismiss (touch + mouse)
- Promise API (loading → success/error)
- Full per-toast theming (colors, radius, blur, shadow, width)
- 6 built-in theme presets
- Smart stacking (max toast queue)
- Zero dependencies
- UMD build — works in npm, CDN, script tag

---

## Installation

### npm / yarn / pnpm

```bash
npm install neo-alert
# or
yarn add neo-alert
# or
pnpm add neo-alert
```

```js
import { neoAlert } from 'neo-alert';
neoAlert.success('Hello!');
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/neo-alert@1.0.0/dist/neo-alert.min.js"></script>
```

### Download

Download `dist/neo-alert.js` from this repo and include it:

```html
<script src="/js/neo-alert.js"></script>
```

---

## Quick Start

```js
// One-liners
neoAlert.success('Saved!');
neoAlert.error('Something went wrong!');
neoAlert.warning('Disk usage is high.');
neoAlert.info('Update available.');

// With message body
neoAlert.success('Upload complete', {
  message: '3 files · 2.4 MB transferred.',
});

// Full options
neoAlert({
  type:         'success',
  title:        'Upload complete',
  message:      '3 files transferred.',
  position:     'top-right',
  duration:     4000,
  showProgress: true,
  pauseOnHover: true,
  draggable:    true,
  onDismiss:    () => console.log('closed'),
});
```

---

## API

### `neoAlert(options)` → `string` (ID)

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'info'` | `success` \| `error` \| `warning` \| `info` |
| `title` | string | — | Headline text **(required)** |
| `message` | string | — | Optional body description |
| `position` | string | `'top-right'` | `top-right` \| `top-left` \| `bottom-right` \| `bottom-left` |
| `duration` | number | `4000` | Auto-dismiss in ms. `0` = persistent |
| `showProgress` | boolean | `true` | Countdown progress bar |
| `pauseOnHover` | boolean | `true` | Freeze timer on hover |
| `draggable` | boolean | `true` | Drag to dismiss |
| `theme` | object | — | Custom visual overrides (see Theming) |
| `onDismiss` | function | — | Callback when toast closes |

### `neoAlert.success(title, options?)`
### `neoAlert.error(title, options?)`
### `neoAlert.warning(title, options?)`
### `neoAlert.info(title, options?)`

Shorthand methods. Return the toast ID.

### `neoAlert.promise(promise, messages)`

```js
neoAlert.promise(fetchData(), {
  loading: 'Fetching…',
  success: (data) => `Got ${data.length} results!`,
  error:   (err)  => `Failed: ${err.message}`,
});
```

### `neoAlert.dismiss(id)`

Dismiss a specific toast programmatically.

### `neoAlert.clearAll()`

Dismiss all active toasts.

### `neoAlert.configure(options)`

Set global defaults once at app start:

```js
neoAlert.configure({
  position:     'top-right',
  duration:     4000,
  maxToasts:    6,
  pauseOnHover: true,
  showProgress: true,
  draggable:    true,
});
```

---

## Theming

Pass a `theme` object to override any visual property per-toast:

```js
neoAlert.success('Saved!', {
  theme: {
    background:     'rgba(13,18,32,0.88)',
    borderColor:    'rgba(56,189,248,0.22)',
    iconBackground: 'rgba(56,189,248,0.15)',
    iconColor:      '#38bdf8',
    titleColor:     '#dde3f0',
    messageColor:   'rgba(221,227,240,0.58)',
    borderRadius:   '14px',
    backdropBlur:   'blur(22px)',
    width:          '320px',
    shadow:         '0 4px 20px rgba(0,0,0,.4)',
    progressColor:  '#38bdf8',
  }
});
```

Use the **[interactive builder](https://github.com/Senpai-Gab/neo-alert.git#builder)** to generate this code visually.

---

## Framework Examples

### React

```jsx
import { neoAlert } from 'neo-alert';

function SaveButton() {
  const handleSave = async () => {
    const id = neoAlert.info('Saving…', { duration: 0 });
    try {
      await saveData();
      neoAlert.dismiss(id);
      neoAlert.success('Saved!');
    } catch (err) {
      neoAlert.dismiss(id);
      neoAlert.error('Save failed', { message: err.message });
    }
  };
  return <button onClick={handleSave}>Save</button>;
}
```

### Vue 3

```js
// main.js
import { createApp } from 'vue';
import { neoAlert } from 'neo-alert';
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.$toast = neoAlert;
app.mount('#app');
```

```html
<!-- In any component -->
<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const notify = () => proxy.$toast.success('Vue toast!');
</script>
```

---

## Project Structure

```
neo-alert/
├── index.html          ← Documentation & demo site (GitHub Pages)
├── README.md
├── package.json
├── .gitignore
├── dist/
│   └── neo-alert.js    ← The library (include this in your project)
└── demo/
    └── app.js          ← Demo page logic
```

---

## License

MIT © YOUR-USERNAME
