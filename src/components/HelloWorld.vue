<template>
  <div class="hello">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
const Cesium = require('cesium') //無法使用import方法
import 'cesium/Build/Cesium/Widgets/widgets.css'
import squirtleImage from '@/assets/squirtle.png'
export default {
  data() {
    return {
      viewer: {},
      tileset: {},
      taiwanPosition: {
        latitude: 25.02593,
        longitude: 121.34340
      },
    }
  },
  mounted() {
    this.initCesium()
    this.addDragon()
    this.addImageToDragonCenter()
    this.addDebugModel()
  },
  methods: {
    initCesium() {
      this.viewer = new Cesium.Viewer("cesiumContainer");
    },
    addDragon() {
      let myTileset = new Cesium.Cesium3DTileset({
          url : '/my-dragon/tileset.json'
      })
      this.tileset = this.viewer.scene.primitives.add(myTileset);
      let heading = 1.2
      let pitch = 0
      let range = 0
      this.viewer.zoomTo(this.tileset, new Cesium.HeadingPitchRange(heading, pitch, range));
    },
    addImageToDragonCenter() {
      this.tileset.readyPromise.then(() => {
        let center = this.tileset.boundingSphere.center //龍的中心點
        let x = center.x
        let y = center.y
        let z = center.z
        let newCenter = new Cesium.Cartesian3(x, y, z)
        let newBillboardCollection = new Cesium.BillboardCollection()
        let billboards = this.viewer.scene.primitives.add(newBillboardCollection)
        billboards.add({
          position: newCenter,
          image: squirtleImage,
          width : 50,
          height : 100,
        })
      })
    },
    addDebugModel() {
      let myDebugMatrix = new Cesium.DebugModelMatrixPrimitive()
      this.viewer.scene.primitives.add(myDebugMatrix)
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
