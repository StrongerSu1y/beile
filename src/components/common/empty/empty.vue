<template>
	<section class="empty_box">
		<img :src="emptySrc">
		<p class="empty_text">{{ text || '暂无内容'}}</p>
	</section>
</template>

<script>
	export default {
		name: 'empty',
		props: {
			text: {
				type: String
			}
		},
		data () {
			return {
				emptySrc: require('@/common/icons/empty.png')
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './empty.styl'
</style>