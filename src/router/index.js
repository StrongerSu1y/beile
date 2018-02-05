import Vue from 'vue'
import Router from 'vue-router'
import indexPage from '@/pages/index/index' // 首页
import homePage from '@/pages/index/home/home' // 首页内容
import indexIntroduction from '@/pages/index/introduction/introduction' // 公司介绍
import indexDynamic from '@/pages/index/dynamic/dynamic' // 企业动态
import indexDynamicDetail from '@/pages/index/dynamic/detail/detail' // 企业动态
import indexContact from '@/pages/index/contact/contact' // 企业动态
import login from '@/pages/login/login'
import retrieve from '@/pages/login/retrieve/retrieve'
import register from '@/pages/login/register/register'

// 杂志
import periodical from '@/pages/periodical/periodical' // 杂志
import periodicalIndex from '@/pages/periodical/index/index' // 杂志首页
import periodicalList from '@/pages/periodical/list/list' // 单批杂志列表
import periodicalDetail from '@/pages/periodical/detail/detail' // 杂志详情
// 图书
import book from '@/pages/book/book' // 杂志
import bookIndex from '@/pages/book/index/index' // 杂志首页
import bookDetail from '@/pages/book/detail/detail' // 杂志详情
// 账户
import account from '@/pages/account/index' // 个人信息
import accountSetting from '@/pages/account/setting/setting' // 设置账户名

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			component: indexPage,
			children: [{
				path: '/',
				component: homePage
				// beforeEnter: (to, from, next) => {
				// 	// Vue.prototype.$fromPath = from.path
				// 	console.log(to)
				// }
			}, {
				path: 'login',
				component: login
			}, {
				path: 'retrieve',
				component: retrieve
			}, {
				path: 'register',
				component: register
			}, {
				path: 'introduction',
				component: indexIntroduction
			}, {
				path: 'dynamic',
				component: indexDynamic
			}, {
				path: 'dynamic/detail',
				component: indexDynamicDetail
			}, {
				path: 'contact',
				component: indexContact
			}, {
				path: 'periodical',
				component: periodical,
				children: [{
					path: '/',
					component: periodicalIndex
				}, {
					path: 'list',
					component: periodicalList
				}, {
					path: 'detail',
					component: periodicalDetail
				}]
			}, {
				path: 'book',
				component: book,
				children: [{
					path: '/',
					component: bookIndex
				}, {
					path: 'detail',
					component: bookDetail
				}]
			}, {
				path: 'account',
				component: account
			}, {
				path: 'account/setting',
				component: accountSetting
			}, {
				path: 'account/retrieve',
				component: retrieve
			}]
		}
	]
})
