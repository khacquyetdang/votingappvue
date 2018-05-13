<template>

    <v-navigation-drawer :clipped="clipped"
        v-model="drawer"
        enable-resize-watcher="enable-resize-watcher"
        disable-route-watcher="disable-route-watcher"
        app="app"
        light="light">
        <v-list class="pt-0"
            dense="dense">
            <v-list-tile v-for="item in items"
                :key="item.title"
                :to="item.path">
                <v-list-tile-content>
                    <v-list-tile-title>
                        <h3>{{ item.title }}
                        </h3>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="$store.state.isUserLoggedIn"
                @click="logout">
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
    import { saveUserStorage } from '@/localStorage';

    export default {
        name: 'PageHeader',
        data () {
            return { clipped: false };
        },
        mounted () {
            this.drawer = false;
        },
        computed: {
            items () {
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
                        }, {
                            title: 'About',
                            path: '/about',
                            items: []
                        }
                    ];
                }
                return [
                    {
                        title: 'Create poll',
                        path: '/poll/create',
                        items: []
                    }, 
                    {
                        title: 'My polls',
                        path: '/poll/my',
                        items: []                    
                    },
                    {
                        title: 'About',
                        path: '/about',
                        items: []
                    }

                ];
            },
            drawer: {
                get () {
                    return this.$store.state.drawer;
                },
                set (val) {
                    this.$store.dispatch('toggleDrawer', val);
                }
            }
        },
        methods: {
            logout () {
                saveUserStorage(null);
                this.$store.dispatch('setUser', null);
                this.$router.push({ name: 'login' });
            }
        }
    };
</script>