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

- [ ] package のバージョンを 3 箇所書き換える。
- [ ] push する。
- [ ] PR を作成する。その際、Issue は Close しないので書き換えなくていい。
- [ ] PR は、何もチェックせずにマージする。

## GitHub

- [ ] Close されている PR で、機能拡張だと思われるものに Enhancement のラベルを付ける。
- [ ] GitHub のリリース 作成ページを開き、あたらしいタグを作成する。
- [ ] 自動生成されたリリースノートを Preview して問題がないかを確認する。
- [ ] 問題なければ、リリースを作成する。

## Server

- [ ] `ssh @dev@sinpro-dev` で接続する。
- [ ] cd ~/dev/talk
- [ ] git checkout main && git pull
- [ ] npm i
- [ ] npm run build
- [ ] pm2 restart talk

## Check

- [ ] サーバーの表示確認を行う

## 告知

- [ ] ドキュメントの追加や更新があれば、 #give-and-take でアナウンスする。
- [ ] SNS で告知するよう、プロダクトマネージャーに依頼する。

```markdown
@channel

Docs ガイドラインを更新しましたのでご案内いたします。
興味があるところ、業務に関係するところを確認しておいてくださいませ。

New

- Books

Update

- GitHub Actions - Secrets
- Git Branches and Commits - Script

確認が完了しましたらリアクションをお願い致します。
また、気になることがありましたらお気軽にご連絡くださいませ。
よろしくお願いいたします。

@岩崎 さん、SNS 告知お願い致します。
```
