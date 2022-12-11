<div align="center">
  <img src="https://sinproject.net/wp-content/uploads/2019/12/sinProject-01-640x677.png" width="400">
  <h1>Talk</h1>
  <br />
</div>

## What is Talk?

This is a listening and speaking language learning app.

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

2. Create a database named talk
3. Create a .env file by copying .env.example at the top level of the project
4. rewrite the env file.
5. Push the initial schema to the database:

```bash
npx prisma db push
```

6. Run locally

```bash
# Start the server and open the app in a new browser tab
npm run dev -- --open
```

7. Insert initial data only for the first time
- visit http://localhost:5173/init_db 

## Feedback

👉 [**Ask a question**](https://github.com/sinProject-Inc/talk/discussions/new)

👉 [**Request a new feature**](https://github.com/sinProject-Inc/talk/issues/new)

👉 [**Upvote popular feature requests**](https://github.com/sinProject-Inc/talk/issues/)

👉 [**Create a bug report**](https://github.com/sinProject-Inc/talk/issues/new)

👉 [**Become a sponsor**](https://github.com/sponsors/sinproject-iwasaki)

## License

Copyright (c) sinProject Inc. All rights reserved.

Licensed under the [MIT](https://github.com/sinProject-Inc/talk/blob/main/LICENSE) license.


