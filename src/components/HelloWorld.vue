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
        latitude: 25.02593,
        longitude: 121.34340
      },
      templeUrl: '/canet/tp90-1/model/105001.kmz'
    }
  },
  mounted() {
    this.initCesium()
    this.addDragon()
  },
  methods: {
    initCesium() {
      this.viewer = new Cesium.Viewer("cesiumContainer");
    },
    addDragon() {
      let myTileset = new Cesium.Cesium3DTileset({
          url : '/my-dragon/tileset.json'
      })
      let tileset = this.viewer.scene.primitives.add(myTileset);
      this.viewer.zoomTo(tileset);
    },
    flyToTaiwan() {
      let { latitude, longitude } = this.taiwanPosition
      let height = 1000
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
