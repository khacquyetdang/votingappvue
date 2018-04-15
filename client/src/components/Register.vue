<template>
  <div>
    <h1>Register</h1>
    <input type="email" name="email" v-model="email" placeholder="Email">
    <br>
    <input type="password" name="password" v-model="password" placeholder="password">
    <br>
    <button>Register</button>
    <br>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
    };
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
