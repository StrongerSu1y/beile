import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
// import { Loading } from 'element-ui'

let Obj = new Vue()
let loadingInstance = null
// 判断全局变量 NODE_ENV
let environment = process.env.NODE_ENV === 'development' ? 'dev' : 'product'
let productHost = location.protocol + '//app.51weixiao.com'
let devHost = location.protocol + '//192.168.0.231:8080'
// let productHost = location.protocol + '//192.168.0.200:8080'

let serverHost = environment === 'dev' ? devHost : productHost

// 贝乐企业 id测试
// const businessId = '124'
// 贝乐企业 id线上
const businessId = environment === 'dev' ? '124' : '109'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.baseURL = environment === 'dev' ? location.protocol + '//192.168.0.231:8080/app-api/api' : location.protocol + '//app.51weixiao.com/app-api/api'
// axios.defaults.baseURL = location.protocol + '//192.168.0.231:8080/app-api/api'
// axios.defaults.baseURL = location.protocol + '//192.168.0.200:8080/app-api/api'

// POST 传参序列化
axios.interceptors.request.use((config) => {
	// 光 post
	// if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
	// 	config.data = qs.stringify(config.data)
	// }
	if (config.headers['Content-Type'] !== 'application/json') {
		config.data = qs.stringify(config.data)
	}
	// config.data = qs.stringify(config.data)
	return config
}, (error) => {
	// 关闭loading
	loadingInstance.close()
	return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
	// 关闭loading
	setTimeout(() => {
		loadingInstance.close()
	}, 300)
	if (!res.data.status) {
		return res
	}
	if (res.data.status === '-1' && res.data.msg) {
		return Promise.reject(res)
	}
	if (res.data.status !== '0') {
		return Promise.reject(res)
	}
	return res
}, (error) => {
	return Promise.reject(error)
})

export function fetch (url, params, type, dataType) {
	loadingInstance = Obj.$loading({})
	return new Promise((resolve, reject) => {
		if (dataType) {
			axios({
				headers: {
					'Content-Type': 'application/json'
				},
				method: type,
				data: params,
				url: url
			})
			.then(response => {
				loadingInstance.close()
				// 判断返回状态码
				messageShow(response.status)
				resolve(response)
			}, err => {
				loadingInstance.close()
				// 判断返回状态码
				messageShow(err.status)
				reject(err)
			})
			.catch((error) => {
				loadingInstance.close()
				// 提示
				Obj.$message({
					message: '当前提交不成功，请再次尝试'
				})
				reject(error)
			})
		} else if (type) {
			if (type === 'get') {
				axios.get(url).then(response => {
					resolve(response)
				}, err => {
					loadingInstance.close()
					// 判断返回状态码
					messageShow(err.status)
					reject(err)
				})
				.catch((error) => {
					loadingInstance.close()
					// 提示
					Obj.$message({
						message: '当前提交不成功，请再次尝试'
					})
					reject(error)
				})
			}
		} else {
			axios({
				method: 'post',
				data: params,
				url: url
			})
			.then(response => {
				console.log('response' + JSON.stringify(response))
				loadingInstance.close()
				// 判断返回状态码
				messageShow(response.status)
				resolve(response)
			}, err => {
				console.log('err' + JSON.stringify(err))
				loadingInstance.close()
				// 判断返回状态码
				messageShow(err.status)
				reject(err)
			})
			.catch((error) => {
				console.log('error' + JSON.stringify(error))
				// 关闭loading
				setTimeout(() => {
					loadingInstance.close()
				}, 300)
				// 提示
				Obj.$message({
					message: '当前提交不成功，请再次尝试'
				})
				reject(error)
			})
		}
	})
}

// 根据http错误码提示
let messageShow = (code) => {
	switch (code) {
	case 200:
		break
	case 400:
		Obj.$message({
			message: '请求参数有误！'
		})
		break
	case 401:
		Obj.$message({
			message: '当前请求需要用户验证！'
		})
		break
	case 403:
		Obj.$message({
			message: '服务器拒绝访问！'
		})
		break
	case 404:
		Obj.$message({
			message: '请求失败！请稍后重试'
		})
		break
	case 405:
		Obj.$message({
			message: '请求方法无法用于请求该资源'
		})
		break
	case 500:
		Obj.$message({
			message: '服务器错误'
		})
		break
	default:
		break
	}
}

