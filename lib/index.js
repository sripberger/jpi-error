import JpiError from './jpi-error';

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

export default JpiError;
