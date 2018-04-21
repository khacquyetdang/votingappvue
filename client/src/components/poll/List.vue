<template>
  <v-layout justify-center>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex v-for="(poll, index) in $store.state.polls" :key="index" md4>
          <v-card class="mx-1" color="blue-grey lighten-5">
            <div>
              <h2>{{ poll.question }}</h2>
            </div>
            <v-btn color="info">
              View poll
            </v-btn>
            <div class="owner">
              Created by:
            </div>
            <div class="owner">{{ poll.owner.email}}</div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import PollService from '@/services/PollService';

export default {
  name: 'ListPoll',
  data() {
    return {
      error: null,
    };
  },
  created: function() {
    this.getPolls();
  },
  methods: {
    async getPolls() {
      try {
        const response = await PollService.list();
        console.log('polls response', response);
        let polls = response.data.polls;
        this.$store.dispatch('setPolls', polls);
      } catch (error) {
        this.error =
          error.response.data.error.msg ||
          'An error has occured, please try again later';
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  color: #0080ff;
  margin: 0px;
  padding: 16px;
}
@media only screen and (max-width: 599px) {
  .container {
    padding: 2px;
  }
}
.owner {
  color: gray;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
