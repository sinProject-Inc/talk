---
title: 'SSH'
---

## SSH Key Generation

```shell
$ mkdir ~/.ssh
$ cd ~/.ssh
$ ssh-keygen -t rsa
Enter file: ubuntu@sinpro-dev
Enter passphrase: ********
```

```bash
ssh -i ~/.ssh/ubuntu@sinpro-dev ubuntu@153.127.***.***
```

## Using the SSH Config File

Create a new SSH client configuration: `~/.ssh/config`

```config
Host sinpro-dev
	HostName 153.127.***.***
	Port ****
	IdentityFile ~/.ssh/dev@sinpro-dev
	User dev
```

You can connect with the following command:

```bash
ssh sinpro-dev
```

## Port changing

### Packet Filtering

Set up a packet filter so you can connect to the destination port.

### Installing netstat on Ubuntu

```shell
# sudo apt update && sudo apt upgrade
# sudo apt install net-tools
```

[More Info >](https://utho.com/docs/tutorial/how-to-install-netstat-on-ubuntu-20-04-lts/)

### Run the netstat

The SSH server on Ubuntu listen on TCP port 22 by default. You can run the netstat command to check ssh port currently running on:

```shell
# sudo netstat -tulnp | grep ssh
```

### Configurations

Open the file:

```shell
# sudo micro /etc/ssh/sshd_config
```

Edit the file:

```md
Port XXXX
```

### Restart the SSH server

```shell
# sudo systemctl restart ssh
```

### Confirm that the port has been changed

```shell
# sudo netstat -tulnp | grep ssh
```

## VSCode configuration

Install [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) VSCode Extension.

This extension allows you to use VSCode by connecting via SSH.
