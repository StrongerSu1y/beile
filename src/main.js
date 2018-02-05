// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 接口
import api from './api/api.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import '../theme/index.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 过滤器
import * as custom from './common/js/filter.js'
Object.keys(custom).forEach(key => {
	Vue.filter(key, custom[key])
})

Vue.use(ElementUI, {
	size: 'small'
})
Vue.prototype.$ajax = api
// 接口
Vue.prototype.$baseUrl = process.env.NODE_ENV === 'development' ? location.protocol + '//192.168.0.231:8080/app-api/api' : location.protocol + '//app.51weixiao.com/app-api/api'

Vue.config.productionTip = false
Vue.prototype.$changeRouter = (path, params) => {
	router.push({
		path: path,
		query: params
	})
}

/* eslint-disable no-new */
window.vm = new Vue({
	el: '#app',
	router,
	template: '<App/>',
	data: {
		Bus: new Vue()
	},
	components: { App }
})
