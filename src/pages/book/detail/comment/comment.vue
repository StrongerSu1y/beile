<template>
	<div class="detail_comment_area">
		<p v-if="listData.length" class="detail_comment_title">回应</p>
		<ul v-if="listData.length" class="detail_comment_list">
			<li v-for="(item, index) in listData" :key="index" class="detail_comment_item">
				<div class="comment_left_part">
					<img :src="item.avatar">
				</div>
				<div class="comment_right_part">
					<div class="comment_top_info">
						<p class="comment_user_name">{{ item.name }}</p>
						<p class="comment_create_time">{{ item.created_at | getCommentTime }}</p>
					</div>
					<p class="comment_item_content">{{ item.content }}</p>
					<div v-if="parseInt(uid) === parseInt(item.uid)" class="comment_delete_box">
						<el-button icon="el-icon-delete" @click.native="deleteItem(item.id, uid)">删除</el-button>
					</div>
				</div>
			</li>
		</ul>
		<p class="my_comment_title">您的回应...</p>
		<el-input class="comment_input_area"
		  type="textarea"
		  :rows="6"
		  placeholder="请输入内容"
		  v-model="textarea">
		</el-input>
		<div class="comment_submit_icon text_align_right">
			<el-button type="primary" @click.native="addComment()">回应</el-button>
		</div>
		<el-pagination v-if="listData.length"
			layout="prev, pager, next" 
			:total="total" 
			:page-size="pageSize"
			@current-change="handleCurrentChange">
  	</el-pagination>
	</div>
</template>

<script>
	export default {
		props: {
			id: {
				type: String
			}
		},
		data () {
			return {
				// 数据
				listData: [],
				uid: localStorage.getItem('userId'),
				// 输入文字框
				textarea: '',
				// 页码
				pageNum: 1,
				// 总数
				total: 0,
				// 单页个数
				pageSize: 40
			}
		},
		created () {
			this.loadData()
		},
		methods: {
			// 加载数据
			loadData () {
				let paramStr = `pageSize=40&pageNum=` + this.pageNum
				this.$ajax.goodsComment(this.id, paramStr).then(res => {
					console.log(res)
					this.listData = res.data.pageInfo.list
					this.total = res.data.pageInfo.total
					this.$emit('dataFresh')
				}, err => {
					console.log(err)
				})
			},
			// 当前页变化
			handleCurrentChange (val) {
				this.pageNum = val
				// 切换数据
				this.loadData()
			},
			// 发表评论
			addComment () {
				// 判断是否登录
				if (!localStorage.getItem('userId')) {
					this.$message({
						message: '请先登录！'
					})
					setTimeout(() => {
						this.$router.push({
							path: '/login',
							query: {
								backRoute: this.$route.path,
								backQuery: JSON.stringify(this.$route.query)
							}
						})
					}, 300)
					return false
				}
				// 判断评论是否为空
				if (!this.textarea) {
					this.$message({
						message: '请先填写评论！'
					})
					return false
				}
				let params = {
					uid: localStorage.getItem('userId'),
					content: this.textarea
				}
				this.$ajax.goodsCommentAdd(this.id, params).then(res => {
					console.log(res)
					if (res.data.status === '0') {
						this.$message({
							type: 'success',
							message: '评论成功！'
						})
						// 清空输入
						this.textarea = ''
						// 重新加载本页数据
						this.loadData()
					} else {
						this.$message({
							message: '评论失败！请重试'
						})
					}
				}, err => {
					this.$message({
						message: '评论失败！请重试'
					})
					console.log(err)
				})
			},
			// 删除单项
			deleteItem (id, uid) {
				this.$ajax.goodsCommentDelete(id, uid).then(res => {
					if (res.data.status === '0') {
						this.$message({
							type: 'success',
							message: '删除成功！'
						})
						setTimeout(() => {
							// 重新加载当前页面
							this.loadData()
						}, 300)
					} else {
						this.$message({
							message: '删除失败！请稍后重试'
						})
					}
				}, err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './comment.styl'
</style>
