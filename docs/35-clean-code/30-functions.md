---
title: Functions
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Use early return pattern

```ts::Bad
function foo(): void {
  if (argument1.is_valid()) {
    if (argument2.is_valid()) {
      if (argument3.is_valid()) {
        // DO SOMETHING
      }
    }
  }
}
```

```ts::Good
function foo(): void {
  if (!argument1.is_valid()) return
  if (!argument2.is_valid()) return
  if (!argument3.is_valid()) return

  // DO SOMETHING
}
```

## Functions should do one thing

```ts::Bad
function email_clients(clients: Client[]) {
  clients.forEach((client) => {
    const client_record = database.lookup(client)
    if (client_record.is_active()) {
      email(client)
    }
  })
}
```

```ts::Good
function email_clients(clients: Client[]) {
  clients.filter(is_active_client).forEach(email)
}

function is_active_client(client: Client) {
  const client_record = database.lookup(client)
  return client_record.is_active()
}
```

## Function names should say what they do

```ts::Bad
function add_to_date(date: Date, month: number): Date {
  // ...
}

const date = new Date()

// It's hard to tell from the function name what is added
add_to_date(date, 1)
```

```ts::Good
function add_month_to_date(date: Date, month: number): Date {
  // ...
}

const date = new Date()

add_month_to_date(date, 1)
```

## Don't use flags as function parameters

```ts::Bad
function create_file(name: string, temp: boolean) {
  if (temp) {
    fs.create(`./temp/${name}`)
  } else {
    fs.create(name)
  }
}
```

```ts::Good
function create_temp_file(name: string) {
  create_file(`./temp/${name}`)
}

function create_file(name: string) {
  fs.create(name)
}
```

## Avoid negative conditionals

```ts::Bad
function is_email_not_used(email: string): boolean {
  // ...
}

if (is_email_not_used(email)) {
  // ...
}
```

```ts::Good
function is_email_used(email: string): boolean {
  // ...
}

if (!is_email_used(node)) {
  // ...
}
```

## Remove dead code

```ts::Bad
function old_request_module(url: string) {
  // ...
}

function request_module(url: string) {
  // ...
}

const req = requestModule
```

```ts::Good
function request_module(url: string) {
  // ...
}

const req = requestModule
```
