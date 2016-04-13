require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Github Resume Generator',
    description: 'Created using Redux & React',
    head: {
      titleTemplate: 'React Redux Example: %s',
      meta: [
        {name: 'description', content: 'Github resume generator, created using Redux & React'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'React Redux Example'},
        {property: 'og:image', content: ''},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Github resume generator'},
        {property: 'og:description', content: 'Github resume generator, created using Redux & React'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@martinrp_'},
        {property: 'og:creator', content: '@martinrp_'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
