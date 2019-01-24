import _ from 'lodash';
import decamelize from 'decamelize';

export function getDefaultMessage(name) {
	return _.capitalize(decamelize(name).replace(/_/g, ' '));
}
