require('babel-polyfill'); 
import Vue from 'vue';
import AboutPage from '@/components/About';

describe('AboutPage component', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(AboutPage);
    const vm = new Constructor().$mount();
   // console.log("vm el", vm.$el);
    console.log("vm el h1 text content", vm.$el.querySelector('.home h1').textContent);
    expect(vm.$el.querySelector('.home h1').textContent)
      .toEqual('Welcome to Your Vue.js App');
  });
});
