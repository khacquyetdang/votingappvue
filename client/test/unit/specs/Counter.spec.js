//import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon';
import Counter from '@/Counter.vue'

describe('Counter.vue', () => {
  it('increments count when button is clicked', () => {
    const spy = sinon.spy(Counter.methods, 'increment')
    const wrapper = shallowMount(Counter)
    wrapper.find('button').trigger('click')
    expect(wrapper.find('div').text()).contains('1');

//    const btnClick = sinon.stub();


    const button = wrapper.find('button');
    button.trigger('click');
    expect(spy).to.have.been.called;
    //expect(btnClick.called).toBe(true);
  })
})