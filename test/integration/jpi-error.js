/* eslint max-classes-per-file: off */
import JpiError from '../../lib';

describe('JpiError', function() {
	it('supports standard JSON-RPC parse error', function() {
		const err = new JpiError(JpiError.PARSE_ERROR);

		expect(err.toObject()).to.deep.equal({
			code: -32700,
			message: 'Parse error',
		});
	});

	it('supports standard JSON-RPC invalid request error', function() {
		const err = new JpiError(JpiError.INVALID_REQUEST);

		expect(err.toObject()).to.deep.equal({
			code: -32600,
			message: 'Invalid request',
		});
	});

	it('supports standard JSON-RPC invalid request error', function() {
		const err = new JpiError(JpiError.INVALID_REQUEST);

		expect(err.toObject()).to.deep.equal({
			code: -32600,
			message: 'Invalid request',
		});
	});

	it('supports standard JSON-RPC method not found error', function() {
		const err = new JpiError(JpiError.METHOD_NOT_FOUND);

		expect(err.toObject()).to.deep.equal({
			code: -32601,
			message: 'Method not found',
		});
	});

	it('supports standard JSON-RPC invalid params error', function() {
		const err = new JpiError(JpiError.INVALID_PARAMS);

		expect(err.toObject()).to.deep.equal({
			code: -32602,
			message: 'Invalid params',
		});
	});

	it('supports standard JSON-RPC internal error', function() {
		const err = new JpiError(JpiError.INTERNAL_ERROR);

		expect(err.toObject()).to.deep.equal({
			code: -32603,
			message: 'Internal error',
		});
	});

	it('supports generic server error', function() {
		const err = new JpiError(JpiError.SERVER_ERROR);

		expect(err.toObject()).to.deep.equal({
			code: -32000,
			message: 'Server error',
		});
	});

	it('supports 404 not found server error', function() {
		const err = new JpiError(JpiError.NOT_FOUND);

		expect(err.toObject()).to.deep.equal({
			code: -32001,
			message: 'Not found',
		});
	});

	it('supports 405 method not allowed server error', function() {
		const err = new JpiError(JpiError.METHOD_NOT_ALLOWED);

		expect(err.toObject()).to.deep.equal({
			code: -32002,
			message: 'Method not allowed',
		});
	});

	it('supports failed request server error', function() {
		const err = new JpiError(JpiError.FAILED_REQUEST);

		expect(err.toObject()).to.deep.equal({
			code: -32003,
			message: 'Failed to read request body',
		});
	});

	it('throws when code is unknown', function() {
		expect(() => {
			new JpiError(42); // eslint-disable-line no-new
		}).to.throw('Unknown error code: 42');
	});

	it('suports custom message', function() {
		const message = 'omg bad error!';

		const err = new JpiError(JpiError.SERVER_ERROR, message);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message,
		});
	});

	it('supports data', function() {
		const data = { foo: 'bar' };

		const err = new JpiError(JpiError.SERVER_ERROR, data);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data,
		});
	});

	it('supports custom message and data', function() {
		const message = 'omg bad error!';
		const data = { foo: 'bar' };

		const err = new JpiError(JpiError.SERVER_ERROR, message, data);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message,
			data,
		});
	});

	it('supports cause chains', function() {
		const cause = new Error('omg bad error!');
		cause.code = 42;
		cause.data = { foo: 'bar' };
		cause.cause = new Error('how could this happen?');

		const err = new JpiError(JpiError.SERVER_ERROR, cause);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data: {
				cause: {
					code: cause.code,
					message: cause.message,
					data: {
						foo: 'bar',
						cause: { message: cause.cause.message },
					},
				},
			},
		});
	});

	it('supports custom message and cause', function() {
		const message = 'omg bad error!';
		const cause = new Error('There\'s your problem right there.');

		const err = new JpiError(JpiError.SERVER_ERROR, message, cause);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message,
			data: { cause: { message: cause.message } },
		});
	});

	it('supports data and cause', function() {
		const cause = new Error('omg bad error!');

		const err = new JpiError(JpiError.SERVER_ERROR, cause, { foo: 'bar' });

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data: {
				foo: 'bar',
				cause: { message: cause.message },
			},
		});
	});

	it('prioritizes actual cause over `cause` property in data', function() {
		const cause = new Error('omg bad error!');

		const err = new JpiError(JpiError.SERVER_ERROR, cause, {
			foo: 'bar',
			cause: 'whatever',
		});

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data: {
				foo: 'bar',
				cause: { message: cause.message },
			},
		});
	});

	it('supports custom message, cause, and data', function() {
		const message = 'omg bad error!';
		const cause = new Error('There\'s your problem right there.');

		const err = new JpiError(JpiError.SERVER_ERROR, message, cause, {
			foo: 'bar',
		});

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message,
			data: {
				foo: 'bar',
				cause: { message: cause.message },
			},
		});
	});

	it('supports includeStacks argument', function() {
		const cause = new Error('omg bad error!');

		const err = new JpiError(JpiError.SERVER_ERROR, cause);

		expect(err.toObject(true)).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data: {
				stack: err.stack,
				cause: {
					message: cause.message,
					data: { stack: cause.stack },
				},
			},
		});
	});

	it('priortizes actual stack over `stack` property in data', function() {
		const err = new JpiError(JpiError.SERVER_ERROR, {
			foo: 'bar',
			stack: 'whatever',
		});

		expect(err.toObject(true)).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
			data: { foo: 'bar', stack: err.stack },
		});
	});

	it('has isJpiError property for easy identification of caught errors', function() {
		const err = new JpiError(JpiError.SERVER_ERROR);

		expect(err.isJpiError).to.be.true;
	});

	it('supports error code references through subclasses', function() {
		class TestError extends JpiError {}

		const err = new TestError(TestError.SERVER_ERROR);

		expect(err.toObject()).to.deep.equal({
			code: JpiError.SERVER_ERROR,
			message: 'Server error',
		});
	});

	it('supports registration of new error codes on subclasses', function() {
		class TestError extends JpiError {}
		TestError.register({
			FOO_ERROR: { code: 42, message: 'bad stuff happened, oh no' },
			BAR_ERROR: { code: 101 },
			bazError: 12345,
		});

		// Error code with provided default message.
		const fooError = new TestError(TestError.FOO_ERROR);
		expect(fooError.toObject()).to.deep.equal({
			code: 42,
			message: 'bad stuff happened, oh no',
		});

		// Error code with default message based on all uppercase name.
		const barError = new TestError(TestError.BAR_ERROR);
		expect(barError.toObject()).to.deep.equal({
			code: 101,
			message: 'Bar error',
		});

		// Error code with default message based on camelcase name.
		const bazError = new TestError(TestError.bazError);
		expect(bazError.toObject()).to.deep.equal({
			code: 12345,
			message: 'Baz error',
		});

		// Ensure registration only happens on the subclass, not the base.
		expect(() => {
			new JpiError(JpiError.FOO_ERROR); // eslint-disable-line no-new
		}).to.throw('Error code must be a number, received undefined');
		expect(() => {
			new JpiError(TestError.FOO_ERROR); // eslint-disable-line no-new
		}).to.throw('Unknown error code: 42');

		// Ensure registration fails if code is already in use..
		expect(() => {
			TestError.register({ INVALID_ERROR: { code: 42 } });
		}).to.throw('Error code 42 is already in use.');
		expect(() => {
			TestError.register({ INVALID_ERROR: -32000 });
		}).to.throw('Error code -32000 is already in use.');

		// Ensure registration fails if name is already in use.
		expect(() => {
			TestError.register({ FOO_ERROR: { code: 13 } });
		}).to.throw('Error name \'FOO_ERROR\' is already in use.');
		expect(() => {
			TestError.register({ SERVER_ERROR: 13 });
		}).to.throw('Error name \'SERVER_ERROR\' is already in use.');
	});
});
