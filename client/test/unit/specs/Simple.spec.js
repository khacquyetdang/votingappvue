//require('babel-polyfill'); 
import Vue from 'vue';
import Simple from '@/components/Simple/app';

describe('Simple component', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Simple);
    const vm = new Constructor().$mount();
    console.log("vm el", vm.$el);
    console.log("vm el h1 text content", vm.$el.textContent);
    expect(vm.$el.textContent.includes('simple component'))
      .to.equal(true);
  });
});