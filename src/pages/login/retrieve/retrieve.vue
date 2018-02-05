<template>
	<section>
		<section class="retrieve_page" :style="{ paddingTop: topPadding, minHeight: minHeight }">
			<div class="retrieve_page_main">
				<p class="retrieve_title">{{ title || '找回密码'}}</p>
				<el-row type="flex" class="retrieve_body">
					<el-col :span="12">
						<ul class="retrieve_body_list">
							<li v-for="(item, index) in stepList" :key="index" class="retrieve_body_item">
								<span :class="{ active: index <= stepIndex }" class="retrieve_item_number">{{ item.number }}</span>
								<span :class="{ active: index <= stepIndex }" class="retrieve_item_text">{{ item.text }}</span>
								<span :class="{ active: index <= stepIndex }" class="list_item_top"></span>
								<span :class="{ active: index <= stepIndex }" class="list_item_bottom"></span>
							</li>
						</ul>
					</el-col>
					<el-col :span="12" class="text_align_right retrieve_right_box">
						<section class="retrieve_right_body">
							<!-- 填写账户名称 -->
							<div v-if="stepIndex === -1" class="retrieve_first_step">
								<div class="retrieve_input_box first">
									<el-input class="retrieve_input_text" required v-model="username" required placeholder="请输入用户名称/注册手机号">
										<i v-if="username" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('username')">
									  </i>
									</el-input>
								</div>
							</div>
							<!-- 身份验证 -->
							<div v-if="stepIndex === 0" class="retrieve_second_step">
								<div class="retrieve_input_box first">
									<el-input class="retrieve_input_text" required v-model="mobile" ref="mobile" placeholder="请输入注册手机号">
										<i v-if="mobile" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('mobile')">
									  </i>
									</el-input>
								</div>
								<div class="retrieve_input_box">
									<el-row type="flex">
										<el-col :span="12">
											<el-input class="retrieve_input_text border_right_none" required v-model="code" placeholder="请输入验证码"></el-input>
										</el-col>
										<el-col :span="12">
											<el-button v-if="canSendCode" type="primary" class="retrieve_get_code" @click.native="getVerification()">点击获取验证码</el-button>
											<el-button v-if="!canSendCode"  type="primary" class="retrieve_get_code disabled" disabled>{{ seconds }}s</el-button>
										</el-col>
									</el-row>
								</div>
							</div>
							<!-- 设置新密码 -->
							<div v-if="stepIndex === 1" class="retrieve_third_step">
								<div class="retrieve_input_box first">
									<el-input class="retrieve_input_text" required v-model="password" type="password" ref="password" placeholder="请设置您的新密码">
										<i v-if="password" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('password')">
									  </i>
									  <i :class="{ active: showPlaintext }" class="el-icon-view el-input__icon" slot="suffix" @click="showPlaintext = !showPlaintext">
									  </i>
									</el-input>
								</div>
							</div>
							<!-- 完成 -->
							<div v-if="stepIndex === 2" class="retrieve_fourth_step text_align_center">
								<p class="retrieve_success_text">设置完成</p>
								<el-button type="primary" class="retrieve_login_icon" @click="goLogin()">去登录</el-button>
							</div>
						</section>
						<el-button v-if="stepIndex <= 1" type="primary" class="retrieve_next_step" :disabled="!canGoNextStep" @click="changeStepIndex()">下一步</el-button>
					</el-col>
				</el-row>
			</div>
	    <v-footer></v-footer>
		</section>
	</section>
</template>

<script>
	import { checkMobile } from '@/common/js/common.js'
	import footer from '@/pages/index/footer/footer'
	let stepList = [{
		number: '1',
		text: '身份验证'
	}, {
		number: '2',
		text: '设置新密码'
	}, {
		number: '3',
		text: '完成'
	}]
	export default {
		name: '',
		data () {
			return {
				// 最小高度
				minHeight: window.innerHeight - 110 + 'px',
				// 用户名称
				username: '',
				// 手机
				mobile: '',
				// 密码
				password: '',
				// 验证码
				code: '',
				// uid
				uid: localStorage.getItem('userId') || '',
				// 明文密码
				showPlaintext: false,
				// 步骤
				stepList: stepList,
				// 标题
				title: '找回密码',
				stepIndex: 0,
				seconds: 60,
				canSendCode: true,
				canGoNextStep: false,
				topPadding: (window.innerHeight - 110 - 260 - 446) / 2 + 'px'
			}
		},
		watch: {
			mobile (newVal, oldVal) {
				if (!newVal || !this.code) {
					this.canGoNextStep = false
				} else {
					this.canGoNextStep = true
				}
			},
			code (newVal, oldVal) {
				if (!newVal || !this.mobile) {
					this.canGoNextStep = false
				} else {
					this.canGoNextStep = true
				}
			},
			// 切换input属性
			showPlaintext (newVal, oldVal) {
				this.$refs.password.$el.querySelector('input').type = newVal ? 'text' : 'password'
			}
		},
		mounted () {
			// 如果是从账户信息进入
			if (this.$route.query.account) {
				this.title = '修改密码'
				this.topPadding = (window.innerHeight - 110 - 260 - 446 - 44) / 2 + 'px'
			}
		},
		methods: {
			// 点击下一步
			changeStepIndex () {
				if (this.stepIndex === 0) {
					let params = {
						mobile: this.mobile,
						code: this.code
					}
					// 验证验证码
					this.$ajax.validateVerifyCode(params).then((res) => {
						this.$message({
							type: 'success',
							message: '提交成功！请设置新密码'
						})
						// 下一步
						this.stepIndex += 1
					}, err => {
						this.$message({
							message: err.data.data.tip
						})
						console.log(err)
					})
				} else {
					if (!this.password) {
						this.$message({
							message: '请先输入您的新密码'
						})
						return false
					}
					let params = {
						_uid: this.uid,
						password: this.password
					}
					this.$ajax.userUpdatePass(params).then(res => {
						this.$message({
							type: 'success',
							message: '设置成功！'
						})
						// 下一步
						this.stepIndex += 1
					}, err => {
						console.log(err)
					})
				}
			},
			// 获取验证码
			getVerification () {
				if (!checkMobile(this.$refs.mobile.$el.querySelector('input'))) {
					return false
				}
				// loading
				this.$loading({
					text: '发送中...'
				})
				// 参数
				let params = {
					mobile: this.mobile
				}
				// 发送请求
				this.$ajax.userGetPass(params).then((res) => {
					this.codeCanInput = true
					this.uid = res.data.data.id
					// this.$refs.btn.disabled = true
					this.canSendCode = false
					this.setSeconds()
				}, err => {
					console.log(err)
				})
			},
			// 计时
			setSeconds () {
				var that = this
				if (this.seconds <= 0) {
					this.canSendCode = true
					return
				}
				setTimeout(() => {
					that.seconds -= 1
					that.setSeconds()
				}, 1000)
			},
			// 清除内容
			clearItem (item) {
				this['' + item + ''] = ''
			},
			// 去登录
			goLogin () {
				this.$router.push({
					path: '/login'
				})
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './retrieve.styl'
</style>