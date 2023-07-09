---
title: Quality
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Achieve exactly what is being requested

Display 'Hello, World!'

```ts::Bad
console.log('Hello world!')
```

```ts::Good
console.log('Hello, World!')
```

## Don't commit code that cannot be executed

```ts::Bad
function foo(): void {
 console.log(`Hello`)
```

```ts::Good
function foo(): void {
 console.log(`Hello`)
}
```

## Don't allow code clones

```ts::Bad
function check_odd_or_even(input_number: number): string {
  if (input_number % 2 == 0) {
    return `${input_number} is Even`;
  } else {
    return `${input_number} is Odd`;
  }
}
```

```ts::Good
function check_odd_or_even(input_number: number): string {
  let result = input_number % 2 == 0 ? 'Even' : 'Odd';

  return `${input_number} is ${result}`;
}
```
