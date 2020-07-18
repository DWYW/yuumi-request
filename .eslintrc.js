module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": [
		"standard",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"no-unused-vars": "warn",
		"no-prototype-builtins": 'off',
		"@typescript-eslint/no-explicit-any": 'off'
	}
};