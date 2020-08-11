<template>
  <div class="hello">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
const Cesium = require('cesium') //無法使用import方法
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  data() {
    return {
      viewer: {},
      taiwanPosition: {
        latitude: 23.6978,
        longitude: 120.9605
      }
    }
  },
  mounted() {
    this.initCesium()
    this.flyToTaiwan()
  },
  methods: {
    initCesium() {
      this.viewer = new Cesium.Viewer("cesiumContainer");
    },
    flyToTaiwan() {
      let { latitude, longitude } = this.taiwanPosition
      let height = 1000000
      this.viewer.camera.flyTo({ destination: new Cesium.Cartesian3.fromDegrees(longitude, latitude, height) })
    }
  }
}
</script>
<style scoped>
#cesiumContainer{
  width: 60vw;
  height: 60vh;
}
</style>
