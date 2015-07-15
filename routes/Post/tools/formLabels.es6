const assign = require('object-assign');

let labels = {

  author: {
    new: {
      legend: 'Добавление публикации',
      statusName: 'Новая публикация',
      buttonSave: {
        name: 'Сохранить',
        title: 'Сохранить изменения и просмотреть результат'
      },
      buttonCancel: {
        name: 'Отмена',
        title: 'Вернуться назад без сохранения изменений'
      },
      buttonPublish: {
        name: 'Опубликовать',
        title: 'Сохранить изменения и отправить на проверку'
      },
      buttonPreview: {
        name: 'Предварительный просмотр',
        title: 'Предварительный просмотр публикации с учетом текущих изменений без сохранения'
      },
      buttonGenerate: {
        name: 'заполнить аннотацию',
        title: 'Заполнить поле аннотации по тексту статьи'
      }
    }
  }
};

labels.author.draft = assign({}, labels.author.new, {
  statusName: 'Черновик',
  legend: 'Редактирование публикации'
});

labels.author.review = assign({}, labels.author.new, {statusName: 'На проверку'});
labels.author.reviewing = assign({}, labels.author.new, {statusName: 'Проверяется'});
labels.author.reviewed = assign({}, labels.author.new, {statusName: 'Проверено'});
labels.author.published = assign({}, labels.author.new, {statusName: 'Опубликовано'});
labels.author.deleted = assign({}, labels.author.new, {statusName: 'Удалено'});
labels.author.denied = assign({}, labels.author.new, {statusName: 'Отклонено'});
labels.author.discontinued = assign({}, labels.author.new, {statusName: 'Снято с публикации'});

// подписи для кнопок формы и титлы новостника ---------------------------------------------
labels.newsman = assign({}, labels.author);

// подписи для кнопок формы и титлы редактора ----------------------------------------------
labels.editor = assign({}, labels.author);
labels.editor.review.legend = 'Проверка публикации';

// подписи для кнопок формы и титлы шефа ---------------------------------------------------
labels.chef = assign({}, labels.editor);
labels.chef.new.buttonGenerate = {
  name: 'заполнить аннотацию, чпу и мета-теги',
  title: 'Заполнить поле аннотации, чпу и мета-теги по заголовку и тексту статьи'
};


module.exports = labels;