---
title: Git User Profiles
description: This document will guide you on setting up your git user profiles using the Git Config User Profiles extension in VSCode. This is especially helpful for people who share a development device.
---

This document will guide you on setting up your git user profiles using the [Git Config User Profiles](https://marketplace.visualstudio.com/items?itemName=syler.git-config-user-profiles) extension in VSCode. This is especially helpful for people who share a development device.

## Installing the Extension

1. Navigate to the `Extensions` tab.
2. Search for `Git Config User Profiles` and install it.

## Creating a Git Config User Profile

1. Open the command palette with `Shift + Command + P`.
2. Search and execute `git config user profiles: create a git config user profile`.
3. You will then be prompted to enter your profile name, account name, and an email address to create your profile.

## Selecting a Git Config User Profile

1. Open the command palette again.
2. Search and execute `Git Config User Profiles: Select a git config user profile`.
3. A confirmation pop-up will appear in the bottom right corner. If there are no issues, proceed with the selection.

**Note:** This operation will update the account information documented in the open project to the selected profile.

## Resolving Account Information Discrepancies

If there are discrepancies between the account information in the selected profile and the open file, a warning will be displayed in yellow on the blue bar at the bottom of the screen. To resolve this:

1. Click on the warning or,
2. Repeat step [3] of the `Selecting a Git Config User Profile` section above to select the correct profile.

[View this guide on GitHub >](https://github.com/VScord-Inc/talk/blob/main/GitHub_Account_Settings.md)
