---
title: TypeScript Config
---

We modify the basic TypeScript code style by changing the tsconfig.json file.

## TSConfig

Set strict to true, and further enhance strictness by modifying the following options:

- [allowUnreachableCode](https://www.typescriptlang.org/tsconfig#allowUnreachableCode)
- [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
- [noImplicitOverride](https://www.typescriptlang.org/tsconfig#noImplicitOverride)
- [noImplicitReturns](https://www.typescriptlang.org/tsconfig#noImplicitReturns)
- [noFallthroughCasesInSwitch](https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch)

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
