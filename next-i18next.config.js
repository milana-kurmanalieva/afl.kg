module.exports = {
  i18n: {
    defaultLocale: 'ru',
    locales: [ 'ru', 'ky' ],
  },
  localePath:
  typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/public/locales',
  ns: [ 'common' ],
};
