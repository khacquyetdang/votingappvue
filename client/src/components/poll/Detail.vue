<template>
    <v-layout row="row" wrap="wrap" class="piechartdetail">
        <v-flex xs12="xs12" sm12="sm12" md12="md12">
            <div v-if="poll">
                <h1>
                    {{ poll.question}}</h1>
                <pie-chart :chart-data="datacollection" :options="pieoptions"></pie-chart>
                <v-btn v-for="(label, index) in datacollection.labels" :key="index" :style="{ backgroundColor: datacollection.datasets[0].backgroundColor[index] }">{{ label }}</v-btn>
                <v-snackbar v-if=" success" :timeout=" 3000" :top=" true" :bottom=" false" :right=" false" :left=" false" :multiline=" false" :vertical=" false" v-model="success">
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
            this.getPoll();
        },
        methods: {
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