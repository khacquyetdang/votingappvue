<template>
  <v-toolbar fixed class="cyan" dark>
    <v-toolbar-title>
      <v-btn to="/" flat dark>VotingApp</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn to="/register" flat dark>Sign Up
      </v-btn>
      <v-btn to="/login" flat dark>Sign In
      </v-btn>

    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'PageHeader',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
