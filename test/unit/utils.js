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
});
