<template>
  <v-layout row
            wrap>
    <v-flex xs12
            sm12
            md6
            offset-xs0
            offset-sm0
            offset-md3>
      <div class="white elevation-2">
        <v-toolbar flat
                   dense
                   class="cyan"
                   dark>
          <v-toolbar-title>Create poll</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-form autocomplete="off"
                  ref="form"
                  lazy-validation>
            <v-text-field v-model="question"
                          data-vv-name="question"
                          v-validate="{required: true}"
                          :error-messages="errors.collect('question')"
                          label="Topic">
            </v-text-field>
            <h3>Poll options</h3>
            <div v-for="(value, i) in options"
                 :key="i">
              <v-text-field v-model="options[i]"
                            append-icon="clear"
                            :append-icon-cb="() => removePoll(i)"></v-text-field>
            </div>
            <v-text-field label="Add a poll option"
                          v-model="option"
                          data-vv-name="option"
                          append-icon="add"
                          :append-icon-cb="addPoll"></v-text-field>

            <v-alert v-if="error !== null"
                     type="error"
                     :value="true"
                     v-html="error" />
            <v-btn class="cyan"
                   :disabled="errors.items.length > 0 || options.length === 0"
                   @click="createPoll">Start Poll</v-btn>
          </v-form>
        </div>
      </div>
      <v-snackbar 
        v-if="success"
        :timeout="3000"
                  :top="true"
                  :bottom="false"
                  :right="false"
                  :left="false"
                  :multiline="false"
                  :vertical="false"
                  v-model="success">
        The poll is created
        <v-btn flat
               color="pink"
               @click.native="success = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
import PollService from '@/services/PollService';

export default {
  name: 'CreatePoll',
  data() {
    return {
      question: null,
      options: [],
      option: null,
      error: null,
      success: true,
    };
  },
  methods: {
    async createPoll(event) {
      if (event) event.preventDefault();
      if (this.question && this.options.length > 0) {
        try {
          let poll = {
            question: this.question,
            choices: this.options,
          };
          const response = await PollService.createPoll(poll);
          this.success = true;
          this.question = null;
          this.options = [];
          // the response need to contains the poll list
        } catch (error) {
          this.error =
            error.response.data.error.msg ||
            'An error has occured, please try again later';
        }
      } else {
        this.error =
          'You need to fill the poll options and the question in order to create poll';
      }
      console.log('create poll');
    },
    removePoll: function(i) {
      console.log('remove poll i', i);
      this.options.splice(i, 1);
    },
    addPoll() {
      console.log('add poll');
      if (this.option !== null) {
        this.options.push(this.option);
        this.option = null;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
