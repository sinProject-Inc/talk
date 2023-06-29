---
title: npm-check-updates
description: pm-check-updates upgrades your package.json dependencies to the latest versions, ignoring specified versions.
---

[npm-check-updates](https://github.com/raineorshine/npm-check-updates) upgrades your package.json dependencies to the latest versions, ignoring specified versions.

## Installation

install globally:

```bash
npm install -g npm-check-updates
```

## Usage

Show all new dependencies (excluding peerDependencies) for the project in the current directory:

```bash
ncu
```

Upgrade a project's package file:

```bash
ncu -u
```

only modifies package.json file. Run `npm install` to update your installed packages and package-lock.json:

```bash
npm install
```

Check global packages:

```bash
ncu -g
```
