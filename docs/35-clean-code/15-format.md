---
title: Format
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Use only single quotes

```ts::Bad
console.log("Hello")
console.log('World')
```

```ts::Good
console.log('Hello')
console.log('World')
```

## Don't append semicolons at the end of lines

```ts::General
console.log('Hello');
```

```ts::Our Style
console.log('Hello')
```

## Use template literals

```ts:Old-fashioned
const first_name = 'John'
const last_name = 'Smith'

console.log(first_name + ' ' + last_name)
```

```ts:Good
const first_name = 'John'
const last_name = 'Smith'

console.log(`${first_name} ${last_name}`)
```

## Use blank lines for readability

```ts:Bad
function foo(): number {
  let sum = 0
  for (...) {
    const buz = ''
    if (...) {
      // ...
    }
    console.log(...)
  }
  return sum
}
function bar(): void {
  // ...
}
```

```ts:Good
function foo(): void {
  let sum = 0

  for (...) {
    const buz = ''

    if (...) {
      // ...
    }

    console.log(...)
  }

  return sum
}

function bar(): void {
  // ...
}
```

## Explicit function return type

```ts::Bad
function foo() {
  // ...
  return true;
}
```

```ts::Good
function foo(): boolean {
  // ...
  return true;
}
```

## Don't allow unreachable code

```ts::Bad
function foo(): boolean {
  // ...
  return true;
  console.log('Hello');
}
```

```ts::Good
function foo(): boolean {
  // ...
  return true;
}
```

## Variable names, argument names, and function names should be in snake_case

```ts::General
function fooBar(pageCount: number): void {
  const maxCount = 5
  // ...
}
```

```ts::Our Style
function foo_bar(page_count: number): void {
  const max_count = 5
  // ...
}
```

## Explicit member accessibility

```ts::Bad
class Foo {
  bar(): void {
    // ...
  }
}
```

```ts::Good
class Foo {
  public bar(): void {
    // ...
  }
}
```
