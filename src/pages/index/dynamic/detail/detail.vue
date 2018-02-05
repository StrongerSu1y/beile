<template>
	<div>
		<section class="dynamic_detail_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="dynamic_main" :style="{ minHeight: minHeight + 'px' }">
				<v-nav :navList="navList" :entrance="'dynamic'" @navChange="navChange()"></v-nav>
				<p class="dynamic_detail_title">{{ detail.title }}</p>
				<p class="dynamic_detail_time">{{ detail.publishtime | formatTime }}</p>
				<div class="dynamic_detail_content" v-html="detail.content"></div>
			</section>
	    <v-footer></v-footer>
		</section>
	</div>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	import nav from '@/components/common/nav/nav'
	export default {
		name: '',
		data () {
			return {
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				// 最小高度
				minHeight: window.innerHeight - 110 - 260,
				// 标题
				title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
				// 导航条
				navList: [{
					name: '企业动态',
					path: '/dynamic'
				}, {
					name: '详情',
					path: '/dynamic/detail'
				}],
				// 详情数据
				detail: {}
			}
		},
		computed: {},
		created () {
			this.loadData()
		},
		mounted () {
			// this.detail = JSON.parse(this.$route.query.detail)
		},
		methods: {
			// 加载数据
			loadData () {
				this.$ajax.businessNewsDetail(this.$route.query.id).then(res => {
					this.detail = res.data.news
				}, err => {
					console.log(err)
				})
			},
			// 更改nav
			navChange () {
				this.$router.push({
					path: '/dynamic'
				})
			}
		},
		components: {
			'v-footer': footer,
			'v-nav': nav
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './detail.styl'
</style>