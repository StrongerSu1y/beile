function mapCallBack (res) {
  console.log(window.vm.$mapController)
  window.vm.$mapController(res)
  // window.vm.$refs.app.mapCallBack()
  // let map = new window.BMap.Map('mapContainer')
  // let point = new window.BMap.Point(120.168697, 30.283584)
  // map.centerAndZoom(point, 15)
  // let marker = new window.BMap.Marker(point)
  // map.addOverlay(marker)
  // map.enableScrollWheelZoom()
}