<template>
	<el-container class="index_page">
		<!-- 头部 -->
		<el-header class="index_page_header" :height="headerHeight">
			<section class="index_header_main">
				<el-row type="flex" class="index_header_top">
					<el-col :span="12" class="header_top_title index_text_left">您好，杭州贝乐文化传播有限公司欢迎您！</el-col>
					<el-col :span="12" class="index_top_right index_text_right">
						<el-button type="text" class="index_header_btn blue" @click="changeRouter('/login')">登录</el-button>
						<el-button type="text" class="index_header_btn" @click="changeRouter('/register')">注册</el-button>
					</el-col>
				</el-row>
				<el-row type="flex" class="index_header_nav">
					<el-col :span="12" class="index_text_left">
						<img class="index_logo" src="./index_logo.png">
					</el-col>
					<!-- 未登录显示 -->
					<el-col v-if="!indexNavShow" :span="12" class="index_text_right">
						<el-button v-for="(item, index) in navList" :key="index" type="text" class="index_header_btn index_nav_btn" :class="{ blue: index === navIndex }" @click="changeRouter(item.path)">{{ item.text }}</el-button>
					</el-col>
					<!-- 登录后显示 -->
					<el-col v-if="indexNavShow" :span="12" class="text_align_right index_nav_right">
						<img class="index_hotline_icon" :src="hotLineIcon">
						<div class="index_hotline_box">
							<p class="index_hotline_top">服务热线</p>
							<p class="index_hotline_bottom">180-7293-0711‬</p>
						</div>
						<span class="index_three_icon" @mouseenter="navIconHover('qq')" @mouseleave="navIconLeave('qq')" :style="{ backgroundImage: 'url(' + qqIconSrc + ')' }" title="QQ咨询" @click="openConsult()">
							<a style="display: none;" ref="qqConsult" href="tencent://message/?uin=2853393976&Site=Sambo&Menu=yes">QQ在线咨询</a>
						</span>
						<span class="index_three_icon" @mouseenter="navIconHover('weixin')" @mouseleave="navIconLeave('weixin')" :style="{ backgroundImage: 'url(' + weixinIconSrc + ')' }"></span>
						<transition name="el-fade-in">
							<div v-if="qrCodeShow" class="index_qrcode_box">
								<img :src="qrCodeSrc">
							</div>
						</transition>
					</el-col>
				</el-row>
			</section>
			<!-- 导航栏 -->
			<el-row v-if="indexNavShow" type="flex" class="index_page_nav">
				<el-col :span="12">
					<el-row type="flex" class="index_nav_list">
						<el-col v-for="(item, index) in navList" :key="index" :span="6">
							<el-button :type="index === navIndex ? 'primary' : ''" :style="{ fontSize: index === navIndex ? '16px' : '14px' }" class="index_nav_btn" @click="changeRouter(item.path)">
								<span v-if="index === 0">首&nbsp;&nbsp;页</span>
								<span v-if="index !== 0">{{ item.text }}</span>
							</el-button>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="12" class="text_align_right">
					<el-row type="flex" :gutter="0" justify="end" class="nav_right_box">
						<el-col :span="20" style="margin-right: 3px">
							<el-dropdown class="account_set_menu">
							  <el-button class="account_set_btn">
							    {{ userInfo.nick_name || userInfo.name || '游客' }}<i class="el-icon-arrow-down el-icon--right"></i>
							  </el-button>
							  <el-dropdown-menu class="account_dropdown_menu" slot="dropdown">
							    <el-dropdown-item class="account_drop_list" @click.native="setAccount()">账号设置</el-dropdown-item>
							    <el-dropdown-item class="account_drop_list" @click.native="loginOut()">退出</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
						</el-col>
						<el-col :span="2" style="width: 28px">
							<div class="nav_right_avatar" @click="setAccount()">
								<img :src="userInfo.avatar || defaultAvatar">
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-header>
		<!-- 主要内容、路由 -->
		<section class="index_main" :style="{ minHeight: mainHeight + 'px', position: 'relative' }">
			<transition name="el-fade-in">
					<router-view class="child-page" :style="{ minHeight: mainHeight + 'px' }"></router-view>
			</transition>
		</section>
		<!-- <v-footer></v-footer> -->
	</el-container>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	// 导航
	let navList = [{
		text: '首页',
		path: '/'
	}, {
		text: '公司介绍',
		path: '/introduction'
	}, {
		text: '企业动态',
		path: '/dynamic'
	}, {
		text: '联系我们',
		path: '/contact'
	}]
	export default {
		name: '',
		data () {
			return {
				// 头像
				defaultAvatar: require('@/common/icons/default.png'),
				// 热线
				hotLineIcon: require('@/common/icons/top_hotline_icon.png'),
				maxHeight: window.innerHeight - 110 - 260 + 'px',
				navList: navList,
				// 头部高度
				headerTopHeight: '110',
				// 导航条高度
				navHeight: '44',
				// 导航栏
				navIndex: 0,
				// 底部高度
				bottomHeight: '260',
				// 显示导航栏数组
				navRoutePath: ['/', '/introduction', '/dynamic', '/contact'],
				// 不显示导航栏数组
				disShowRoutePath: ['/login', '/register', '/retrieve'],
				// 显示首页导航栏
				indexNavShow: true,
				// qq分享icon
				qqIconSrc: require('@/common/icons/qq_logo.png'),
				// 微博分享icon
				weixinIconSrc: require('@/common/icons/weixin_logo.png'),
				// 用户信息
				userInfo: {},
				// 用户 Id
				userId: localStorage.getItem('userId') || '',
				// 公众号二维码
				qrCodeSrc: require('./footer/code_logo_beile.jpg'),
				// 显示二维码
				qrCodeShow: false
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				if (vm.disShowRoutePath.indexOf(to.path) > -1) {
					vm.indexNavShow = false
				} else {
					if (vm.navRoutePath.indexOf(to.path) > -1) {
						// 更改路由
						vm.changeNavIndex(vm.navRoutePath.indexOf(to.path))
					} else {
						vm.navIndex = -1
					}
					vm.indexNavShow = true
				}
			})
		},
		beforeRouteUpdate (to, from, next) {
			window.scrollTo(0, 0)
			// 获取用户信息
			this.getUserInfo()
			if (this.disShowRoutePath.indexOf(to.path) > -1) {
				this.indexNavShow = false
			} else {
				if (this.navRoutePath.indexOf(to.path) > -1) {
					// 更改路由
					this.changeNavIndex(this.navRoutePath.indexOf(to.path))
				} else {
					this.navIndex = -1
				}
				this.indexNavShow = true
			}
			next()
		},
		computed: {
			// 头部的高度
			headerHeight () {
				return this.indexNavShow ? parseInt(this.headerTopHeight) + parseInt(this.navHeight) + '' : parseInt(this.headerTopHeight) + ''
			},
			// 主题部分高度
			mainHeight () {
				return window.innerHeight - parseInt(this.headerHeight) + ''
			}
		},
		created () {
			// 更改头像
			this.$root.Bus.$on('avatarChange', (val, event) => {
				this.userInfo.avatar = val
			})
			// 监听用户信息改变
			this.$root.Bus.$on('userInfoUpdate', (val, event) => {
				this.getUserInfo()
			})
		},
		mounted () {
			// 判断路由
			let route = '/' + this.$route.path.split('/')[1]
			if (this.navRoutePath.indexOf(route) > -1 && route !== '/') {
				this.changeNavIndex(this.navRoutePath.indexOf(route))
			}
			// 判断用户信息
			this.getUserInfo()
		},
		methods: {
			// 切换导航栏
			changeNavIndex (index) {
				this.navIndex = index
			},
			// 更改路由
			changeRouter (path) {
				this.$router.push({
					path: path
				})
			},
			// 第三方按钮hover
			navIconHover (type) {
				if (type === 'qq') {
					this.qqIconSrc = require('@/common/icons/qq_active_logo.png')
				}
				if (type === 'weixin') {
					this.qrCodeShow = true
					this.weixinIconSrc = require('@/common/icons/weixin_active_logo.png')
				}
			},
			// 第三方按钮离开
			navIconLeave (type) {
				if (type === 'qq') {
					this.qqIconSrc = require('@/common/icons/qq_logo.png')
				}
				if (type === 'weixin') {
					this.qrCodeShow = false
					this.weixinIconSrc = require('@/common/icons/weixin_logo.png')
				}
			},
			// 获取用户信息
			getUserInfo () {
				let userId = localStorage.getItem('userId')
				if (!userId) {
					this.userInfo = {}
					return false
				}
				this.$ajax.userInfoShow().then(res => {
					this.userInfo = res.data.data
				}, err => {
					console.log(err)
				})
			},
			// 账户设置
			setAccount () {
				// 未登录
				if (!localStorage.getItem('userId')) {
					this.$message({
						message: '请先登录！'
					})
					setTimeout(() => {
						this.$router.push({
							path: '/login'
						})
					}, 300)
				} else {
					this.$router.push({
						path: '/account'
					})
				}
			},
			// 退出登录
			loginOut () {
				localStorage.removeItem('userId')
				// 通知更新用户
				this.$root.Bus.$emit('userInfoUpdate')
				this.$router.push({
					path: 'login'
				})
			},
			// 调起QQ会话
			openConsult () {
				this.$refs.qqConsult.click()
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