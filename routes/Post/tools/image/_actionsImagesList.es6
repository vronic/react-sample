const Reflux = require('reflux');

const ImagesListActions = Reflux.createActions({

	'removeImage': {
		asyncResult: true,
	},
	'removeCheckedImages': {
		asyncResult: true,
	},

	'clearImages': {
		asyncResult: true,
		children: ["progressed"],
	},

	'loadImages': {
		asyncResult: true,
	},

	'checkAllImages': {},
	'checkImage': {},

	'cancelEditField': {},
	
	'saveEditField': {
		asyncResult: true,
	},
});

module.exports = ImagesListActions;