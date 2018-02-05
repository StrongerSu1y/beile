<template>
  <div id="app">
    <router-view ref="app"></router-view>
  </div>
</template>

<script>
export default {
	name: 'app',
	data () {
		return {
			index: 1
		}
	},
	mounted () {
	},
	methods: {
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/*text-align: center;*/
	color: #2c3e50;
	/*margin-top: 60px;*/
}
</style>
