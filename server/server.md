# Server

## シングル起動

`npm start`

実際は `npx tsx server.ts `

## クラスター起動

PM2 を利用します。

# PM2

## Quick Start

[PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)

## Installation

npm install pm2@latest -g

## ecosystem file

- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)

ecosystem.config.ts

## tsc を使う

- ecosystem.config.cjs を作成する。
- script, interpreter, interpreterArgs を指定する。

## start

pm2 start ecosystem.config.cjs

## monitoring

pm2 monit

pm2 plus (not free)
