---
title: Objects and Data Structures
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Make objects have private/protected members

```ts::Bad
class Circle {
  public radius: number;

  public constructor(radius: number) {
    this.radius = radius
  }
}
```

```ts::Good
class Circle {
  public constructor(private readonly _radius: number) {}
}
```
