import _ from 'lodash';
import { getDefaultMessage } from './utils';

export default class JpiError extends Error {
	constructor(code, ...args) {
		validateCode(code);
		super();
		const info = this.constructor[code];
		if (!info) throw new Error(`Unknown error code: ${code}`);
		this.code = code;
		this.message = _.isString(args[0]) ? args.shift() : info.message;
		this.cause = args[0] instanceof Error ? args.shift() : null;
		this.data = args[0] || null;
	}

	static _registerCode(name, info) {
		if (_.isNumber(info)) info = { code: info };
		const { code, message = getDefaultMessage(name) } = info;
		validate(name, code, message);
		if (name in this) {
			throw new Error(`Error name ${name} is already in use.`);
		}
		if (code in this) {
			throw new Error(`Error code ${code} is already in use.`);
		}
		this[name] = code;
		this[code] = { name, message };
	}
}

function validateCode(code) {
	if (!_.isNumber(code)) {
		throw new Error(`Error code must be a number, received ${code}`);
	}
}

function validateName(name) {
	if (!_.isString(name) || !(/[^0-9.]/).test(name)) {
		throw new Error(
			`Error name must be a non-numeric string, received ${name}`
		);
	}
}

function validateMessage(message) {
	if (!_.isString(message)) {
		throw new Error(`Error message must be a string, received ${message}`);
	}
}

function validate(name, code, message) {
	validateName(name);
	validateCode(code);
	validateMessage(message);
}
