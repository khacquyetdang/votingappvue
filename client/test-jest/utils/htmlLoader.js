const vueHtmlLoader = require('vue-template-loader');

module.exports = {
    process(src, filename, config, options) {
        return vueHtmlLoader(src);
    }
}