---
title: Classes
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Classes should be small

```ts::Bad
class Dashboard {
  disable(): void { /* ... */ }
  enable(): void { /* ... */ }
  getVersion(): string { /* ... */ }
  getLanguage(): string { /* ... */ }
  setLanguage(language: string): void { /* ... */ }
  // ...
}
```

```ts::Good
class Dashboard {
  disable(): void { /* ... */ }
  enable(): void { /* ... */ }
  getVersion(): string { /* ... */ }
}
```
