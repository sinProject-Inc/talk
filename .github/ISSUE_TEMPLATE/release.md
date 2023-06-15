---
name: Release issue template
about: Describe this issue template's purpose here.
title: 'Release v0.XX.0'
labels: 'maintenance'
assignees: ''
---

# Tasks

## Tasks

- [ ] package のバージョンを 3 箇所書き換える。
- [ ] push して、PR でマージする。

## GitHub

- [ ] Close されている PR にラベルを付ける。
- [ ] リリースを作成する。

## Server

- [ ] cd ~/dev/talk
- [ ] git checkout main
- [ ] git pull
- [ ] npm i
- [ ] npm run build
- [ ] pm2 restart talk

## Check

- [ ] サーバーの表示確認を行う
- [ ] SNS で告知する

# Writing the Issue

- [ ] Write each task for this issue using checkboxes
- [ ] Write all verbal instructions as tasks

# Before Working on the Issue

- [ ] Assign yourself
- [ ] Share your screen on Discord
- [ ] Write which issue you are starting on Slack
- [ ] Git: Fetch the latest main
- [ ] Git: Create a branch with the name of the issue

# Pre-PR Checks

- [ ] Insure that changes include only what is necessary for this PR
- [ ] Implement necessary Unit tests
- [ ] Implement necessary E2E tests
- [ ] Perform functionality checks
