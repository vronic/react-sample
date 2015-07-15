const Reflux = require('reflux');

const ImageActions = Reflux.createActions({

	'addImage': {},

	'removeImage': {},

	'clearImages': {},

	'uploadImages': {
		asyncResult: true,
		children: ["progressed"],
	},
});

module.exports = ImageActions;
