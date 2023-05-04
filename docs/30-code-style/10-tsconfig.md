---
title: TypeScript Config
---

We modify the basic TypeScript code style by changing the tsconfig.json file.

## TSConfig

Set strict to true, and further enhance strictness by modifying the following options:

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

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/tsconfig.json)
