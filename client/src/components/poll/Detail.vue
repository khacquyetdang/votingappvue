<template>
    <v-layout row="row"
        wrap="wrap"
        class="piechartdetail">
        <v-flex xs12
            sm12="sm12"
            md12="md12"
            justify-center
            align-center>
            <div v-if="poll">
                <h1>
                    {{ poll.question}}</h1>
                <v-layout row
                    justify-center
                    align-center>
                    <pie-chart :chart-data="datacollection"
                        :options="pieoptions"></pie-chart>
                </v-layout>
                <v-layout justify-center
                    align-center
                    row
                    wrap>
                    <v-btn sm6
                        round
                        v-for="(label, index) in datacollection.labels"
                
                        :key="index"
                        :style="{ backgroundColor: datacollection.datasets[0].backgroundColor[index] }"
                
                        @click="() => vote(choiceIdByIndex(index))">{{ label }}
                    </v-btn>
                </v-layout>
                <v-flex md4
                    xs12
                    sm12
                    offset-md4>
                    <v-form autocomplete="off"
                        ref="form"
                        lazy-validation="lazy-validation">

                        <v-text-field placeholder="New choice"
                            v-model="newchoice"
                            data-vv-name="newchoice"
                            v-validate="'required|min:6'"
                            data-vv-delay="100"
                            data-vv-rules="required"
                            solo
                            required
                            append-icon="send"
                            :append-icon-cb="newchoiceSend"
                            :error-messages="errors.collect('newchoice')"
                    
                            class="newchoice"></v-text-field>
                            <v-btn 
                            v-if="showRemovedBtn"
                            block
                            round
                            @click="() => remove()"
                            color="error"
                            > Remove poll
                            </v-btn>
                        <v-alert class="customerror"
                            v-if="error !== null"
                            type="error"
                            :value="true"
                            v-html="error" />

                    </v-form>
                </v-flex>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
  import PollService from '@/services/PollService';
  import PieChart from './PieChart';
  import randomColor from 'randomcolor';
  export default {
    name: 'PollDetail',
    props: ['id'],
    components: {
      PieChart
    },
    data() {
      return {
        newchoice: null,
        error: null,
        datacollection: null,
        poll: null,
        pieoptions: {
          responsive: true,
          maintainAspectRatio: false
        },
      };
    },
    computed: {
      showRemovedBtn: function() {
        let isShow = this.poll && this.poll.owner === this.$store.getters.getIdUser;
        return isShow;
      }
    },
    mounted() {
      this.getPoll();
    },
    watch: {
      newchoice: function(val) {
        this.error = null;
      }
    },
    methods: {
      newchoiceSend() {
        this.newchoice = this.newchoice.trim();
        if (this.newchoice === null || this.newchoice.length < 4) {
          this.error = "The new choice must have more than 3 characters."
        } else {
          let elementExisted = this.poll.choices.some(function(choice) {
            return choice.text.trim().toLowerCase() === this.newchoice.toLowerCase();
          }.bind(this));
          if (elementExisted) {
            this.error = "This choice is already existed."
          } else {
            this.vote(null);
          }
        }
      },
      choiceIdByIndex(index) {
        try {
          return this.poll.choices[index]._id
        } catch (error) {
          console.log('error', index);
        }
        return null;
      },
      async getPoll() {
        try {
          const response = await PollService.pollDetail(this.$props['id']);
          console.log('poll detail response', response);
          this.poll = response.data;
          this.fillData();
        } catch (error) {
          this.error = error.response.data.error.msg || 'An error has occured, please try again later';
        }
      },
      async vote(choiceId) {
        try {
          console.log("vote choiId", choiceId);
          const response = await PollService.vote(this.$props['id'], choiceId, this.newchoice);
          console.log('poll detail response', response);
          this.poll = response.data.poll;
          this.fillData();
          this.newchoice = "";
        } catch (error) {
          this.error = error.response.data.error.msg || 'An error has occured, please try again later';

        }
      },
      async remove() {
        try {
          let pollId = this.$props['id'];
          console.log("remove poll pollid", pollId);
          const response = await PollService.remove(pollId);
          console.log('poll removed response', response);
          this.$router.go(-1); 
        } catch (error) {
          this.error = error.response.data.error.msg || 'An error has occured, please try again later';
        }
      },
      fillData() {
        if (this.poll) {
          let labels = [];
          let backgroundColor = [];
          let data = [];
          this.poll.choices.forEach((choice) => {
            labels.push(choice.text);
            backgroundColor.push(randomColor());
            data.push(choice.votes.length);
          });
          this.datacollection = {
            labels: labels,
            datasets: [{
              backgroundColor: backgroundColor,
              data: data
            }]
          }
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
  .piechartdetail {
    color: #424242;
  }

  .newchoice {
    border: solid #42a5f5 2px;
    border-radius: 8px;
  }

  .customerror {
    padding: 4px;
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