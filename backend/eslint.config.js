import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
	},
	eslintConfigPrettier,
];