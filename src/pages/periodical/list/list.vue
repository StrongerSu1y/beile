<template>
	<div>
		<section class="periodical_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="periodical_info_box" :style="{ minHeight: minHeight + 'px' }">
				<v-nav :navList="navList"></v-nav>
    		<el-row type="" :gutter="40" class="periodical_list">
    			<el-col :span="8" v-for="(item, index) in listData" :key="index" class="periodical_item" @click.native="changeRouter('/periodical/detail', item.id)">
    				<div class="periodical_item_img" :style="{ backgroundImage: 'url(' + item.logo + ')' }">
    					<!-- <img :src="item.logo"> -->
    				</div>
    				<p class="periodical_item_name">{{ item.name }}</p>
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
	import nav from '@/components/common/nav/nav'
	import footer from '@/pages/index/footer/footer'
	import empty from '@/components/common/empty/empty'
	export default {
		name: '',
		data () {
			return {
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				minHeight: window.innerHeight - 110 - 260,
				// 列表数据
				listData: [],
				// 导航条
				navList: [{
					name: '杂志',
					path: '/periodical'
				}, {
					name: this.$route.query.name,
					path: '/periodical/list'
				}],
				// 总数
				total: 0,
				pageNum: 1,
				pageSize: 60
			}
		},
		computed: {},
		created () {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData () {
				let businessCls = '1'
				let pageNum = this.pageNum
				let pageSize = this.pageSize
				let businessSecondCatalogId = this.$route.query.id
				let paramStr = `businessCls=${businessCls}&pageNum=${pageNum}&pageSize=${pageSize}&businessSecondCatalogId=${businessSecondCatalogId}`
				this.$ajax.goodsList(paramStr).then(res => {
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
						id: id.toString(),
						name: this.$route.query.name
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
			'v-nav': nav,
			empty
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './list.styl'
</style>