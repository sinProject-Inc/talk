---
title: TTF to WOFF2
description: When we handle font files, we use google/woff2 to convert them to WOFF2 files.
---

When we handle font files, we use [google/woff2](https://github.com/google/woff2) to convert them to WOFF2 files.

## Build & Run

Please refer to [the GitHub of google/woff2](https://github.com/google/woff2).

## Make it even easier to use

Add a path to the `.zshrc` file to make it easier to use.

```bash
export PATH="$PATH:/Users/iwasakishinya/development/woff2"
```

Move to the path where the font file is located and execute as follows.

```bash
cd ~/development/talk/static/fonts
woff2_compress my_font.ttf
```
