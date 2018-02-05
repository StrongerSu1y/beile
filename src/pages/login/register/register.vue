<template>
	<section>
		<section class="register_page" :style="{ paddingTop: topPadding, minHeight: minHeight }">
			<div class="register_page_main">
				<p class="register_title">新用户注册</p>
				<section class="register_body">
					<div class="register_input_box first">
						<el-input class="register_input_text" v-model="mobile" ref="mobile" required placeholder="请输入您的手机号">
							<i v-if="mobile" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('mobile')">
						  </i>
						</el-input>
					</div>
					<div class="register_input_box">
						<el-input class="register_input_text" v-model="password" type="password" ref="password" required placeholder="请输入登录密码">
							<i v-if="password" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearItem('password')">
						  </i>
						  <i :class="{ active: showPlaintext }" class="el-icon-view el-input__icon" slot="suffix" @click="showPlaintext = !showPlaintext">
						  </i>
						</el-input>
					</div>
					<div class="register_input_box">
						<el-row type="flex">
							<el-col :span="12">
								<el-input class="register_input_text border_right_none" v-model="code" placeholder="请输入验证码"></el-input>
							</el-col>
							<el-col :span="12">
								<div id="codeArea"></div>
							</el-col>
						</el-row>
					</div>
					<!-- <p class="register_desc_line text_align_left">
						<i :class="{ active: hasChecked }" class="el-icon-circle-check el-input__icon" slot="suffix" @click="hasChecked = !hasChecked"></i>
						<span class="register_desc_text">我已阅读并同意《微校网用户协议》</span>
					</p> -->
					<div class="register_bottom_btn">
						<el-button type="primary" class="register_next_step" :disabled="!canGoNextStep" @click="goNextStep()">完成</el-button>
					</div>
				</section>
			</div>
	    <v-footer></v-footer>
		</section>
	</section>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	import { checkInput, checkMobile } from '@/common/js/common'
	export default {
		name: 'register',
		data () {
			return {
				// 最小高度
				minHeight: window.innerHeight - 110 + 'px',
				// 手机号
				mobile: '',
				// 密码
				password: '',
				// 验证码
				code: '',
				// 显示明文
				showPlaintext: false,
				// 已读
				hasChecked: true,
				verifyCode: '',
				// 可以下一步
				canGoNextStep: true,
				topPadding: (window.innerHeight - 110 - 260 - 430) / 2 + 'px'
			}
		},
		watch: {
			// 切换input属性
			showPlaintext (newVal, oldVal) {
				this.$refs.password.$el.querySelector('input').type = newVal ? 'text' : 'password'
			}
		},
		created () {
		},
		mounted () {
			this.$nextTick(() => {
				// 验证码
				this.verifyCode = new window.GVerify({
					id: 'codeArea'
				})
				this.$nextTick(() => {
				})
			})
		},
		methods: {
			// 点击下一步
			goNextStep () {
				// 验证验证码是否输入正确
				if (!this.verifyCode.validate(this.code)) {
					this.$message({
						shoaClose: true,
						message: '请输入正确的验证码！'
					})
					this.code = ''
					return false
				}
				// 验证输入框是否为空
				if (!checkInput()) {
					return false
				}
				// 验证手机号格式
				if (!checkMobile(this.$refs.mobile.$el.querySelector('input'))) {
					return false
				}
				// 判断是否已读
				if (!this.hasChecked) {
					this.$message({
						message: '请先阅读《微校网用户协议》'
					})
					return false
				}
				// 参数
				let params = {
					mobile: this.mobile,
					password: this.password
				}
				// loading
				this.$loading({
					text: '提交中'
				})
				// 调用接口请求
				this.$ajax.register(params).then(res => {
					if (res.data.status === '0') {
						this.$message({
							type: 'success',
							message: '注册成功！'
						})
						setTimeout(() => {
							this.$router.push({
								path: '/login'
							})
						}, 300)
					}
				}, err => {
					console.log(err)
					// 已注册等情况
					if (err.data.status === '-1') {
						this.$message({
							message: err.data.data.tip
						})
						return false
					}
				})
			},
			// 清除
			clearItem (item) {
				this['' + item + ''] = ''
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './register.styl'
</style>