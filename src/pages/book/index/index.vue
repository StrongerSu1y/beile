<template>
	<div>
		<section class="book_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="book_info_box" :style="{ minHeight: minHeight + 'px' }">
				<v-title :title="title"></v-title>
    		<el-row v-if="listData.length" type="" :gutter="40" class="book_list">
    			<el-col :span="6" v-for="(item, index) in listData" :key="index" class="book_item" @click.native="changeRouter('/book/detail', item.id)">
    				<div class="book_item_img" :style="{ backgroundImage: 'url(' + item.logo + ')' }">
    					<!-- <img :src="item.logo"> -->
    				</div>
    				<p class="book_item_name">{{ item.name }}</p>
    			</el-col>
    		</el-row>
    		<empty v-if="!listData.length"></empty>
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
	import title from '@/components/common/title/title'
	import footer from '@/pages/index/footer/footer'
	import empty from '@/components/common/empty/empty'
	export default {
		name: '',
		data () {
			return {
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				minHeight: window.innerHeight - 110 - 260,
				// 标题
				title: '图书',
				listData: [],
				// 总数
				total: 0,
				pageNum: 1,
				pageSize: 60
			}
		},
		computed: {},
		created () {
			this.loadData()
			let businessCls = this.$route.query.businessCls
			this.title = businessCls === '2' ? '图书' : businessCls === '3' ? '绘本' : businessCls === '4' ? '教材' : '其他'
		},
		methods: {
			// 加载数据
			loadData () {
				let businessCls = this.$route.query.businessCls || '2'
				let pageNum = this.pageNum
				let pageSize = this.pageSize
				let paramStr = `businessCls=${businessCls}&pageNum=${pageNum}&pageSize=${pageSize}`
				this.$ajax.goodsList(paramStr).then(res => {
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
						id: id.toString(),
						title: this.title
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
			'v-footer': footer,
			'v-title': title,
			empty
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './index.styl'
</style>