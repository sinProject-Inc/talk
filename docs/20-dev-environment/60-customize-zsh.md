---
title: Customize Zsh
---

## oh-my-zsh

Oh My Zsh is a delightful, open source, community-driven framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins, themes, and a few things that make you shout... [More Info >](https://ohmyz.sh/)

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## zsh-completions

Additional completion definitions for Zsh. [More Info >](https://github.com/zsh-users/zsh-completions)

```bash
brew install zsh-completions
```

To activate these completions, add the following to your .zshrc:

```bash
if type brew &>/dev/null; then
	FPATH=$(brew --prefix)/share/zsh-completions:$FPATH

	autoload -Uz compinit
	compinit
fi
```

## zsh-autosuggestions

It suggests commands as you type based on history and completions. [More Info >](https://github.com/zsh-users/zsh-autosuggestions)

```bash
brew install zsh-autosuggestions
```

To activate the autosuggestions, add the following at the end of your .zshrc:

```bash
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```

## zsh-syntax-highlighting

Fish shell-like syntax highlighting for Zsh. [More Info >](https://github.com/zsh-users/zsh-syntax-highlighting)

```bash
brew install zsh-syntax-highlighting
```

you may need to add the following to your .zshenv:

```bash
export ZSH_HIGHLIGHT_HIGHLIGHTERS_DIR=/opt/homebrew/share/zsh-syntax-highlighting/highlighters
```
