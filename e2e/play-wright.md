# ドキュメント

https://playwright.dev/docs/intro
https://learn.microsoft.com/ja-jp/microsoft-edge/playwright/

# VS Code 拡張機能のインストール

```
Playwright Test for VSCode
```
VS Code 上でテスト対象を選択できるようになります。

# インストール

```
npm init playwright@latest

```

# テスト実行

VS Code 「Testing」タブを利用してテストを実行する。

https://playwright.dev/docs/running-tests

```
npx playwright test
npx playwright test <filename>
```

# テストファイル

targetDir に *.spec.ts ファイルを作成する。

# コード自動生成

npx playwright codegen <url>
npx playwright codegen http://localhost:5173/chat

# 実行中に止める

await page.pause();

# レポートを表示する

npx playwright show-report
