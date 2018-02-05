<template>
	<div class="periodical_page">
		<transition name="el-fade-in">
			<router-view class="child-view"></router-view>
		</transition>
	</div>
</template>

<script>
	export default {
		data () {
			return {}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './periodical.styl'
</style>
