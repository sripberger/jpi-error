import * as utils from '../../lib/utils';

describe('utils', function() {
	describe('::getDefaultMessage', function() {
		it('returns default message based on all-caps name', function() {
			expect(utils.getDefaultMessage('OMG_BAD_ERROR'))
				.to.equal('Omg bad error');
		});

		it('returns default message based on camelcase name', function() {
			expect(utils.getDefaultMessage('omgBadError'))
				.to.equal('Omg bad error');
		});
	});

	describe('::convertErrorToObject', function() {
		let err;

		beforeEach(function() {
			err = new Error('Omg bad error!');
		});

		it('supports an error with just a message', function() {
			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
			});
		});

		it('includes code, if any', function() {
			err.code = 0;

			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
				code: err.code,
			});
		});

		it('includes data, if any', function() {
			err.data = { foo: 'bar' };

			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
				data: err.data,
			});
		});

		it('includes cause in data, if any', function() {
			err.cause = new Error('Some other error!');

			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
				data: { cause: { message: err.cause.message } },
			});
		});

		it('supports cause with other data', function() {
			err.data = { foo: 'bar', cause: 'to be overwritten' };
			err.cause = new Error('Some other error!');

			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
				data: {
					foo: 'bar',
					cause: { message: err.cause.message },
				},
			});
		});

		it('supports nested causes', function() {
			err.cause = new Error('Some other error!');
			err.cause.code = 42;
			err.cause.data = { foo: 'bar' };
			err.cause.cause = new Error('Nested error!');
			err.cause.cause.data = { baz: 'qux' };

			expect(utils.convertErrorToObject(err)).to.deep.equal({
				message: err.message,
				data: {
					cause: {
						code: err.cause.code,
						message: err.cause.message,
						data: {
							foo: 'bar',
							cause: {
								message: err.cause.cause.message,
								data: err.cause.cause.data,
							},
						},
					},
				},
			});
		});

		it('supports includeStacks argument', function() {
			err.cause = new Error('Some other error!');
			err.cause.data = { foo: 'bar' };

			expect(utils.convertErrorToObject(err, true)).to.deep.equal({
				message: err.message,
				data: {
					cause: {
						message: err.cause.message,
						data: {
							foo: 'bar',
							stack: err.cause.stack,
						},
					},
					stack: err.stack,
				},
			});
		});
	});
});
