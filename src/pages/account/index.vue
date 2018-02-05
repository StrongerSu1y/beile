<template>
	<section>
		<section class="account_page">
			<section class="account_page_body" :style="{ paddingTop: topPadding, minHeight: minHeight + 'px' }">
				<div class="account_page_main">
					<div class="account_title">
						<p class="account_title_left">账号设置</p>
						<p class="account_title_right text_align_right">
							<el-button type="text" @click.native="loginOut()">退出登录</el-button>
						</p>
					</div>
					<ul class="account_body">
						<li class="account_body_item avatar">
							<p class="account_item_left">头像</p>
							<p class="account_item_center"></p>
							<div class="account_item_right">
								<!-- <el-button type="text" class="account_change_avatar">点击更换头像</el-button> -->
								<el-upload
								  class="upload-demo" ref="upload"
								  :action="uploadPath" :show-file-list="false"
								  :data="formData" :auto-upload="false" name="img"
								  :on-change="handleChange"
								  :on-success="handleSuccess">
								  <el-button size="small" class="account_change_avatar" type="text">点击更换头像</el-button>
								</el-upload>
								<img class="account_right_avatar" :src="userInfo.avatar || avatarSrc">
							</div>
						</li>
						<li class="account_body_item">
							<p class="account_item_left">用户名</p>
							<p class="account_item_center">{{ userInfo.nick_name || userInfo.name }}</p>
							<div class="account_item_right">
								<el-button type="primary" class="account_update_btn" @click.native="$changeRouter('/account/setting')">修改</el-button>
							</div>
						</li>
						<li class="account_body_item">
							<p class="account_item_left">登录密码</p>
							<p class="account_item_center">密码要求为字母、数字或者为字母和数字组合，密码长度不可低于6位。</p>
							<div class="account_item_right">
								<el-button type="primary" class="account_update_btn" @click.native="$changeRouter('/account/retrieve', { account: true })">修改</el-button>
							</div>
						</li>
					</ul>
				</div>
			</section>
	    <v-footer></v-footer>
		</section>
	</section>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	export default {
		name: '',
		data () {
			return {
				// 最小高度
				minHeight: window.innerHeight - 110 - 260,
				// 头像
				avatarSrc: require('@/common/icons/default.png'),
				topPadding: (window.innerHeight - 110 - 260 - 462 - 44) / 2 + 'px',
				// 用户名
				username: '用户名用户名用户名用户名用户名用户名',
				// 用户信息
				userInfo: {},
				// 上传信息
				formData: {},
				// 上传地址
				uploadPath: this.$baseUrl + '/user/upload_avatar'
			}
		},
		created () {
			this.getUserInfo()
			// 监听更新用户信息
			this.$root.Bus.$on('userUpdate', (value, event) => {
				this.userInfo = value
			})
		},
		mounted () {
		},
		methods: {
			// 获取用户信息
			getUserInfo () {
				let userId = localStorage.getItem('userId')
				if (!userId) {
					return false
				}
				this.$ajax.userInfoShow().then(res => {
					this.userInfo = res.data.data
				}, err => {
					this.$message({
						message: '获取用户信息失败'
					})
					console.log(err)
				})
			},
			// 上传成功
			handleSuccess (res, file, fileList) {
				console.log(res)
				this.$message({
					type: 'success',
					message: '头像上传成功！'
				})
				this.userInfo.avatar = res.data.url
				this.$root.Bus.$emit('avatarChange', res.data.url)
			},
			// 改变
			handleChange (file, fileList) {
				this.formData = {
					_uid: localStorage.getItem('userId'),
					img: file.url
				}
				this.$nextTick(() => {
					this.$refs.upload.submit()
				})
			},
			// 退出登录
			loginOut () {
				localStorage.removeItem('userId')
				// 通知更新用户
				this.$root.Bus.$emit('userInfoUpdate')
				this.$router.push({
					path: 'login'
				})
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './index.styl'
</style>