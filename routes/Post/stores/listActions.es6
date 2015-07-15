const Reflux = require('reflux');


const Actions = Reflux.createActions({

	'loadPublications': { asyncResult: true }
});

module.exports = Actions;