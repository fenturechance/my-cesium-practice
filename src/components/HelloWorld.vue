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
      myBillboard: {}
    }
  },
  mounted() {
    this.initCesium()
    this.addDragon()
    this.addImageToDragonCenter()
    this.addXYZArrow()
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
      let heading = 0.5
      let pitch = -0.5
      let range = 0
      this.viewer.zoomTo(this.tileset, new Cesium.HeadingPitchRange(heading, pitch, range));
    },
    addImageToDragonCenter() {
      this.tileset.readyPromise.then(() => {
        let center = this.tileset.boundingSphere.center //龍的中心點
        let cartographic  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(center);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude)
        let latitude = Cesium.Math.toDegrees(cartographic.latitude)
        let height = cartographic.height + 500
        let newCenter = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
        let newBillboardCollection = new Cesium.BillboardCollection()
        this.myBillboard = this.viewer.scene.primitives.add(newBillboardCollection)
        this.myBillboard.add({
          position: newCenter,
          image: squirtleImage,
          width : 50,
          height : 100,
        })
      })
    },
    addXYZArrow() {
      this.tileset.readyPromise.then(() => {
        let center = this.tileset.boundingSphere.center
        let axisX = this.addOneArrow({ color: Cesium.Color.RED, position: center, id: 1 })
        let axisY = this.addOneArrow({ color: Cesium.Color.GREEN, position: center, id: 2 })
        let axisZ = this.addOneArrow({ color: Cesium.Color.BLUE, position: center, id: 3 })
        axisX = this.rotatePrimitive('x', axisX)
        axisY = this.rotatePrimitive('y', axisY)
        this.viewer.scene.primitives.add(axisX)
        this.viewer.scene.primitives.add(axisY)
        this.viewer.scene.primitives.add(axisZ)
      })
    },
    addOneArrow(option) {
      const { color, position, id } = option
      const cylinderOption = {
        length: 3000,
        topRadius: 3,
        bottomRadius: 3,
      }
      const cylinder = new Cesium.CylinderGeometry(cylinderOption)
      const line = Cesium.CylinderGeometry.createGeometry(cylinder)
      const arrowOption = {
        length: 50,
        topRadius: 0,
        bottomRadius: 12
      }
      const arrowCylinder = new Cesium.CylinderGeometry(arrowOption)
      const arrow = Cesium.CylinderGeometry.createGeometry(arrowCylinder)
      let offset = ( 3000 + 50 ) / 2
      this.translateArrowPosition(arrow, [0, 0, offset])
      const myAppearance = {
        material: Cesium.Material.fromType('Color', { color })
      }
      const myPrimitiveOption = {
        asynchronous: false,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
        geometryInstances: [
          new Cesium.GeometryInstance({ geometry: line, id: `line${id}` }),
          new Cesium.GeometryInstance({ geometry: arrow, id: `arrow${id}` })
        ],
        appearance: new Cesium.MaterialAppearance(myAppearance)
      }
      const myPrimitive = new Cesium.Primitive(myPrimitiveOption)
      return myPrimitive
    },
    translateArrowPosition(geometry, offset) {
      if(!Array.isArray(offset)) return
      const scratchOffset = new Cesium.Cartesian3()
      scratchOffset.x = offset[0] //0
      scratchOffset.y = offset[1] //0
      scratchOffset.z = offset[2] //長度除以2
      let geometryPositionLength = geometry.attributes.position.values.length
      for (let i = 0; i < geometryPositionLength; i += 3) {
        geometry.attributes.position.values[i] += scratchOffset.x //0
        geometry.attributes.position.values[i + 1] += scratchOffset.y //0
        geometry.attributes.position.values[i + 2] += scratchOffset.z //長度除以2
      }
    },
    rotatePrimitive(type, primitive) {
      let myFunction = type == 'x' ? 'fromRotationX' : 'fromRotationY'
      const degree = Cesium.Matrix3[myFunction](Cesium.Math.toRadians(90));
      const rotation = Cesium.Matrix4.fromRotationTranslation(degree);
      const myLine = primitive.geometryInstances[0].modelMatrix
      const myArrow = primitive.geometryInstances[1].modelMatrix
      Cesium.Matrix4.multiply( myLine, rotation, myLine ); //left, right, result //矩陣相加
      Cesium.Matrix4.multiply( myArrow, rotation, myArrow );
      return primitive
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
