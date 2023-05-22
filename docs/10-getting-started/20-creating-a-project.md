---
title: Creating a Project
---

## Prerequisites

- [MySQL Community Server 8.0.30](https://dev.mysql.com/downloads/mysql/) or higher
- [Node.js](https://nodejs.org/) 18.4.0 or higher
- npm 8.13.2 or higher

## Prerequisites for Text-to-Speech

- Set up [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)

## Prerequisites for Translation

- Set up [DeepL API](https://www.deepl.com/pro-api?cta=header-pro-api/)

## Setting up the project

Here are the steps:

1. Get the project and setup:

```bash
# Clone the repo to your current directory
git clone https://github.com/sinProject-Inc/talk.git

# Install the dependencies
cd /talk
npm install
```

1. Create a database with the name "talk"
1. Create a .env file by copying .env.example at the top level of the project
1. Rewrite the .env file with your environment variables
1. Push the initial schema and data to the database:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

1. Install [Redis](https://redis.io/), and run the command: `redis-server`
1. Run locally

```bash
# Start the server and open the app in a new browser tab
npm run dev -- --open
```
