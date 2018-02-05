<template>
	<div>
		<section class="introduction_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="introduction_info_box introduction_info_left">
	  		<div class="introduction_info_title" :style="{ backgroundImage: 'url(' + titleBgSrc + ')' }">
	  			公司介绍
	  		</div>
				<el-carousel height="540px" class="info_introduction_car">
		      <el-carousel-item v-for="item in introduce.photos" :key="item" :style="{ backgroundImage: 'url(' + item + ')' }">
		        <!-- <h3>{{ item }}</h3> -->
		      </el-carousel-item>
		    </el-carousel>
		    <!-- 文本内容 -->
		    <p class="introduction_introduction_text">{{ introduce.conent }}</p>
			</section>
	    <v-footer></v-footer>
		</section>
	</div>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	export default {
		name: '',
		data () {
			return {
				// 背景
				titleBgSrc: require('@/common/icons/title_bg.png'),
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				// 公司介绍
				introduce: {},
				introducText: ''
			}
		},
		computed: {},
		created () {
			this.loadData()
		},
		mounted () {
		},
		methods: {
			// 加载数据
			loadData () {
				this.$ajax.getHomePage().then(res => {
					console.log(res)
					this.introduce = res.data.introduce
				}, err => {
					console.log(err)
				})
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './introduction.styl'
</style>