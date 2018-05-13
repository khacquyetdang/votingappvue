import PollService from '@/services/PollService';
import Vue from 'vue';
import ListPoll from './List';

let AllPolls = Vue.extend({
  name: 'AllPolls',
  data() {
    return {
      error: null
    };
  },
  computed: {
    pollEmpty() {
      return !this.polls || this.polls.length === 0;
    },
    polls() {
      return this.$store.getters.getPolls;
    }
  },
  render: function(createElement) {
    return createElement(ListPoll, {
        props: {
            polls: this.polls
        }
    })
  },
  methods: {
    viewPoll(poll) {
      console.log("view poll", poll);
      const pollId = poll._id;
      this.$router.push({
        name: 'polldetail',
        params: {
          id: pollId,
          poll: poll
        }
      });
    },
    async getPolls() {
      try {
        const response = await PollService.list();
        console.log('polls response', response);
        let polls = response.data.polls;
        this.$store.dispatch('setPolls', polls);
        // this.polls = polls;
      } catch (error) {
        this.error = error.response.data.error.msg || 'An error has occured, please try again later';
      }
    }
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.getPolls();
  },
  updated() {
    console.log("updated");

  }
});

export default AllPolls;