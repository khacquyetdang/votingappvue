<template>
    <div class="home">
        <h1>{{ msg }}</h1>
        <br>
        <h2>
            This application allow user to create and vote in various poll.
            You can change your vote whenever you want. You can
            add choice if the choice list is not fit.
        </h2>
        <br>
        <h2>This app is developed by using vuejs, vuetify and chartjs
            in the frontend. The backend is developed using expressjs,
            passportjs. You can find the code source
            <a href="https://github.com/khacquyetdang/votingappvue"
                target="_blank">here</a>
        </h2>
        <br>
        <p>I'm Khac Quyet DANG fullstack developer. Please
            <a href="mailto:contact@bootlearning.com?Subject=Contact from voteapp"
        
                target="_top">send me a mail</a>
            me if you want to hire or to develop some idea. You can find
            my CV
            <a href="https://khacquyetdang.github.io/">
                here</a>
        </p>

    </div>
</template>

<script>
    export default {
        name: 'AboutPage',
        data () {
            return { msg: 'Welcome to Your Vue.js App' };
        }
    };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
.home {
  color: gray;
}
</style>