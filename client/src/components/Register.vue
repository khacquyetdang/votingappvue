<template>
  <v-container grid-list-xl>
    <v-layout row
              wrap>
      <v-flex xs6
              sm2
              md6
              offset-xs3
              offset-md3>
        <div class="white elevation-2">
          <v-toolbar flat
                     dense
                     class="cyan"
                     dark>
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-form autocomplete="off"
                    ref="form"
                    v-model="valid"
                    lazy-validation>
              <v-text-field v-model="email"
                            label="Email"
                            :error-messages="errors.collect('email')"
                            name="email"
                            data-vv-delay="30"
                            v-validate="{required: true, email: true}">
              </v-text-field>
              <v-text-field v-model="password"
                            ref="password"
                            :type="'password'"
                            data-vv-name="password"
                            v-validate="'required|min:6'"
                            data-vv-delay="100"
                            data-vv-rules="required"
                            :error-messages="errors.collect('password')"
                            label="Password"
                            autocomplete="new-password"
                            required>
              </v-text-field>
              <v-text-field v-model="confirmPassword"
                            :type="'password'"
                            data-vv-name="password_confirmation"
                            :error-messages="errors.collect('password_confirmation')"
                            data-vv-delay="100"
                            v-validate="'required|confirmed:$password'"
                            label="Confirm password"
                            autocomplete="new-password"
                            required>
              </v-text-field>
              <v-btn class="cyan"
                     :disabled="errors.items.length > 0"
                     @click="register">Register</v-btn>
              <v-btn @click="clear">clear</v-btn>
            </v-form>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';

export default {
  name: 'Register',
  data() {
    return {
      valid: true,
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
        this.$store.dispatch('setToken', response.data.access_token);
        console.log('response', response);
      } catch (error) {
        console.log('error', error);
      }
    },
    clear() {
      this.$refs.form.reset();
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
