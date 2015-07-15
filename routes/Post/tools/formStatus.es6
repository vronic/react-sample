const status = {
	author: {
		article: {
			save: 'draft',
			submit: 'review'
		},
		news: {
			save: 'draft',
			submit: 'review'
		}
	},
	newsman: {
		article: {
			save: 'draft',
			submit: 'review'
		},
		news: {
			save: 'draft',
			submit: 'review'
		}
	},
	editor: {
		article: {
			save: 'review',
			submit: 'reviewed'
		},
		news: {
			save: 'review',
			submit: 'reviewed'
		}
	},
	chef: {
		article: {
			save: 'reviewed',
			submit: 'published'
		},
		news: {
			save: 'reviewed',
			submit: 'published'
		}
	}
};

module.exports = status;