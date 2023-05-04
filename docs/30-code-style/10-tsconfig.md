---
title: tsconfig
---

Set strict to true, and additionally enable the following options:

```json
/// tsconfig.json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"strict": true,

		"allowUnreachableCode": false,
		"exactOptionalPropertyTypes": true,
		"noImplicitOverride": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true
		// "noUncheckedIndexedAccess": true,
	}
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/tsconfig.json)
