let getInteger = value => {
	return Math.floor(parseFloat(value))
}

let getFixed1 = value => {
	return parseFloat(parseFloat(value) - Math.floor(parseFloat(value))).toFixed(1).substr(1)
}

let getDecimal = value => {
	return parseFloat(parseFloat(value) - Math.floor(parseFloat(value))).toFixed(2).substr(1)
}

// 老，杂志单独用
let getFullAddress = obj => {
	if (!obj.hasOwnProperty('cityArea')) {
		return '未设置地址'
	}
	return obj.cityArea.split(',').join('') + obj.address
}

// 新地址
let getFullAddressName = obj => {
	if (!obj.hasOwnProperty('province_name')) {
		return '未设置地址'
	}
	return obj.province_name + obj.city_name + obj.region_name + obj.address
}

// 获取更改时间
let getUpdateDay = (time) => {
	if (!time) {
		return ''
	}
	time = time.replace(/-/g, '/')
	let _year, _month, _date
	if (time instanceof Date) {
		let newDate = new Date(time)
		_year = newDate.getFullYear()
		_month = newDate.getMonth() + 1
		_date = newDate.getDate()
	} else {
		_year = time.substr(0, 4)
		_month = time.substr(5, 2)
		_date = time.substr(8, 2)
	}
	return _year + '年' + _month + '月' + _date + '日'
}

// 获取当前过去时间
let getPastTimeText = (time) => {
	if (!time) {
		return ''
	}
	time = time.replace(/-/g, '/')
	// 如果有小数点，则去掉
	if (time.indexOf('.') > -1) {
		time = time.split('.')[0]
	}
	let nowTime = new Date().getTime()
	let createTime = new Date(time).getTime()
	let pastTime = nowTime - createTime
	let baseSecond = 1000
	let baseMin = 1000 * 60
	let baseHour = 1000 * 60 * 60
	let baseDay = 1000 * 60 * 60 * 24
	let baseMon = 1000 * 60 * 60 * 24 * 30
	let baseYear = 1000 * 60 * 60 * 24 * 365
	if (pastTime < baseMin) {
		return Math.floor(pastTime / baseSecond) + '秒'
	} else if (pastTime < baseHour) {
		return Math.floor(pastTime / baseMin) + '分'
	} else if (pastTime < baseDay) {
		return Math.floor(pastTime / baseHour) + '小时'
	} else if (pastTime < baseMon) {
		return Math.floor(pastTime / baseDay) + '天'
	} else if (pastTime < baseYear) {
		return Math.floor(pastTime / baseMon) + '月'
	} else {
		return Math.floor(pastTime / baseYear) + '年'
	}
}

// 隐藏部分手机号
let hideMobile = (mobile) => {
	if (mobile.length < 7) {
		return mobile
	}
	return mobile.substr(0, 3) + '****' + mobile.substr(7)
}

// 是否输入为 emoji 表情
let isEmojiCharacter = (substring) => {
	let reg = /[~#^$@%&!?%*]/gi
	if (reg.test(substring)) {
		alert(2)
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

// 格式化时间
let formatTime = (time) => {
	if (!time) {
		return '刚刚发布'
	}
	let timeObj = new Date(time)
	let year = timeObj.getFullYear() + '年'
	let month = parseInt(timeObj.getMonth(), 10) + 1 + '月'
	let date = timeObj.getDate() + '日'
	return `${year}${month}${date}`
}

// 获取评论时间
let getCommentTime = (time) => {
	if (!time) {
		return '刚刚发布'
	}
	let timeObj = new Date(time)
	let year = timeObj.getFullYear()
	let month = getTimeStr(parseInt(timeObj.getMonth(), 10) + 1)
	let date = getTimeStr(timeObj.getDate())
	let hours = getTimeStr(timeObj.getHours())
	let minutes = getTimeStr(timeObj.getMinutes())
	let seconds = getTimeStr(timeObj.getSeconds())
	return `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds}`
}

// 时间补领
let getTimeStr = (val) => {
	if (parseInt(val) < 10) {
		return '0' + val
	}
	return val
}

// 为富文本框剥离标签外壳
let getContentText = (content) => {
	return content.replace(/<[^>]*>/g, '')
}

export {
	getInteger,
	getFixed1,
	getDecimal,
	getFullAddress,
	getFullAddressName,
	getUpdateDay,
	getPastTimeText,
	hideMobile,
	isEmojiCharacter,
	formatTime,
	getCommentTime,
	getContentText
}
