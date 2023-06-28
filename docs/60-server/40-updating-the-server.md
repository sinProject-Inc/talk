---
title: Updating the server
description: We update the server using the following procedure.
---

We update the server using the following procedure.

## GitHub Issues

First, create an Issue on GitHub. We also have [an issue template prepared for releases](https://github.com/sinProject-Inc/talk/blob/main/.github/ISSUE_TEMPLATE/release.md).

## Updating version

You can manage and change versions in package.json and package-lock.json easily using the npm version command.

Here's how you can use it:

```bash
npm version <new-version>
```

In this command, replace &lt;newversion&gt; with the new version number (e.g., 1.0.2). Running this command updates the version numbers in both package.json and package-lock.json to the version number you specify.

Alternatively, you can use one of the following keywords in place of <newversion>:

- patch: this increments the patch version (e.g., 1.0.1 -> 1.0.2)
- minor: this increments the minor version (e.g., 1.0.1 -> 1.1.0)
- major: this increments the major version (e.g., 1.0.1 -> 2.0.0)

Please note that running the npm version command will create a new commit including the version update and also tag it with the new version number (this behavior can be altered in the settings).

## Pushing and Merging

1. Create a PR (Pull Request). In this case, since the issue is not closed, it is not necessary to rewrite the template.
1. Merge the PR (Pull Request) without any checks.
1. Push the created tag to origin.

## GitHub

1. Attach the `enhancement` label to [closed PRs](https://github.com/sinProject-Inc/talk/pulls?q=is%3Apr+sort%3Aupdated-desc+is%3Aclosed) that appear to be feature enhancements.
1. Open [the release creation page](https://github.com/sinProject-Inc/talk/releases) on GitHub and click the `Draft a new release` button.
1. Select the newly created tag with `Choose a tag`.
1. Press the `Generate release notes` button.
1. Preview the automatically generated release notes to check for any problems.
1. If there are no problems, press the `Publish release` button to create the release.

## Connecting Server

Connect to the server using the `ssh @dev@sinpro-dev` command.

## Updating

Execute the following command.

```bash
cd ~/dev/talk
git checkout main && git pull
npm i --legacy-peer-deps
npm run build
pm2 restart talk
```

## Checking

1. Connect to https://talk.sinpro.dev/
1. Confirm that the version has been updated.
1. Confirm that there are no issues with the display.
1. Confirm that there are no issues with the operation.

## Announcement

1. If there are additions or updates to the documentation, announce them to the members.
1. Request the product manager to make an announcement on social media.
