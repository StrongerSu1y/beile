<template>
	<section>
		<section class="home_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<!-- 广告 -->
			<el-carousel :height="carouselHeight">
	      <el-carousel-item v-for="(item, index) in banner" :key="index" :style="{ backgroundImage: 'url(' + item.logo + ')' }">
	        <!-- <h3>{{ item }}</h3> -->
	      </el-carousel-item>
	    </el-carousel>
	    <!-- 种类列表 -->
	    <section class="home_type_box">
	    	<img src="./cloud.png" class="type_box_cloud">
	    	<img src="./tree.png" class="type_box_tree">
	    	<el-row type="flex" :gutter="20" class="home_type_list">
		    	<el-col v-for="(item, index) in typeList" :key="index" :span="6" @click.native="changeRouter(item.path, item.businessCls)">
		    		<div class="type_item_bg_first" :style="{ backgroundImage: 'url(' + item.bookSrc + ')' }">
		    			<div class="type_item_bg_second"></div>
		    			<div class="type_item_bg_third" :style="{ backgroundImage: 'url(' + item.bottomBg + ')' }">
		    				<p class="type_item_text">{{ item.text }}</p>
		    			</div>
		    		</div>
		    	</el-col>
		    </el-row>
	    </section>
	    <!-- 信息区 -->
	    <el-row type="flex" :gutter="20" justify="end" class="home_info" style="margin-left: 0px; margin-right: -10px;">
	    	<!-- 公司介绍 -->
	    	<el-col :span="12" class="home_info_col">
	    		<div class="info_left_block"></div>
	    		<section class="home_info_box home_info_left">
		    		<div class="home_info_title">
		    			<img src="./introduction_title.png">
		    		</div>
						<el-carousel height="288px" class="info_introduction_car">
				      <el-carousel-item v-for="(item, index) in introduce.photos" :key="index" :style="{ backgroundImage: 'url(' + item + ')' }">
				        <!-- <h3>{{ item }}</h3> -->
				      </el-carousel-item>
				    </el-carousel>
				    <!-- 文本内容 -->
				    <p class="home_introduction_text">{{ introduce.conent }}</p>
				    <div class="info_bottom_box">
				    	<el-button type="primary" class="info_bottom_btn" @click.native="$changeRouter('/introduction')">详情<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				    </div>
	    		</section>
	    	</el-col>
	    	<!-- 企业动态 -->
	    	<el-col :span="12" class="home_info_col">
	    		<section class="home_info_box">
		    		<div class="home_info_title">
		    			<img src="./dynamic_title.png">
		    		</div>
		    		<ul class="home_dynamic_list">
		    			<li v-for="(item, index) in businessNews" class="home_dynamic_item" @click="openDynamic(item.id)">
		    				<div class="dynamic_item_left">
		    					<img v-if="item.logo" :src="item.logo">
		    				</div>
		    				<div class="dynamic_item_right">
		    					<div class="dynamic_right_box">
		    						<p class="dynamic_item_title">{{ item.title }}</p>
			    					<p class="dynamic_item_content">{{ item.content | getContentText }}</p>
			    					<!-- <p class="dynamic_item_content" v-html="item.content"></p> -->
			    					<p class="dynamic_item_time">{{ item.publishtime | formatTime }}</p>
		    					</div>
		    				</div>
		    			</li>
		    		</ul>
				    <div class="info_bottom_box">
				    	<el-button type="primary" class="info_bottom_btn" @click.native="$changeRouter('/dynamic')">详情<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				    </div>
	    		</section>
	    	</el-col>
	    </el-row>
	    <!-- 底部 -->
	    <v-footer></v-footer>
		</section>
	</section>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	// 类型列表
	let typeList = [{
		bookSrc: '',
		bottomBg: require('./type_bottom_bg_1.png'),
		text: '杂志',
		path: '/periodical',
		businessCls: '1'
	}, {
		bookSrc: '',
		bottomBg: require('./type_bottom_bg_2.png'),
		text: '图书',
		path: '/book',
		businessCls: '2'
	}, {
		bookSrc: '',
		bottomBg: require('./type_bottom_bg_3.png'),
		text: '绘本',
		path: '/book',
		businessCls: '3'
	}, {
		bookSrc: '',
		bottomBg: require('./type_bottom_bg_4.png'),
		text: '教材',
		path: '/book',
		businessCls: '4'
	}, {
		bookSrc: '',
		bottomBg: require('./type_bottom_bg_5.png'),
		text: '其他',
		path: '/book',
		businessCls: '5'
	}]
	export default {
		name: '',
		data () {
			return {
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				carouselHeight: window.innerWidth * 0.3 + 'px',
				// 种类列表
				typeList: typeList,
				// 动态列表
				businessNews: [],
				// 广告
				banner: [],
				// 公司介绍
				introduce: {}
			}
		},
		computed: {},
		created () {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData () {
				this.$ajax.getHomePage().then(res => {
					console.log(res)
					let data = res.data
					this.banner = res.data.banner
					// 有图书种类列表
					if (data.goodCoverList.length) {
						this.typeList.forEach((item, index) => {
							item.businessCls = data.goodCoverList[index].businessCls
							item.bookSrc = data.goodCoverList[index].logo
							if (data.businessClsDesc) {
								item.text = data.businessClsDesc
							}
						})
					}
					// 公司描述
					this.introduce = data.introduce
					if (data.introduce.photos.length > 6) {
						this.introduce.photos.splice(6)
					}
					// 底部信息存入本地
					localStorage.setItem('footInfo', JSON.stringify(res.data.foot))
					// 动态
					this.businessNews = data.businessNews
				}, err => {
					console.log(err)
				})
			},
			// 更改路由
			changeRouter (path, cls) {
				this.$router.push({
					path: path,
					query: {
						businessCls: cls
					}
				})
			},
			// 企业动态详情
			openDynamic (id) {
				this.$router.push({
					path: '/dynamic/detail',
					query: {
						id: id
					}
				})
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './home.styl'
</style>