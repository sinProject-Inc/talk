---
title: Stylelint
description: How we use Stylelint to automate formatting for CSS.
---

How we use [Stylelint](https://github.com/stylelint/stylelint) to automate formatting for CSS.

## Installation

```bash
npm i stylelint --save-dev
npm i stylelint-config-standard --save-dev
```

## Configuration

```json:.stylelintrc.json
{
	"extends": ["stylelint-config-standard"],
	"rules": {
		"at-rule-no-unknown": [
			true,
			{
				"ignoreAtRules": ["extends", "tailwind"]
			}
		]
	}
}
```
