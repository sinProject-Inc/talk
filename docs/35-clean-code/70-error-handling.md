---
title: Error handling
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Always use Error for throwing or rejecting

```ts::Bad
function calculate_total(items: Item[]): number {
  throw 'Not implemented.'
}
```

```ts::Good
function calculate_total(items: Item[]): number {
  throw new Error('Not implemented.')
}
```

## Don’t ignore caught errors

```ts::Bad
try {
  function_that_might_throw()
} catch (error) {
  console.log(error)
}
```

```ts::Good
try {
  function_that_might_throw()
} catch (error) {
  // One option (more noisy than console.log):
  console.error(error)
  // Another option:
  notify_user_of_error(error)
  // Another option:
  report_error_to_service(error)
  // OR do all three!
}
```