export default {
	/*
		get 方法
	*/
	getAjax (url) {
		return fetch(url, {}, 'get')
	},
	/*
		post 方法
	*/
	postAjax (url, params) {
		return fetch(url, params)
	},
	/*
		获取微博 access_token
	*/
	getWeiboToken (url, params) {
		return fetch(url, params)
	},
	/*
		用户登录
	*/
	Login (params) {
		return fetch('/user/login', params)
	},
	/*
		活动详情
	*/
	activityDetail (params) {
		return fetch('/activity/activityDetil', params)
	},
	/*
		票务列表
	*/
	listActivityTicket (params) {
		return fetch('/activityTicket/listActivityTicket', params)
	},
	/*
		生成订单
	*/
	activetradeConfirm (params) {
		return fetch('/activetrade/confirm', params)
	},
	/*
		实名制
	*/
	applyUserSave (params) {
		return fetch('/activetrade/applyUserSave', params)
	},
	/*
		支付宝支付
	*/
	getWapOrderInfoByAliPay (params) {
		return fetch('/alipay/getWapOrderInfoByAliPay', params)
	},
	/*
		微信支付
	*/
	getOfficialAccountPrepayInfo (params) {
		return fetch('/wxpay/getOfficialAccountPrepayInfo', params)
	},
	/*
		评论列表
	*/
	listComment (params) {
		return fetch('/activecomment/listComment', params)
	},
	/*
		删除评论
	*/
	activecommentDel (params) {
		return fetch('/activecomment/del', params)
	},
	/*
		找回密码时获取验证码
	*/
	userGetPass (params) {
		return fetch('/user/get_pass', params)
	},
	/*
		提交验证码
	*/
	validateVerifyCode (params) {
		return fetch('/user/validate_verify_code', params)
	},
	/*
		注册获取验证码
	*/
	sendVerifyCode (params) {
		return fetch('/user/send_verify_code', params)
	},
	/*
		重新设置密码
	*/
	userUpdatePass (params) {
		return fetch('/user/update_pass', params)
	},
	/*
		培训详情
	*/
	trainDetail (params) {
		return fetch('/train/trainDetail', params)
	},
	/*
		注册
	*/
	register (params) {
		return fetch('/user/register', params)
	},
	/*
		添加购物车
	*/
	shopcatSave (params) {
		return fetch('/shop_cart/save', params)
	},
	/*
		清空购物车
	*/
	shopcatDel (id) {
		return fetch(`${serverHost}/api/shop_cart/del`, {
			_uid: localStorage.getItem('userId'),
			id: id
		})
	},
	/*
		购物车列表
	*/
	shopcatList () {
		return fetch(`${serverHost}/api/shop_cart/list`, {
			_uid: localStorage.getItem('userId')
		})
	},
	/*
		设置收货地址
	*/
	addressUpdate (params) {
		return fetch(`${serverHost}/api/address/update`, params)
	},
	/*
		设置收货地址
	*/
	addressDelete (params) {
		return fetch(`${serverHost}/api/address/del`, params)
	},
	/*
		地址列表
	*/
	addressList (params) {
		return fetch(`${serverHost}/api/address/list`, params)
	},
	/*
		订单提交
	*/
	tradeConfirm (params) {
		return fetch(`${serverHost}/api/trade/confirm`, params)
	},
	/*
		贝乐获取首页数据
	*/
	getHomePage () {
		return fetch(`/website/${businessId}`, {}, 'get')
	},
	/*
		贝乐企业动态
	*/
	businessNews (paramStr) {
		return fetch(`/website/${businessId}/news?${paramStr}`, {}, 'get')
	},
	/*
		贝乐企业动态详情
	*/
	businessNewsDetail (id) {
		return fetch(`/website/news/${id}/detail`, {}, 'get')
	},
	/*
		贝乐杂志二级目录
	*/
	businessClsList () {
		return fetch(`/website/${businessId}/businessCls/1`, {}, 'get', 'json')
	},
	/*
		贝乐商品列表
	*/
	goodsList (paramStr) {
		return fetch(`/website/${businessId}/goods?${paramStr}`, {}, 'get')
	},
	/*
		贝乐商品详情
	*/
	goodsDetail (id) {
		return fetch(`website/goods/${id}/detail`, {}, 'get')
	},
	/*
		贝乐用户信息详情
	*/
	userInfoShow () {
		let userId = localStorage.getItem('userId')
		return fetch(`/user/show?_uid=${userId}`, {}, 'get')
	},
	/*
		贝乐商品评论
	*/
	goodsComment (id, paramStr) {
		return fetch(`/website/goods/${id}/comment?${paramStr}`, {}, 'get')
	},
	/*
		贝乐商品评论-新增
	*/
	goodsCommentAdd (id, params) {
		return fetch(`/website/goods/${id}/comment`, params, 'post', 'json')
	},
	/*
		贝乐商品评论-删除
	*/
	goodsCommentDelete (id, uid) {
		return fetch(`/website/goods/comment/${id}/${uid}`, {}, 'delete', 'json')
	},
	/*
		更新用户信息
	*/
	userUpdate (paramStr) {
		return fetch(`/user/update?${paramStr}`, {}, 'get')
	},
	/*
		今日优惠、新品上市列表
	*/
	bookFixedColumn (type) {
		return fetch(`/book/fixedColumn/${type}/open`, {}, 'get')
	},
	/*
		图书详情
	*/
	bookDetail (id) {
		return fetch(`/book/${id}/open`, {}, 'get')
	},
	/*
		图片评论列表
	*/
	bookComment (id, level) {
		return level ? fetch(`/book/${id}/comment/open?level=${level}`, {}, 'get') : fetch(`/book/${id}/comment/open`, {}, 'get')
	},
	/*
		圈子 - 0: 社区, 1: 频道
	*/
	circleChannelList (params) {
		return fetch('/circle/channelList', params)
	},
	/*
		我的首页
	*/
	userHomePage () {
		return fetch('/user/HomePage', {
			user_id: localStorage.getItem('userId')
			// user_id: '100095'
		})
	},
	/*
		双十一订单
	*/
	doubleEleven (params) {
		return fetch('/trade/confirm/book/doubleEleven', params, 'post', 'json')
	},
	/*
		微信配置信息
	*/
	weixinConfig (params) {
		return fetch('/weixin/config', params, 'post', 'json')
	},
	/*
		杂志下单
	*/
	tradeConfirmMagazine (params) {
		return fetch('/trade/confirm/magzine', params, 'post', 'json')
	},
	/*
		商品（图书）下单
	*/
	tradeConfirmBook (params) {
		return fetch('/trade/confirm/book', params, 'post', 'json')
	}
}
