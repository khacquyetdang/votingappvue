import Vue from 'vue';
import PollService from '@/services/PollService';
import ListPoll from './List';

let MyPolls = Vue.extend ({
  name: 'MyPolls',
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
      return this.$store.getters.getMyPolls;
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
        const response = await PollService.mypolls();
        console.log('my polls response', response);
        let polls = response.data.polls;
        this.$store.dispatch('setMyPolls', polls);
        // this.polls = polls;
      } catch (error) {
        this.error = error.response.data.error.msg || 'An error has occured, please try again later';
      }
    }
  },
  created() {
    console.log("mypolls created");
  },
  mounted() {
    console.log("mypolls mounted");
    this.getPolls();
  },
  updated() {
    console.log("mypolls updated");

  }
});

export default MyPolls;