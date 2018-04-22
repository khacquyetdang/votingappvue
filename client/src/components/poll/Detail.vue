<template>
    <v-layout row="row" wrap="wrap" class="piechartdetail">
        <v-flex xs12="xs12" sm12="sm12" md12="md12">
            <div v-if="poll">
                <h1>
                    {{ poll.question}}</h1>
                <pie-chart :chart-data="datacollection" :options="pieoptions"></pie-chart>
                <v-snackbar v-if="success" :timeout="3000" :top="true" :bottom="false" :right="false" :left="false" :multiline="false" :vertical="false" v-model="success">
                    The poll is created
                    <v-btn flat="flat" color="pink" @click.native="success = false">Close</v-btn>
                </v-snackbar>
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
        props: [
            'id', 'poll'
        ],
        components: {
            PieChart
        },
        data() {
            return {
                datacollection: null,
                poll: null,
                pieoptions: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            };
        },
        mounted() {
            this.fillData();
            this.poll = this.$store.state.pollsbyId.get(this.$props['id']);
        },
        methods: {
            fillData() {
                if (this.poll) {
                    let labels = [];
                    let backgroundColor = [];
                    let data = [];
                    this.poll.choices.forEach((choice) => {
                        labels.push(choice.text);
                        backgroundColor.push(randomColor());
                        data.push(choice.votes.length + 1);
                    });
                    this.datacollection = {
                        labels: labels,
                        datasets: [
                            {
                                backgroundColor: backgroundColor,
                                data: data
                            }
                        ]
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