//require('babel-polyfill'); 
import Vue from 'vue';
import SimpleExtend from '@/components/SimpleExtend/app';

describe('SimpleExtend component', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(SimpleExtend);
    const vm = new Constructor().$mount();
    console.log("vm el", vm.$el);
    console.log("vm el h1 text content", vm.$el.textContent);
    expect(vm.$el.textContent.includes('simple extend component'))
      .to.equal(true);
  });
});