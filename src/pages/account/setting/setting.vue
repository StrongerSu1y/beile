<template>
	<section>
		<section class="account_setting_page">
			<section class="account_setting_page_body" :style="{ paddingTop: topPadding, minHeight: minHeight + 'px' }">
				<div class="account_setting_page_main">
					<div class="account_setting_title">
						<p class="account_setting_title_left">账号设置</p>
						<p class="account_setting_title_right text_align_right">
							<el-button type="text">退出登录</el-button>
						</p>
					</div>
					<section class="account_setting_body">
						<div class="account_setting_input_box first">
							<el-input class="account_setting_input_text" v-model="username" ref="username" placeholder="用户名，2~8个汉字/4~16个字符">
								<i v-if="username" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('username')">
							  </i>
							</el-input>
						</div>
						<div class="account_setting_input_box">
							<el-row type="flex">
								<el-col :span="12">
									<el-input class="account_setting_input_text border_right_none" v-model="code" placeholder="请输入验证码"></el-input>
								</el-col>
								<el-col :span="12">
									<div id="settingCodeArea"></div>
								</el-col>
							</el-row>
						</div>
						<el-row type="flex" :gutter="10" class="account_setting_bottom_btn">
							<el-col :span="12">
								<el-button type="primary" class="account_setting_next_step" :disabled="!canGoNextStep" @click.native="doConfirm()">确定</el-button>
							</el-col>
							<el-col :span="12">
								<el-button class="account_setting_next_step" @click.native="goBack()">返回</el-button>
							</el-col>
						</el-row>
					</section>
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
				// 用户名
				username: '',
				// 验证码图形
				verifyCode: '',
				// 验证码
				code: '',
				// 可以下一步
				canGoNextStep: false,
				topPadding: (window.innerHeight - 110 - 260 - 421 - 44) / 2 + 'px'
			}
		},
		watch: {
			username (newVal, oldVal) {
				if (!newVal || !this.code) {
					this.canGoNextStep = false
				} else {
					this.canGoNextStep = true
				}
			},
			code (newVal, oldVal) {
				if (!newVal || !this.username) {
					this.canGoNextStep = false
				} else {
					this.canGoNextStep = true
				}
			}
		},
		mounted () {
			this.$nextTick(() => {
				this.verifyCode = new window.GVerify({
					id: 'settingCodeArea'
				})
			})
		},
		methods: {
			// 清空内容
			clearItem (item) {
				this['' + item + ''] = ''
			},
			// 返回
			goBack () {
				this.$router.go(-1)
			},
			// 确定
			doConfirm () {
				// 判断输入的是否满足条件
				if (!this.configUserName(this.username)) {
					this.$message({
						message: '您输入的用户名不满足条件！'
					})
					return false
				}
				// 验证验证码是否输入正确
				if (!this.verifyCode.validate(this.code)) {
					this.$message({
						shoaClose: true,
						message: '请输入正确的验证码！'
					})
					this.code = ''
					return false
				}
				let userId = localStorage.getItem('userId')
				let username = this.username
				let paramStr = `_uid=${userId}&nick_name=${username}`
				this.$ajax.userUpdate(paramStr).then(res => {
					this.$message({
						type: 'success',
						message: '用户名设置成功！'
					})
					this.$root.Bus.$emit('userUpdate', res.data.data)
					setTimeout(() => {
						this.$router.go(-1)
					}, 300)
				}, err => {
					this.$message({
						message: '设置失败，请稍后重试！'
					})
					console.log(err)
				})
			},
			// 判断输入的是否满足条件
			configUserName (value) {
				if (!value) {
					return false
				}
				// 判断是否为中文
				let patten = /^[\u4e00-\u9fa5]$/ig
				let len = 0
				for (let i = 0; i < value.length; i++) {
					// 中文占2个字符
					if (value[i].match(patten) !== null) {
						len += 2
					} else {
						len += 1
					}
				}
				if (len > 16 || len < 2) {
					return false
				}
				return true
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './setting.styl'
</style>