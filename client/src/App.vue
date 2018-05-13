<template>
    <div id="app">
        <v-app light="light">
            <page-header></page-header>
            <v-toolbar color="indigo" class="cyan" dark="dark" fixed="fixed" app="app">
                <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
                <v-toolbar-title @click="goHome" class="pointer">
                    Voting App
                </v-toolbar-title>
            </v-toolbar>
            <v-content>
                <v-container fluid="fluid">
                    <router-view/>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import PageHeader from '@/components/Header';
    import PollService from '@/services/PollService';

    export default {
        name: 'App',
        data() {
            return {error: null}
        },
        methods: {
            toggleDrawer() {
                const newDrawer = !this.$store.state.drawer;
                this.$store.dispatch('toggleDrawer', newDrawer);
            },
            goHome() {
                this.$router.push({name: 'allpolls'});
            },
            async getPolls() {
                try {
                    const response = await PollService.list();
                    console.log('polls response', response);
                    let polls = response.data.polls;
                    this.$store.dispatch('setPolls', polls);
                } catch (error) {
                    this.error = error.response.data.error.msg || 'An error has occured, please try again later';
                }
            }
        },
        mounted() {
            this.getPolls();
        },
        components: {
            PageHeader
        }
    };
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: white;
    }
    .pointer {
        cursor: pointer;
    }
</style>