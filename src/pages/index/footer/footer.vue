<template>
	<!-- 底部 -->
	<section class="index_page_footer">
		<el-row type="flex" class="index_footer_main">
			<el-col :span="12" class="index_text_left">
				<div class="index_logo_box">
					<img class="index_logo" src="./index_logo.png">
				</div>
				<ul class="index_info_list">
					<li class="index_info_item">
						<img src="./hotline_icon.png">
						<span class="index_info_text">{{ footInfo.mobile || '18072930711‬' }}</span>
					</li>
					<li class="index_info_item">
						<img src="./email_icon.png">
						<span class="index_info_text">{{ footInfo.email || '3004823541@qq.com' }}</span>
					</li>
					<li class="index_info_item">
						<img src="./position_icon.png">
						<span class="index_info_text">{{ footInfo.address || '浙江省杭州市下城区西湖文化广场E区32号6楼633室' }}</span>
					</li>
				</ul>
				<p class="index_bottom_text">
					<span class="bottom_text_left">备案号 | 浙ICP备14010332号-6</span>
					<span class="bottom_text_right">技术支持 | 杭州微校互联科技有限公司</span>
				</p>
			</el-col>
			<el-col :span="12">
				<el-row type="flex" justify="end" :gutter="20">
					<el-col v-for="(item, index) in codeList" :key="index" :span="8" class="index_code_box">
						<img :src="item.logo">
						<p class="index_code_text">{{ item.text }}</p>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	// 二维码数组
	let codeList = [{
		logo: require('./code_logo_beile.jpg'),
		text: '贝乐文化公众号'
	}, {
		logo: require('./code_logo_weixiao.png'),
		text: '微校互联公众号'
	}]
	// 信息
	let infoList = [{
		icon: require('./hotline_icon.png'),
		text: '400-8470068'
	}, {
		icon: require('./email_icon.png'),
		text: '123456@qq.com'
	}, {
		icon: require('./position_icon.png'),
		text: '浙江省杭州市下城区西湖文化广场E区634'
	}]
	export default {
		name: '',
		data () {
			return {
				infoList: infoList,
				codeList: codeList,
				footInfo: {}
			}
		},
		computed: {},
		mounted () {
			if (localStorage.getItem('footInfo') && localStorage.getItem('footInfo').indexOf('address') > -1) {
				this.footInfo = JSON.parse(localStorage.getItem('footInfo'))
			}
		},
		methods: {
		},
		components: {}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './footer.styl'
</style>