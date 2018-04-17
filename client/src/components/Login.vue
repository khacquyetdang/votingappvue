<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs6 sm2 md6 offset-xs3 offset-md3>
        <div class="white elevation-2">
          <v-toolbar flat dense class="cyan" dark>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field v-model="email" label="Email" required>
            </v-text-field>
            <v-text-field v-model="password" :type="'password'" label="Password">
            </v-text-field>
            <v-btn class="cyan" @click="login">Login</v-btn>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      const response = await AuthenticationService.register({
        email: this.email,
        password: this.password,
      });
      console.log('response', response);
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
