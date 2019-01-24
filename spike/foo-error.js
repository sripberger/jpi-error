import JpiError from '../lib';

export default class FooError extends JpiError {}

FooError.register({
	DERP_ERROR: {
		code: 500,
		message: 'You herped when you should have derped',
	},
});
