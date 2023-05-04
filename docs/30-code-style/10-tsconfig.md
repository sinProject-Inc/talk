---
title: TypeScript Config
---

How we modify our TypeScript code style with tsconfig.json.

## TSConfig

Set strict to true, and further increase strictness by modifying the following options:

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
