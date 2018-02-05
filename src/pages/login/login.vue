<template>
	<div>
		<section class="login_page" :style="{ paddingTop: topPadding, minHeight: minHeight }">
			<!-- <el-main class="login_page_main" :style="{ height: minHeight }"> -->
			<section class="login_page_body" :style="{ minHeight: minHeight }">
				<el-main class="login_page_main">
					<div class="login_main_box">
						<p class="login_main_title">账号登录</p>
						<div class="login_input_box first">
							<el-input class="login_input_text" v-model="mobile" ref="mobile" required placeholder="请输入注册使用手机号">
								<i v-if="mobile" class="el-icon-circle-close el-input__icon" slot="suffix" @click="mobile = ''">
								</i>
							</el-input>
						</div>
						<div class="login_input_box">
							<el-input class="login_input_text" type="password" v-model="password" ref="password" required placeholder="请输入密码">
								<i v-if="password" class="el-icon-circle-close el-input__icon" slot="suffix" @click="password = ''">
							  </i>
							  <i :class="{ active: showPlaintext }" class="el-icon-view el-input__icon" slot="suffix" @click="showPlaintext = !showPlaintext">
							  </i>
							</el-input>
						</div>
						<el-row type="flex" class="login_register_box">
							<el-col :span="12" class="text_align_left">
								<el-button type="text" class="login_register_btn" @click="changeRouter('/retrieve')">忘记密码</el-button>
							</el-col>
							<el-col :span="12" class="text_align_right">
								<el-button type="text" class="login_register_btn" @click="changeRouter('/register')">注册</el-button>
							</el-col>
						</el-row>
						<el-button type="primary" class="login_btn" @click.native="doLogin()">登录</el-button>
						<p class="login_three_title text_align_center">第三方账号登录</p>
						<el-row type="flex" :gutter="0" class="index_three_box">
							<el-col class="text_align_center" :span="8">
								<span class="login_three_logo qq" title="QQ" @click="loginQq()"></span>
							</el-col>
							<el-col class="text_align_center" :span="8" @click.native="loginWeixin()">
								<span class="login_three_logo weixin" title="微信"></span>
							</el-col>
							<el-col class="text_align_center" :span="8" @click.native="loginWeibo()">
								<span class="login_three_logo weibo" title="微博">
									<!-- <wb:login-button name="weibo" type="3,2" onlogin="login" onlogout="logout">登录按钮</wb:login-button> -->
								</span>
							</el-col>
						</el-row>
					</div>
					<div style="display: none;" id="wb_connect_btn" ref="weiboLoginBtn"></div>
				</el-main>
			</section>
	    <v-footer></v-footer>
		</section>
	</div>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	import { checkInput, checkMobile } from '@/common/js/common'
	export default {
		name: '',
		data () {
			return {
				minHeight: window.innerHeight - 110 - 260 + 'px',
				topPadding: (window.innerHeight - 110 - 260 - 460) / 2 - 25 - 20 + 'px',
				mobile: '',
				password: '',
				// 明文密码
				showPlaintext: false,
				// baeUrkl 配置在 qq 管理中心后台
				qqBackUrl: 'http://beileedu.21weixiao.com/login',
				weiboAppKey: '3886011644',
				weiboAppSecret: '6e19e8ceb7d4ddabb5db89e2f322393e',
				// 上一页
				backRoute: '/'
			}
		},
		watch: {
			// 切换input属性
			showPlaintext (newVal, oldVal) {
				this.$refs.password.$el.querySelector('input').type = newVal ? 'text' : 'password'
			}
		},
		created () {
			// 判断微信登陆返回 status
			if (this.$route.query.hasOwnProperty('openid')) {
				if (parseInt(this.$route.query.status) === 0) {
					localStorage.setItem('userId', this.$route.query.uid)
					localStorage.setItem('wxOpenId', this.$route.query.openid)
					// 登录成功
					this.$message({
						type: 'success',
						message: '登录成功！'
					})
					setTimeout(() => {
						// 判断有没有上一页
						if (this.$route.query.backRoute) {
							this.$router.push({
								path: this.$route.query.backRoute,
								query: this.$route.query.backQuery ? JSON.parse(this.$route.query.backQuery) : {}
							})
						} else {
							this.$router.push({
								path: '/'
							})
						}
					}, 300)
				}
			}
			// 判断微博登录
			this.configWeibo()
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.backRoute = from.path
			})
		},
		mounted () {
			// 判断qq是否登录
			if (this.$route.query.qqLoginBack && window.QC.Login.check()) {
				this.afterQQLogin()
			}
			this.$nextTick(() => {
				window.WB2.anyWhere(function (W) {
					W.widget.connectButton({
						id: 'wb_connect_btn',
						type: '3,2',
						callback: {
							login: function (o) {
								console.log('login: ' + o.screen_name)
								window.WB2.logout(() => {
									console.log('loginout')
								})
								try {
									document.getElementsByClassName('loginout')[0].click()
									console.log('loginout success')
								} catch (e) {
									console.log('按钮点击失败: ' + JSON.stringify(e))
								}
							},
							logout: function () {
								alert('logout')
							}
						}
					})
					W.parseCMD('/account/get_uid.json', (oResult, bStatus) => {
						if (bStatus) {
							console.info()
						}
					}, {}, {
						method: 'get',
						cache_time: 30
					})
				})
			})
		},
		methods: {
			// 切换路由
			changeRouter (path) {
				this.$router.push({
					path: path
				})
			},
			// QQ登录后的操作
			afterQQLogin () {
				this.getQQInfo()
			},
			// 获取信息
			getQQInfo () {
				let paras = {}
				let nickname = ''
				let avatar = ''
				let _vm = this
				window.QC.api('get_user_info', paras)
				// 指定接口访问成功的接收函数，s为成功返回Response对象
				.success(function (s) {
					// 成功回调，通过s.data获取OpenAPI的返回数据
					nickname = s.data.nickname
					avatar = s.data.figureurl_qq_2
				})
				// 指定接口访问失败的接收函数，f为失败返回Response对象
				.error(function (f) {
					// 失败回调
					alert('获取用户信息失败！')
				})
				// 指定接口完成请求后的接收函数，c为完成请求返回Response对象
				.complete(function (c) {
					window.QC.Login.getMe((openId, accessToken) => {
						let account = openId
						let _url = `/user/login?account=${account}&nickname=${nickname}&avatar=${avatar}`
						_vm.$ajax.postAjax(_url)
							.then((res) => {
								let data = res.data.data
								if (res.data.status === '0') {
									_vm.$message({
										type: 'success',
										message: '登录成功'
									})
									// 通知更新用户
									_vm.$root.Bus.$emit('userInfoUpdate')
									// 存入用户 id
									localStorage.setItem('userId', res.data.data.id)
									// 如果有上一页，则返回上一页
									if (_vm.$route.query.backRoute) {
										_vm.$router.push({
											path: _vm.$route.query.backRoute,
											query: _vm.$route.query.backQuery ? JSON.parse(_vm.$route.query.backQuery) : {}
										})
									} else {
										// 返回首页
										_vm.backToRoot()
									}
								} else {
									// 错误提示
									_vm.$message({
										message: data.tip
									})
								}
							}, err => {
								console.log(err)
							})
					})
				})
			},
			// 判断微博登陆
			configWeibo () {
				if (this.$route.query.code) {
					// let href = window.location.href
					// let clientId = this.weiboAppKey
					// let clientSecret = this.weiboAppSecret
					// let grantType = 'authorization_code'
					// let code = this.$route.query.code
					// let _url = `//api.weibo.com/oauth2/access_token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}&code=${code}&redirect_uri=${href}`
					let _url = location.protocol + `//api.weibo.com/oauth2/access_token`
					let params = {
						client_id: this.weiboAppKey,
						client_secret: this.weiboAppSecret,
						grant_type: 'authorization_code',
						code: this.$route.query.code,
						redirect_uri: 'https://m.51weixiao.com:8800/login'
					}
					this.$ajax.getWeiboToken(_url, params).then((res) => {
						let accessToken = res.data.access_token
						// let expires_in = res.data.expires_in
						// let remind_in = res.data.remind_in
						let uid = res.data.uid
						// 获取微博用户信息
						this.getWeiboUserInfo(accessToken, uid)
					}, err => {
						console.log(err)
					})
				}
			},
			// 获取微博用户信息
			getWeiboUserInfo (accessToken, uid) {
				let _url = `//api.weibo.com/2/users/show.json?access_token=${accessToken}&uid=${uid}`
				console.log(_url)
				this.$ajax.getAjax(_url)
					.then(res => {
						let nickname = res.data.screen_name
						let avatar = res.data.profile_image_url
						let account = res.data.id
						let _url = `/user/login?account=${account}&nickname=${nickname}&avatar=${avatar}`
						this.$ajax.postAjax(_url)
							.then((res) => {
								console.log(_url)
								if (res.data.status === '0') {
									this.$message({
										type: 'success',
										message: '登录成功'
									})
									localStorage.setItem('userId', res.data.data.id)
									window.location.href = this.$route.query.redirectUrl
								} else {
									this.$message({
										message: '登录失败！'
									})
								}
							}, err => {
								console.log(err)
							})
					}, err => {
						console.error(err)
					})
			},
			// 登录
			doLogin () {
				// 验证输入框是否为空
				if (!checkInput()) {
					return false
				}
				// 验证手机号格式
				if (!checkMobile(this.$refs.mobile.$el.querySelector('input'))) {
					return false
				}
				// 参数
				let params = {
					mobile: this.mobile,
					password: this.password
				}
				// loading
				this.$loading({
					lock: true,
					text: '提交中'
				})
				// ajax
				this.$ajax.Login(params).then(res => {
					if (res.data.status === '0') {
						let id = res.data.data.id
						// 将用户 id 存入本地
						localStorage.setItem('userId', id)
						// 更新用户信息
						this.$root.Bus.$emit('userInfoUpdate')
						// 判断本地数组
						this.configLocalUserList(id)
						// 登录成功
						this.$message({
							type: 'success',
							message: '登录成功'
						})
						setTimeout(() => {
							// 判断有没有上一页
							if (this.$route.query.backRoute) {
								this.$router.push({
									path: this.$route.query.backRoute,
									query: this.$route.query.backQuery ? JSON.parse(this.$route.query.backQuery) : {}
								})
							} else {
								this.$router.push({
									path: '/'
								})
							}
						}, 300)
					} else {
						this.$message({
							message: res.data.data.tip || '登录失败！'
						})
					}
				}, err => {
					this.$message({
						message: err.data.data.tip || '登录失败！'
					})
				})
			},
			// qq登录
			loginQq () {
				window.QC.Login.showPopup({
					appId: '101339901',
					redirectURI: this.qqBackUrl + '?qqLoginBack=1&backRoute=' + encodeURIComponent(this.$route.query.backRoute || '/') // 这是自己加的参数
				})
			},
			// 微信登录
			loginWeixin () {
				let _href = encodeURIComponent(window.location.href + '?backRoute=/')
				let apiUrl = 'https://www.51weixiao.com/app-api/api/user/wxLogin/pub'
				let redirectUrl = encodeURIComponent(`${apiUrl}?finalUrl=${_href}`)
				let appId = 'wxd2fc5d3e92828aad'
				var _url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_login&state=1#wechat_redirect`
				window.location.href = _url
				// window.open(_url, 'TencentLogin', 'width=500,height=320,menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1')
			},
			// 微博登陆
			loginWeibo () {
				this.$refs.weiboLoginBtn.click()
				// window.WB2.anyWhere((W) => {
				// 	console.log(2222)
				// 	W.widget.connectButton({
				// 		id: 'wb_connect_btn',
				// 		type: '3,2',
				// 		callback: {
				// 			login: (o) => {
				// 				console.log(o)
				// 				// alert('login: ' + o.screen_name)
				// 				let nickname = o.screen_name
				// 				let avatar = o.profile_image_url
				// 				let account = o.id
				// 				let _url = `/user/login?account=${account}&nickname=${nickname}&avatar=${avatar}`
				// 				this.$ajax.postAjax(_url)
				// 					.then((res) => {
				// 						console.log(_url)
				// 						if (res.data.status === '0') {
				// 							this.$message({
				// 								type: 'success',
				// 								message: '登录成功'
				// 							})
				// 							localStorage.setItem('userId', res.data.data.id)
				// 							// window.location.href = this.$route.query.redirectUrl
				// 							// 判断有没有上一页
				// 							if (this.$route.query.backRoute) {
				// 								this.$router.push({
				// 									path: this.$route.query.backRoute,
				// 									query: this.$route.query.backQuery ? JSON.parse(this.$route.query.backQuery) : {}
				// 								})
				// 							} else {
				// 								this.$router.push({
				// 									path: '/'
				// 								})
				// 							}
				// 						} else {
				// 							this.$message({
				// 								message: '登录失败！'
				// 							})
				// 						}
				// 					}, err => {
				// 						console.log(err)
				// 					})
				// 			},
				// 			logout: function () {
				// 				alert('logout')
				// 			}
				// 		}
				// 	})
				// })
				// window.WB2.login(() => {
				// 	// 获取微博用户信息
				// })
				// let appkey = this.weiboAppKey
				// let href = window.location.href
				// window.location.href = `https://open.weibo.cn/oauth2/authorize?display=mobile&client_id=${appkey}&redirect_uri=${href}`
			},
			// 返回首页
			backToRoot () {
				this.$router.push({
					path: '/'
				})
			},
			// 判断本地数组
			configLocalUserList (id) {
				let userList = JSON.parse(localStorage.getItem('userList')) || []
				if (userList.length && userList.indexOf(id) > -1) {
					return false
				} else {
					userList.push(id)
					localStorage.setItem('userList', JSON.stringify(userList))
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
	@import './login.styl'
</style>