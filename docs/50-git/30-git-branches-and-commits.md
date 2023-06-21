---
title: Git Branches and Commits
description: Write the issue number and issue title in kebab-case, connected with a hyphen.
---

## Git branch naming conventions

Write the issue number and issue title in kebab-case, connected with a hyphen.

```md
743-git-branches-and-commits
```

## Script

We have prepared [a script to create branches issue names](https://github.com/sinProject-Inc/talk/blob/main/src/lib/git/create_git_branch.ts).

```bash
npm run create-branch "<branch-name> #<branch-number>"
```

example:

```bash
npm run create-branch "Docs: Correct English #990"
```

## Commit message conventions

Include the issue title and issue number.

```md
Docs: Git Branches and Commits #743
```

If there are multiple commits in the same branch, provide additional details.

```md
Docs: Git Branches and Commits #743 Update docs
```
