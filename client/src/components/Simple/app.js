import Vue from 'vue';
import BaseTemplate from './template.html';
export default Vue.extend({
  template: BaseTemplate,
  data() {
    return {
      name: "Simple Component"
    };
  }
});