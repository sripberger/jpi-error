import _ from 'lodash';

export default class JpiError extends Error {
	constructor(code, ...args) {
		super();
		// eslint-disable-next-line no-underscore-dangle
		const registry = this.constructor._ensureRegistry();
		const info = registry[code];
		if (!info) throw new Error(`Unknown error code ${code}`);
		this.code = code;
		this.message = _.isString(args[0]) ? args.shift() : info.message;
		this.cause = args[0] instanceof Error ? args.shift() : null;
		[ this.data ] = args;
	}

	static register(codes) {
		for (const name in codes) {
			this._registerCode(name, codes[name]);
		}
	}

	toObject(includeStacks = false) {
		// eslint-disable-next-line no-underscore-dangle
		return JpiError._convertToObject(this, includeStacks);
	}

	static _ensureRegistry() {
		if (!this._registry) {
			this._registry = Object.create(super._registry || null);
		}
		return this._registry;
	}

	static _registerCode(name, info) {
		if (_.isNumber(info)) info = { code: info };
		const { code, message = _.capitalize(name.replace('_', ' ')) } = info;
		const registry = this._ensureRegistry();
		if (registry[code]) {
			throw new Error(`Error code ${code} already in use.`);
		}
		if (this[name]) {
			throw new Error(`Error code name '${name}' already in use.`);
		}
		registry[code] = { name, message };
		this[name] = code;
	}

	static _convertToObject(err, includeStacks = false) {
		const obj = { message: err.message };
		if (err.code) obj.code = err.code;
		if (err.data) obj.data = err.data;

		const additionalData = {};
		if (err.cause) {
			// eslint-disable-next-line no-underscore-dangle
			additionalData.cause = JpiError._convertToObject(
				err.cause,
				includeStacks
			);
		}
		if (includeStacks) additionalData.stack = err.stack;

		if (!_.isEmpty(additionalData)) {
			obj.data = _.assign({}, obj.data || {}, additionalData);
		}

		return obj;
	}
}

JpiError.register({
	// Standard JSON-RPC errors.
	PARSE_ERROR: -32700,
	INVALID_REQUEST: -32600,
	METHOD_NOT_FOUND: -32601,
	INVALID_PARAMS: -32602,
	INTERNAL_ERROR: -32603,

	// Implementation-defined server errors.
	SERVER_ERROR: -32000,
	NOT_FOUND: -32001,
	METHOD_NOT_ALLOWED: -32002,
	FAILED_REQUEST: { code: -32003, message: 'Failed to read request body' },
});
