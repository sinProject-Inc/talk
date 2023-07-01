---
title: Comments
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Prefer self explanatory code instead of comments

```ts::Bad
// Check if subscription is active.
if (subscription.end_date > Date.now) {
	/* ... */
}
```

```ts::Good
const is_subscription_active = subscription.end_date > Date.now

if (is_subscription_active) {
  /* ... */
}
```

## Don't leave commented out code in your codebase

```ts::Bad
do_stuff()
// doOtherStuff()
// doSomeMoreStuff()
// doSoMuchStuff()
```

```ts::Good
do_stuff()
```

## Don't have journal comments

```ts::Bad
/**
 * 2016-12-20: Removed monads, didn't understand them (RM)
 * 2016-10-01: Improved using special monads (JP)
 * 2016-02-03: Removed type-checking (LI)
 * 2015-03-14: Added combine with type-checking (JR)
 */
function combine(a, b) {
  return a + b;
}
```

```ts::Good
function combine(a: number, b: number): number {
  return a + b;
}
```
