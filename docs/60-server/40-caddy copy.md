---
title: Server update procedure
description: We update the server using the following procedure.
---

We update the server using the following procedure.

## GitHub Issues

First, create an Issue on GitHub. We also have [an issue template prepared for releases](https://github.com/sinProject-Inc/talk/blob/main/.github/ISSUE_TEMPLATE/release.md).

## Updating version

You can manage and change versions in package.json and package-lock.json easily using the npm version command.

Here's how you can use it:

```bash
npm version <newversion>
```

In this command, replace &lt;newversion&gt; with the new version number (e.g., 1.0.2). Running this command updates the version numbers in both package.json and package-lock.json to the version number you specify.

Alternatively, you can use one of the following keywords in place of <newversion>:

patch: this increments the patch version (e.g., 1.0.1 -> 1.0.2)
minor: this increments the minor version (e.g., 1.0.1 -> 1.1.0)
major: this increments the major version (e.g., 1.0.1 -> 2.0.0)
Please note that running the npm version command will create a new commit including the version update and also tag it with the new version number (this behavior can be altered in the settings).
