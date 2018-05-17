import Vue from 'vue';
import AboutPage from '@/components/About';

describe('AboutPage component', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(AboutPage);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App');
  });
});
