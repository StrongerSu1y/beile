<template>
	<section class="login_qq_frame"></section>
</template>

<script>
	export default {
		data () {
			return {}
		},
		mounted () {
			this.loginQq()
		},
		methods: {
			loginQq () {
				let href = window.location.href.substr(0, window.location.href.length - 2)
				window.QC.Login.showPopup({
					appId: '101339901',
					redirectURI: 'https://app.51weixiao.com?redirectUrl=' + encodeURIComponent(href)
				})
			}
		}
	}
</script>