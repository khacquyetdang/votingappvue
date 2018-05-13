<template>
    <v-layout justify-center="justify-center">
        <v-container grid-list-md="grid-list-md"
            text-xs-center="text-xs-center">
            <v-layout v-if="pollEmpty"
                row="row"
                justify-center
                wrap="wrap">
                <v-card :raised="true">
                    <v-card-title primary-title>
                        <h3>There is no poll created. Please create abc
                            your first poll
                        </h3>
                    </v-card-title>
                    <v-card-actions>
                        <v-layout justify-center
                            mt-1
                            mb-2>
                            <v-btn to="/poll/create"
                                color="cyan">
                                Create poll
                            </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-layout>
            <v-layout row="row"
                wrap="wrap">
                <v-flex v-for="(poll, index) in polls"
                    :key="index"
                    md4="md4">
                    <v-card class="mx-1"
                        color="lime lighten-5">
                        <div>
                            <h2>{{ poll.question }}</h2>
                        </div>
                        <v-btn color="info"
                            @click="() => viewPoll(poll)">
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
        data () {
            return { error: null };
        },
        computed: {
            pollEmpty () {
                return !this.polls || this.polls.length === 0;
            },
            polls () {
                return this.$store.getters.getPolls;
            }
        },
        methods: {
            viewPoll (poll) {
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
            async getPolls () {
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
        created () {
            console.log("created");
        },
        mounted () {
            console.log("mounted");
            this.getPolls();
        },
        updated () {
            console.log("updated");

        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
.container {
  color: #0080ff;
  margin: 0;
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