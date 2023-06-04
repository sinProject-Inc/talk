---
title: GitHub Branch Protection
---

## Managing a branch protection rule

> You can create a branch protection rule to enforce certain workflows for one or more branches, such as requiring an approving review or passing status checks for all pull requests merged into the protected branch.

[More Information >](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

## How to create a branch protection rule

- Open `Target Repository > Settings > Branches`
- Push `Add rule` button

## Settings

### Branch name pattern

`main`

### Protect matching branches

Apply the following settings:

- Require a pull request before merging
  - Require approvals: 1
  - Dismiss stale pull request approvals when new commits are pushed
- Require status checks to pass before merging
  - Status checks that are required.: Search for the target Actions and add them.
- Restrict who can push to matching branches
  - Restrict pushes that create matching branches
