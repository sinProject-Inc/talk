---
title: Variables
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Use meaningful and pronounceable variable names

```ts::Bad
const yyyymmdstr = moment().format('YYYY/MM/DD')
```

```ts::Good
const formatted_current_date = moment().format('YYYY/MM/DD')
```

## Use searchable names

```ts::Bad
// What the heck is 86400000 for?
setTimeout(restart, 86400000)
```

```ts::Good
// Declare them as capitalized named constants.
const milliseconds_per_day = 60 * 60 * 24 * 1000 //86400000

setTimeout(restart, milliseconds_per_day)
```

## Use explanatory variables

```ts::Bad
const user_map: Map<string, User>

for (const key_value of user_map) {
	// ...
}
```

```ts::Good
const user_map: Map<string, User>

for (const [id, user] of user_map) {
	// ...
}
```

## Avoid Mental Mapping

```ts::Bad
const c = get_count()
const u = get_user()
```

```ts::Good
const count = get_count()
const user = get_user()
```

## Don't add unneeded context

```ts::Bad
const Car = {
  car_make: "Honda",
  car_model: "Accord",
  car_color: "Blue"
}

function paint_car(car: Car, color: string): void {
  car.car_color = color
}
```

```ts::Good
const Car = {
  make: "Honda",
  model: "Accord",
  color: "Blue"
}

function paint_car(car: Car, color: string): void {
  car.color = color
}
```

## Use default parameters instead of short circuiting or conditionals

```ts::Bad
function load_pages(count?: number) {
  const load_count = count ?? 10
  // ...
}
```

```ts::Good
function load_pages(count: number = 10) {
  // ...
}
```

## Use enum to document the intent

```ts::Bad
const GENRE = {
  ROMANTIC: 'romantic',
  DRAMA: 'drama',
  COMEDY: 'comedy',
  DOCUMENTARY: 'documentary',
}
```

```ts::Good
enum genre {
  romantic,
  drama,
  comedy,
  documentary,
}
```
