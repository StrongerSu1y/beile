
import Vue from 'vue'
let Obj = new Vue()

export function checkInput () {
	let inputItems = document.querySelectorAll('div[required="required"] input')
	for (let i = 0; i < inputItems.length; i++) {
		if (!inputItems[i].value) {
			Obj.$message({
				showClose: true,
				message: inputItems[i].placeholder
			})
			inputItems[i].focus()
			return false
		}
		if (isEmojiCharacter(inputItems[i].value)) {
			Obj.$message({
				showClose: true,
				message: '请勿输入空格、表情或者特殊字符'
			})
			return false
		}
	}
	return true
}

export function checkMobile (item) {
	if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(item.value)) {
		Obj.$message({
			showClose: true,
			message: '请输入正确的手机号'
		})
		item.focus()
		return false
	}
	return true
}

export function addScript (url) {
	let script = document.createElement('script')
	let head = document.getElementsByTagName('head')[0]
	script.src = url
	head.appendChild(script)
}

export function isWeixin () {
	let u = navigator.userAgent.toLowerCase()
	if (u.match(/MicroMessenger/i)) {
		return true
	}
	return false
}

export function getStrLength (str) {
	let len = 0
	for (let i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
			len += 2
		} else {
			len += 1
		}
	}
	return len
}

// 扩展
export function extendObj (target, source) {
	for (var obj in source) {
		target[obj] = source[obj]
	}
	return target
}

// 获取需要的字段
export function getNeedData (obj, arr) {
	let returnObj = {}
	arr.forEach(item => {
		returnObj[item] = obj[item]
	})
	return returnObj
}

// 获取整个数组需要的字段
export function getNeedDataList (arr, args) {
	let needArr = []
	arr.forEach(item => {
		let needObj = getNeedData(item, args)
		needArr.push(needObj)
	})
	return needArr
}

// 获取所有不重复的 Set
export function getArraySet (arr, type) {
	let s = new Set()
	let backArr = []
	arr.forEach(item => {
		s.add(item[type])
	})
	for (var i of s) {
		backArr.push(i)
	}
	return backArr
}

// 获取带逗号的 string
export function getWithCommaString (arr, type) {
	let str = ''
	arr.forEach(item => {
		if (type) {
			str += item[type] + ','
		} else {
			str += item + ','
		}
	})
	return str.substr(0, str.length - 1)
}

// 获取去重过的数组
export function getDistinctArray (arr1, arr2, type) {
	if (!arr1.length) {
		return arr2
	}
	if (!arr2.length) {
		return arr1
	}
	arr1.forEach(item1 => {
		if (configObjInArr(arr2, item1, type)) {
			arr2.push(item1)
		}
	})
	return arr2
}

// 判断数组中是否存在某个属性
function configObjInArr (arr, obj, type) {
	for (let i = 0; i < arr.length; i++) {
		if (obj[type] === arr[i][type]) {
			return false
		}
	}
	return true
}

// 数组去重
export function uniqueArr (arr) {
	let res = []
	let json = {}
	arr.forEach(item => {
		if (!json[item.name]) {
			res.push(item)
			json[item.name] = 1
		}
	})
	return res
}

// 判断是否有 class
export function hasClass (element, name) {
	return element.className.match(RegExp('(\\s|^)' + name + '(\\s|$)'))
}

// 添加 class
export function addClass (element, name) {
	element.className += ' ' + name
}

// 删除 class
export function deleteClass (element, name) {
	if (hasClass(element, name)) {
		element.className.replace(RegExp('(\\s|^)' + name + '(\\s|$)'), ' ')
	}
}

// 是否输入为 emoji 表情
export function isEmojiCharacter (substring) {
	let reg = /[~#^$@%&!?%*\s+]/gi
	if (reg.test(substring)) {
		return true
	}
	for (let i = 0; i < substring.length; i++) {
		let hs = substring.charCodeAt(i)
		if (hs >= 0xd800 && hs <= 0xdbff) {
			if (substring.length > 1) {
				let ls = substring.charCodeAt(i + 1)
				let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000
				if (uc >= 0x1d000 && uc <= 0x1f77f) {
					return true
				}
			}
		} else if (substring.length > 1) {
			let ls = substring.charCodeAt(i + 1)
			if (ls === 0x20e3) {
				return true
			}
		} else {
			if (hs >= 0x2100 && hs <= 0x27ff) {
				return true
			} else if (hs >= 0x2b05 && hs <= 0x2b07) {
				return true
			} else if (hs >= 0x2934 && hs <= 0x2935) {
				return true
			} else if (hs >= 0x3297 && hs <= 0x3299) {
				return true
			} else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030 || hs === 0x2b50 || hs === 0x2b1c || hs === 0x2b1b || hs === 0x2b50) {
				return true
			}
		}
	}
}

// 微信配置
export function weiXinConfig (share) {
	Obj.$ajax.weixinConfig({
		url: window.location.href
	}).then(res => {
		let data = res.data
		window.wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
				'chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'
			]
		})
		window.wx.ready(() => {
			// 朋友圈
			window.wx.onMenuShareTimeline({
				title: share.title,
				link: window.location.href,
				imgUrl: share.imgUrl,
				success: (res) => {}
			})
			// 分享给朋友
			window.wx.onMenuShareAppMessage({
				title: share.title,
				desc: share.desc,
				link: window.location.href,
				imgUrl: share.imgUrl,
				success: (res) => {}
			})
			// 分享到QQ
			window.wx.onMenuShareQQ({
				title: share.title,
				desc: share.desc,
				link: window.location.href,
				imgUrl: share.imgUrl,
				success: (res) => {}
			})
		})
	})
}
