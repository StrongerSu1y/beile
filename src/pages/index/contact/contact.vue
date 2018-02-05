<template>
	<div>
		<section class="contact_main_view" :style="{ minHeight: mainHeight + 'px' }">
			<section class="contact_info_box">
	  		<div class="contact_info_title" :style="{ backgroundImage: 'url(' + titleBgSrc + ')' }">
	  			联系我们
	  		</div>
	  		<div class="position-box" id="mapContainer" ref="mapContainer">
	  			<!-- <img src="./pos_img.png"> -->
	  		</div>
	  		<ul class="contact_info_list">
	  			<li class="contact_info_item">
	  				<p class="contact_item_para">
	  					<span class="contact_left_text">地址</span>
		  				<span class="contact_right_text">{{ footInfo.address || '浙江省杭州市下城区西湖文化广场E区633室' }}</span>
	  				</p>
	  			</li>
	  			<li class="contact_info_item">
	  				<p class="contact_item_para">
	  					<span class="contact_left_text">邮编</span>
		  				<span class="contact_right_text">310014</span>
	  				</p>
	  			</li>
	  			<li class="contact_info_item">
	  				<p class="contact_item_para">
	  					<span class="contact_left_text">电话</span>
		  				<span class="contact_right_text">{{ footInfo.mobile || '13968753971' }}</span>
	  				</p>
	  			</li>
	  			<li class="contact_info_item">
	  				<p class="contact_item_para">
	  					<span class="contact_left_text">邮件</span>
		  				<span class="contact_right_text">{{ footInfo.email || 'rhwesgw@qq.com' }}</span>
	  				</p>
	  			</li>
	  		</ul>
			</section>
	    <v-footer></v-footer>
		</section>
	</div>
</template>

<script>
	import footer from '@/pages/index/footer/footer'
	import { addScript } from '@/common/js/common'
	import Vue from 'vue'
	export default {
		name: '',
		data () {
			return {
				// 背景
				titleBgSrc: require('@/common/icons/title_bg.png'),
				// 主要内容高度
				mainHeight: window.innerHeight - 110,
				// 地图
				map: '',
				// 信息
				footInfo: {},
				// 维度
				lat: 30.283584,
				// 精度
				lng: 120.168697
			}
		},
		computed: {},
		created () {
			Vue.prototype.$mapController = this.mapCallBack
			addScript('/static/js/mapController.js')
		},
		mounted () {
			if (localStorage.getItem('footInfo') && localStorage.getItem('footInfo').indexOf('address') > -1) {
				this.footInfo = JSON.parse(localStorage.getItem('footInfo'))
				this.lat = JSON.parse(localStorage.getItem('footInfo')).lat
				this.lng = JSON.parse(localStorage.getItem('footInfo')).lng
			}
			this.$nextTick(() => {
				addScript('//api.map.baidu.com/api?v=2.0&ak=72D496GMoz8GP4gNTpGWwFqRj9WSe0y1&callback=mapCallBack')
				// this.map = new window.BMap.Map(this.$refs.mapContainer)
			})
		},
		methods: {
			// 地图api加载完毕后
			mapCallBack (res) {
				// navigator.geolocation.getCurrentPosition(res => {
				// 	// console.info(res)
				// }, err => {
				// 	// console.log(err)
				// })
				this.map = new window.BMap.Map(this.$refs.mapContainer)
				let point = new window.BMap.Point(this.lng, this.lat)
				this.map.centerAndZoom(point, 18)
				let marker = new window.BMap.Marker(point)
				this.map.addOverlay(marker)
				this.map.enableScrollWheelZoom()
				let topLeftControl = new window.BMap.NavigationControl()
				// let topRightControl = new window.BMap.NavigationControl({
				// 	anchor: BMAP_ANCHOR_TOP_RIGHT,
				// 	type: BMAP_NAVIGATION_CONTROL_SMALL
				// })
				this.map.addControl(topLeftControl)
				// this.map.addControl(topRightControl)
				// let func = this.getLocation()
				// this.$ajax.getAjax('http://api.map.baidu.com/api?v=2.0&address=北京市海淀区上地十街10号&output=json&ak=72D496GMoz8GP4gNTpGWwFqRj9WSe0y1&callback=showLocation(' + func + ')').then(res => {
				// 	console.log(res)
				// }, err => {
				// 	console.log(err)
				// })
			},
			// 获取地址
			getLocation (res) {
				console.log(res)
			}
		},
		components: {
			'v-footer': footer
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './contact.styl'
</style>