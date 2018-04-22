<template>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher="enable-resize-watcher" app="app" light="light">
        <v-list class="pt-0" dense="dense">
            <v-list-tile v-for="item in items" :key="item.title" :to="item.path">
                <v-list-tile-content>
                    <v-list-tile-title>
                        <h3>{{ item.title }}
                        </h3>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="$store.state.isUserLoggedIn" @click="logout">
                <v-list-tile-content>
                    <v-list-tile-title>
                        <h3>Sign out
                        </h3>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

    </v-navigation-drawer>

</template>

<script>
    /*
  <v-toolbar fixed
             class="cyan"
             dark>
    <v-toolbar-title>
      <v-btn to="/"
             flat
             dark>VotingApp</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn v-if="!$store.state.isUserLoggedIn"
             to="/register"
             flat
             dark>Sign Up
      </v-btn>
      <v-btn v-if="!$store.state.isUserLoggedIn"
             to="/login"
             flat
             dark>Sign In
      </v-btn>
      <v-btn v-if="$store.state.isUserLoggedIn"
             flat
             dark
             @click="logout">
        Log Out
      </v-btn>

    </v-toolbar-items>
  </v-toolbar>

*/
    import {saveTokenStorage} from '@/localStorage';

    export default {
        name: 'PageHeader',
        data() {
            return {clipped: false};
        },
        computed: {
            items() {
                const isUserLoggedIn = this.$store.state.isUserLoggedIn;
                if (!isUserLoggedIn) {
                    return [
                        {
                            title: 'Sign In',
                            path: '/login',
                            items: []
                        }, {
                            title: 'Sign Up',
                            path: '/register',
                            items: []
                        }
                    ];
                }
                return [
                    {
                        title: 'Create poll',
                        path: '/poll/create',
                        items: []
                    }, {
                        title: 'Poll list',
                        path: '/polls',
                        items: []
                    }

                ];
            },
            drawer: {
                get() {
                    return this.$store.state.drawer;
                },
                set(val) {
                    this.$store.dispatch('toggleDrawer', val);
                }
            }
        },
        methods: {
            logout() {
                saveTokenStorage(null);
                this.$store.dispatch('setToken', null);
                this.$router.push({name: 'login'});
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped"></style>