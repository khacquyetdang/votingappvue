import Api from '@/services/Api';

export default {
  createPoll(poll) {
    return Api().post('/poll/create', poll);
  },
  list() {
    return Api().get('/poll/list');
  },

};
