---
title: TTF to WOFF2
description: When we handle font files, we use google/woff2 to convert them to WOFF2 files.
---

When we handle font files, we use [google/woff2](https://github.com/google/woff2) to convert them to WOFF2 files.

## WOFF 2.0 - Web Open Font Format

TrueType/OpenType font that provides better compression than WOFF 1.0.

WOFF2 improves upon WOFF with more effective compression, reducing font file sizes by approximately 30%. This leads to faster load times, enhancing website performance. Additionally, it supports all variations of glyph, increasing its versatility.

### Can I use WOFF 2.0

Check browsers that support WOFF 2.0 on [caniuse.com](https://caniuse.com/woff2).

## google/woff2

### Build & Run

Please refer to [the GitHub of google/woff2](https://github.com/google/woff2).

### Make it even easier to use

Add a path to the `.zshrc` file to make it easier to use.

```bash
export PATH="$PATH:/Users/iwasakishinya/development/woff2"
```

### How to use

Move to the path where the font file is located and execute as follows.

```bash
cd ~/development/talk/static/fonts
woff2_compress my_font.ttf
```
