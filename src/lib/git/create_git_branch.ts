import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

export class CreateGitBranch {
	private _to_kebab_case(str: string): string {
		return str
			.split(/[\s_]+/)
			.map((word) => word.toLowerCase())
			.join('-')
	}

	private _generate_branch_name(issue_string: string): string {
		// Issue名と番号を抽出
		const issue_parts = RegExp(/^(.*?)(#\d+)$/).exec(issue_string)

		if (!issue_parts) {
			throw new Error('Invalid issue string format')
		}

		const name_part = issue_parts[1]
		const number_part = issue_parts[2]

		if (!name_part || !number_part) {
			throw new Error('Invalid issue string format')
		}

		const issue_number = number_part.substring(1)
		const replaced_issue_name = name_part.replaceAll(/[/_]/g, '-').trim()
		const issue_name = replaced_issue_name.replaceAll(/[^a-zA-Z0-9- .]/g, '').trim()
		const kebab_case_issue_name = this._to_kebab_case(issue_name)

		// Issue番号とkebab-case形式のIssue名を組み合わせてブランチ名を生成
		const branch_name = `${issue_number}-${kebab_case_issue_name}`

		// eslint-disable-next-line no-console
		// console.info(branch_name)

		return branch_name
	}

	private async _create_git_branch(branch_name: string): Promise<void> {
		const exec = promisify(execCallback)

		try {
			const { stdout, stderr } = await exec(`git checkout -b ${branch_name}`)

			// eslint-disable-next-line no-console
			console.log(stderr || stdout)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn((error as Error).message)
		}
	}

	public async exec(issue_string: string): Promise<void> {
		const branch_name = this._generate_branch_name(issue_string)

		await this._create_git_branch(branch_name)
	}
}

const args = process.argv.slice(2) // 最初の2つの要素はNode.jsの実行パスとスクリプトのファイルパスなので、スライスで削除します。

if (args.length > 0) {
	const issue_string = args[0]

	if (!issue_string) {
		// eslint-disable-next-line no-console
		console.error('No branch string provided.')
		process.exit(1)
	}

	try {
		await new CreateGitBranch().exec(issue_string)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn((error as Error).message)
	}
} else {
	// eslint-disable-next-line no-console
	console.error('No branch string provided.')
	process.exit(1)
}
