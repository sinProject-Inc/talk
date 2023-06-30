---
title: JPG/PNG to AVIF
description: When we handle image files, we use cavif-rs / Squoosh to convert them to AVIF files.
---

When we handle image files, we use [cavif-rs](https://github.com/kornelski/cavif-rs) / [Squoosh](https://squoosh.app/) to convert them to AVIF files.

## AVIF image format

A modern image format based on the AV1 video format. AVIF generally has better compression than WebP, JPEG, PNG and GIF and is designed to supersede them. AVIF competes with JPEG XL which has similar compression quality and is generally seen as more feature-rich than AVIF. (Source: [caniuse.com](https://caniuse.com/avif))

AVIF provides superior compression to WebP, retaining high image quality at lower file sizes. It supports up to 12-bit color depth, offers better transparency handling, and ensures efficient encoding and decoding, making it a more advanced choice.

### Can I use AVIF

Check browsers that support AVIF on [caniuse.com](https://caniuse.com/avif).

## cavif-rs

cavif-rs can be easily executed in the terminal.

### Install & Run

Please refer to [the GitHub of cavif-rs](https://github.com/kornelski/cavif-rs).

### How to use

Move to the path where the image file is located and execute as follows.

```bash
cd ~/development/talk/static
cavif icon-512.png
```

## Squoosh

[Squoosh](https://squoosh.app/) is a web application. You can adjust settings while viewing the image quality on the screen.
