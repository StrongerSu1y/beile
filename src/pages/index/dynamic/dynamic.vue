<template>
	<div>
		<section class="dynamic_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="dynamic_info_box" :style="{ minHeight: minHeight + 'px' }">
	  		<div class="dynamic_info_title" :style="{ backgroundImage: 'url(' + titleBgSrc + ')' }">
	  			企业动态
	  		</div>
    		<ul class="dynamic_list">
    			<li v-for="(item, index) in listData" class="dynamic_item" @click="changeRouter('/dynamic/detail', item.id)">
    				<div class="dynamic_item_left">
    					<img :src="item.logo">
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
				<el-pagination v-if="listData.length"
					layout="prev, pager, next" 
					:total="total" 
					:page-size="pageSize"
					@current-change="handleCurrentChange">
		  	</el-pagination>
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
				// 最小高度
				minHeight: window.innerHeight - 110 - 260,
				// 动态列表
				listData: [],
				// 总数
				total: 0,
				pageNum: 1,
				pageSize: 20
			}
		},
		computed: {},
		created () {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData () {
				let pageNum = this.pageNum
				let paramStr = `pageNum=${pageNum}`
				this.$ajax.businessNews(paramStr).then(res => {
					console.log(res)
					this.listData = res.data.pageInfo.list
					this.total = res.data.pageInfo.total
				}, err => {
					console.log(err)
				})
			},
			// 更改路由
			changeRouter (path, id) {
				this.$router.push({
					path: path,
					query: {
						id: id
					}
				})
			},
			// 当前页变化
			handleCurrentChange (val) {
				this.pageNum = val
				// 切换数据
				this.loadData()
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './dynamic.styl'
</style>