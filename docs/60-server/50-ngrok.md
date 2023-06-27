---
title: ngrok
description: ngrok is a simplified API-first ingress-as-a-service that adds connectivity, security, and observability to your apps in one line
---

[ngrok](https://ngrok.com/) is a simplified API-first ingress-as-a-service that adds connectivity, security, and observability to your apps in one line.

We use ngrok during local development when we need to temporarily preview the display on a mobile device.

## Installation

1. Sign up at [ngrok.com](https://ngrok.com/).
2. Sign in to [ngrok.com](https://ngrok.com/).
3. Open [Setup & Installation](https://dashboard.ngrok.com/get-started/setup).
4. Refer to the aforementioned page for instructions on how to download, install, and configure the authtoken.

## Fire it up

To start a HTTP tunnel forwarding to your local port 5173, run this next:

```bash
ngrok http 5173
```
