---
title: TypeScript Config
description: How we modify our TypeScript code style with tsconfig.json.
---

How we modify our TypeScript code style with tsconfig.json.

## TSConfig

Set strict to true, and further increase strictness by modifying the following options:

- [allowUnreachableCode](https://www.typescriptlang.org/tsconfig#allowUnreachableCode)
- [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
- [noImplicitOverride](https://www.typescriptlang.org/tsconfig#noImplicitOverride)
- [noImplicitReturns](https://www.typescriptlang.org/tsconfig#noImplicitReturns)
- [noFallthroughCasesInSwitch](https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch)

```json:tsconfig.json
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
