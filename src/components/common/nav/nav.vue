<template>
	<div class="common_detail_nav">
		<span class="common_nav_item" v-for="(item, index) in navList">
			<el-button v-if="index < navList.length - 1" type="text" class="common_nav_btn" @click="routeBack(index)">{{ item.name }}</el-button>
			<i v-if="index < navList.length - 1" class="el-icon-arrow-right"></i>
			<el-button v-if="index === navList.length - 1" type="text" class="common_nav_btn active" @click="changeRouter(item.path)">{{ item.name }}</el-button>
		</span>
	</div>
</template>

<script>
	export default {
		props: {
			navList: {
				type: Array
			},
			entrance: {
				type: String
			}
		},
		data () {
			return {
				// 背景
				titleBgSrc: require('@/common/icons/title_bg.png')
			}
		},
		methods: {
			// 更改路由
			changeRouter (path) {
				this.$router.push({
					path: path
				})
			},
			// 返回
			routeBack (index) {
				if (this.entrance === 'dynamic') {
					this.$emit('navChange')
				} else {
					// 后退长度
					let backLength = index - this.navList.length + 1
					this.$router.go(backLength)
				}
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './nav.styl'
</style>