<template>
	<div>
		<section class="periodical_detail_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="periodical_main" :style="{ minHeight: minHeight + 'px' }">
				<v-nav :navList="navList"></v-nav>
				<div class="periodical_detail_top">
					<div class="periodical_top_left" :style="{ backgroundImage: 'url(' + viewImage + ')' }"></div>
					<div class="periodical_top_right">
						<p class="periodical_right_title">{{ item.name }}</p>
						<el-row type="flex" :gutter="10">
							<el-col v-for="(item, index) in itemImgs" :key="index" ref="imgItems" :span="4" @click.native="changeImgViewIndex(index)">
								<div class="periodical_img_box" :style="getStyleLeft(item, index)">
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
				<!-- 内容部分 -->
				<section class="periodical_main_content" v-html="item.html"></section>
				<!-- 扫码 -->
				<section v-if="item.qrimg" class="detail_order_code">
					<div class="detail_code_img">
						<img :src="item.qrimg">
					</div>
					<p class="detail_order_text">{{ item.qrdescript || '扫描可下单购买'}}</p>
				</section>
				<!-- 评论 -->
				<v-comment :id="id"></v-comment>
			</section>
	    <v-footer></v-footer>
		</section>
	</div>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	import nav from '@/components/common/nav/nav'
	import comment from './comment/comment'
	export default {
		name: '',
		data () {
			return {
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				// 最小高度
				minHeight: window.innerHeight - 110 - 260,
				// 导航条
				navList: [{
					name: '杂志',
					path: '/periodical'
				}, { // 单本杂志
					name: this.$route.query.name,
					path: '/periodical/list'
				}, {
					name: '详情',
					path: '/periodical/detail'
				}],
				// 详情内容
				item: {
					title: '标题标题标题标题标题标题标大叔是发到手标题标大叔是发到手标题标大叔是发到手标题标大叔是发到手标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题'
				},
				// id
				id: this.$route.query.id,
				// 展示第几张图片
				imgViewIndex: 0,
				itemImgs: [],
				// 下单二维码
				orderCodeImg: require('@/pages/index/footer/code_logo_beile.jpg')
			}
		},
		computed: {
			// 展示的图片
			viewImage () {
				return this.itemImgs[this.imgViewIndex]
			}
		},
		created () {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData () {
				this.$ajax.goodsDetail(this.$route.query.id).then(res => {
					this.item = res.data.item
					this.itemImgs = res.data.itemImgs
					if (res.data.itemImgs.length > 6) {
						this.itemImgs = this.itemImgs.slice(-6)
					}
				}, err => {
					console.log(err)
				})
			},
			// 改变路由
			routeChange (path) {
				this.$router.push({
					path: path
				})
			},
			// 获得 left
			getStyleLeft (item, index) {
				return {
					backgroundImage: 'url(' + item + ')'
				}
			},
			// 整体下移
			transformDown (index) {
				this.$refs.imgItems.forEach((item, index1) => {
					if (index !== index1) {
						setTimeout(() => {
							// item.$el.style.transform = 'translate(0, 40px)'
						}, 0)
					}
				})
			},
			// 整体上移
			transformUp (index) {
				this.$refs.imgItems.forEach((item, index1) => {
					if (index !== index1) {
						// item.$el.style.transform = 'translate(0, 0)'
					}
				})
			},
			// 切换展示图片
			changeImgViewIndex (index) {
				this.imgViewIndex = index
			}
		},
		components: {
			'v-footer': footer,
			'v-nav': nav,
			'v-comment': comment
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './detail.styl'
</style>