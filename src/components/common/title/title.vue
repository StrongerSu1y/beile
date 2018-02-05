<template>
	<div class="common_title" :style="{ backgroundImage: 'url(' + titleBgSrc + ')' }">
		{{ title || '标题' }}
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String
			}
		},
		data () {
			return {
				// 背景
				titleBgSrc: require('@/common/icons/title_bg.png')
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './title.styl'
</style>