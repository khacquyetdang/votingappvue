<template>
  <v-layout row="row" wrap="wrap">
    <v-flex xs12="xs12" sm12="sm12" md6="md6" offset-xs0="offset-xs0" offset-sm0="offset-sm0" offset-md3="offset-md3">
      <div class="white elevation-2">
        <v-toolbar flat="flat" dense="dense" class="cyan" dark="dark">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-form autocomplete="off" ref="form" lazy-validation="lazy-validation">
            <v-text-field v-model="email" data-vv-name="email" v-validate="{required: true, email: true}" :error-messages="errors.collect('email')"
              label="Email"></v-text-field>
            <v-text-field v-model="password" :type="'password'" data-vv-name="password" v-validate="'required|min:6'" data-vv-delay="100"
              data-vv-rules="required" :error-messages="errors.collect('password')" autocomplete="new-password" required="required"
              label="Password"></v-text-field>
            <v-alert v-if="error !== null" type="error" :value="true" v-html="error" />
            <v-btn class="cyan" :disabled="errors.items.length > 0" @click="login">Login</v-btn>
          </v-form>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import AuthenticationService from '@/services/AuthenticationService';
  import {
    saveTokenStorage
  } from '@/localStorage';

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        error: null
      };
    },
    methods: {
      async login() {
        try {
          const response = await AuthenticationService.login({
            email: this.email,
            password: this.password
          });
          this.$store.dispatch('setToken', response.data.access_token);
          this.$router.push({
            name: 'home'
          });
          saveTokenStorage(response.data.access_token);
          console.log('response', response);
        } catch (error) {
          console.log('error', error.response);
          if (error.response) {
            this.error = error.response.data.error.msg || 'An error has occured, please try again later';
          } else {
            this.error = 'An error has occured, please try again later';
          }
        }
      }
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
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
