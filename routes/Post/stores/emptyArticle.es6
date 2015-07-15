const cuid = require('cuid');

const empty = {

    type: 'article',
    status: 'new',
    hash: cuid(),

    author: $('body').data('user'),
    actor: $('#tw-publications').data('user-group'),

    legend: 'Добавление публикации',

    title: '',
    textBBCode: '',
    textHTML: '',
    srcAuthor: '',
    srcOrigin: '',
    srcTranslate: '',
    srcPhoto: '',

    annotation: '',

    categories: '', //{},
    humanUrl: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',

    created: ~~(Date.now() / 1000)
};

module.exports = empty;