import _ from 'lodash';
import decamelize from 'decamelize';

export function getDefaultMessage(name) {
	return _.capitalize(decamelize(name).replace(/_/g, ' '));
}

export function convertErrorToObject(err, includeStacks = false) {
	const obj = { message: err.message };
	if (_.isNumber(err.code)) obj.code = err.code;
	if (err.data) obj.data = err.data;

	const extraData = {};
	if (err.cause) {
		extraData.cause = convertErrorToObject(err.cause, includeStacks);
	}
	if (includeStacks) extraData.stack = err.stack;
	if (!_.isEmpty(extraData)) {
		obj.data = _.assign({}, obj.data, extraData);
	}

	return obj;
}
