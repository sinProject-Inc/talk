---
name: Release issue template
about: Describe this issue template's purpose here.
title: 'Release v0.XX.0'
labels: 'maintenance'
assignees: ''
---

# Before Working on the Issue

- [ ] Assign yourself
- [ ] Share your screen on Discord
- [ ] Write which issue you are starting on Slack
- [ ] Git: Fetch the latest main
- [ ] Git: Create a branch with the name of the issue

# Tasks

## Tasks

- [ ] `npm version minor` or `npm version patch` で package のバージョンを 3 箇所書き換える。
- [ ] push する。
- [ ] PR を作成する。その際、Issue は Close しないので書き換えなくていい。
- [ ] PR は、何もチェックせずにマージする。
- [ ] 作成された タグを origin に push する。

## GitHub

- [ ] [Close されている PR 一覧](https://github.com/sinProject-Inc/talk/pulls?q=is%3Apr+sort%3Aupdated-desc+is%3Aclosed) で、機能拡張だと思われるものに `enhancement` のラベルを付ける。
- [ ] [GitHub のリリース 作成ページ](https://github.com/sinProject-Inc/talk/releases)を開き、`Draft a new release` ボタンをクリックする。
- [ ] `Choose a tag` で、新規作成したタグを選択する。
- [ ] `Generate release notes` ボタンを押す。
- [ ] 自動生成されたリリースノートの Release に関する項目を削除する。
- [ ] Preview して問題がないかを確認する。
- [ ] 問題なければ、`Publish release` ボタンを押してリリースを作成する。

## Server

- [ ] `ssh dev@sinpro-dev` で接続する。
- [ ] cd ~/dev/talk
- [ ] git checkout main && git pull
- [ ] npm i --legacy-peer-deps
- [ ] npm run build
- [ ] pm2 restart talk

## Check

- [ ] サーバーの表示確認を行う
