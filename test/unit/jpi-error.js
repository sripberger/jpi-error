import * as utils from '../../lib/utils';
import JpiError from '../../lib/jpi-error';

// We need a simple subclass to test inherited behavior.
class TestError extends JpiError {}

describe('JpiError', function() {
	describe('constructor', function() {
		const code = 42;
		const message = 'omg error';
		const defaultMessage = 'default message';
		const cause = new Error('Cause of error');
		const data = { foo: 'bar' };

		beforeEach(function() {
			// Register the code manually.
			TestError[code] = { message: defaultMessage };
		});

		afterEach(function() {
			// Unregister the code manually.
			delete JpiError[code];
		});

		it('extends Error with code, cause, and data', function() {
			const err = new TestError(code, message, cause, data);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(message);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.equal(data);
		});

		it('supports signature with no data', function() {
			const err = new TestError(code, message, cause);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(message);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.be.null;
		});

		it('supports signature with no cause', function() {
			const err = new TestError(code, message, data);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(message);
			expect(err.data).to.equal(data);
			expect(err.cause).to.be.null;
		});

		it('supports signature with no message', function() {
			const err = new TestError(code, cause, data);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.equal(data);
		});

		it('supports signature with code and message only', function() {
			const err = new TestError(code, message);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(message);
			expect(err.cause).to.be.null;
			expect(err.data).to.be.null;
		});

		it('supoprts signature with code and cause only', function() {
			const err = new TestError(code, cause);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.equal(cause);
			expect(err.data).to.be.null;
		});

		it('supports signature with code and data only', function() {
			const err = new TestError(code, data);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.be.null;
			expect(err.data).to.equal(data);
		});

		it('supports signature with code only', function() {
			const err = new TestError(code);

			expect(err).to.be.an.instanceof(Error);
			expect(err.code).to.equal(code);
			expect(err.message).to.equal(defaultMessage);
			expect(err.cause).to.be.null;
			expect(err.data).to.be.null;
		});

		it('throws if code is not a number', function() {
			expect(() => {
				// eslint-disable-next-line no-new
				new TestError('foo', message, cause, data);
			}).to.throw('Error code must be a number, received foo');
		});

		it('throws if code is not registered', function() {
			expect(() => {
				// eslint-disable-next-line no-new
				new TestError(404, message, cause, data);
			}).to.throw('Unknown error code: 404');
		});
	});

	describe('::_registerCode', function() {
		const existingName = 'EXISTING_ERROR';
		const existingCode = 0;
		const name = 'NEW_ERROR';
		const code = 404;
		const message = 'New error message!';
		const defaultMessage = 'default message';

		beforeEach(function() {
			// Register some existing error info manually.
			JpiError[existingName] = existingCode;
			JpiError[existingCode] = { name: existingName };

			// Stub utils::getDefaultMessage in case we need it.
			sinon.stub(utils, 'getDefaultMessage')
				.withArgs(name).returns(defaultMessage);
		});

		afterEach(function() {
			// Clean up any registered info manually.
			delete JpiError[existingName];
			delete JpiError[existingCode];
			delete TestError[name];
			delete TestError[code];
		});

		it('registers error code info directly on the constructor', function() {
			TestError._registerCode(name, { code, message, foo: 'bar' });

			expect(TestError[name]).to.equal(code);
			expect(TestError[code]).to.deep.equal({ name, message });
		});

		it('throws if name is not a string', function() {
			expect(() => {
				TestError._registerCode({}, { code, message });
			}).to.throw(
				'Error name must be a non-numeric string, ' +
				'received [object Object]'
			);
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('throws if name is a numeric string', function() {
			expect(() => {
				TestError._registerCode('1', { code, message });
			}).to.throw('Error name must be a non-numeric string');
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('throws if name is already in use', function() {
			expect(() => {
				TestError._registerCode(existingName, { code, message });
			}).to.throw(`Error name ${existingName} is already in use`);
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('throws if code is not a number', function() {
			expect(() => {
				TestError._registerCode(name, { code: 'whatever', message });
			}).to.throw('Error code must be a number, received whatever');
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('throws if code is already in use', function() {
			expect(() => {
				TestError._registerCode(name, { code: existingCode, message });
			}).to.throw(`Error code ${existingCode} is already in use`);
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('uses default message, if none is provided', function() {
			TestError._registerCode(name, { code });

			expect(TestError[name]).to.equal(code);
			expect(TestError[code]).to.deep.equal({
				name,
				message: defaultMessage,
			});
		});

		it('throws if message is provided, but is not a string', function() {
			expect(() => {
				TestError._registerCode(name, { code, message: false });
			}).to.throw('Error message must be a string, received false');
			expect(TestError).to.not.have.property(name);
			expect(TestError).to.not.have.property(code);
		});

		it('supports code-only shorthand', function() {
			TestError._registerCode(name, code);

			expect(TestError[name]).to.equal(code);
			expect(TestError[code]).to.deep.equal({
				name,
				message: defaultMessage,
			});
		});
	});
});
