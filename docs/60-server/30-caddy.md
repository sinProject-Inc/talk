---
title: Caddy
description: Caddy is an open-source, HTTP/2-enabled web server written in Go.
---

[Caddy](https://caddyserver.com/) is an open-source, HTTP/2-enabled web server. It's notable for its easy configuration, automatic HTTPS, and capability to serve static sites or reverse proxy.

[Caddy Quick Start >](https://caddyserver.com/docs/quick-starts)

## Installation

Get Caddy on Ubuntu:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## Starting Caddy Service

Check if Caddy service is running:

```bash
sudo systemctl status caddy
```

If it's not running, start it:

```bash
sudo systemctl enable --now caddy
```

Enabling the service will start Caddy automatically when the server boots up.

## Caddy Configuration

Edit the Caddyfile:

```bash
sudo micro /etc/caddy/Caddyfile
```

Add your site configurations:

```bash
example.dev {
	reverse_proxy :3001
}

talk.example.dev {
	reverse_proxy :3002
}

```

Finally, restart the Caddy service to apply the changes:

```bash
sudo systemctl restart caddy
```

[More info >](https://caddyserver.com/docs/getting-started)
