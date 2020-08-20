import {
	StyleOptions,
	PrettifyOptions,
	StylizeOptions,
	Options,
} from './types'


export function get_stylize_options_ansi(chalk: any): StylizeOptions {
	return {
		stylize_dim: (s: string) => chalk.dim(s),
		stylize_suspicious: (s: string) => chalk.bold(s),
		stylize_error: (s: string) => chalk.red.bold(s),
		stylize_global: (s: string) => chalk.magenta(s),
		stylize_primitive: (s: string) => chalk.green(s),
		stylize_syntax: (s: string) => chalk.yellow(s),
		stylize_user: (s: string) => chalk.blue(s),
	}
}
