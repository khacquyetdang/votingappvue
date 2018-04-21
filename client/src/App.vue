<template>
  <div id="app">
    <v-app light>
      <page-header></page-header>
      <v-toolbar color="indigo"
                 class="cyan"
                 dark
                 fixed
                 app>
        <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
        <v-toolbar-title @click="goHome"
                         class="pointer">
          Voting App
        </v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';

export default {
  name: 'App',
  methods: {
    toggleDrawer() {
      const newDrawer = !this.$store.state.drawer;
      this.$store.dispatch('toggleDrawer', newDrawer);
    },
    goHome() {
      this.$router.push({
        name: 'home',
      });
    },
  },
  components: {
    PageHeader,
  },
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
