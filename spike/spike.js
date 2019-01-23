import FooError from './foo-error';

const cause = new Error('whatever');
cause.data = { bar: 'baz' };
const err = new FooError(FooError.SERVER_ERROR, cause, { foo: 'bar' });

console.log(err.toObject()); // eslint-disable-line no-console
