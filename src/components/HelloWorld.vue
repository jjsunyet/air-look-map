<template>
  <!--地图容器-->
  <div class="map-wrapper">
    <!--自定义工具按钮-->
      <ul class="customizing-tool-box">
        <li class="op-btn" @click="switchMapSize()">{{sizeSwitcher}}</li>
      </ul>
      <div class="map-container" id="container"></div>
    <div id='listcontent' class='listcontent'></div>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      sizeSwitcher:'放大',
      viewer:null,
      google:null,
      tileSet:null,
    }
  },
  methods:{
    switchMapSize(){
      switch (this.sizeSwitcher) {
        case "放大":
          this.sizeSwitcher = '缩小';
          break;
        case "缩小":
          this.sizeSwitcher = '放大';
          break;
      }
    },
    initAirLookMap(){
      let _this = this;
      _this.viewer = new AirlookMap.Map("container", {
        fullscreenButton: true,
        highlight: true
      });
      _this.google = new Cesium.UrlTemplateImageryProvider({
        url: "https://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 20,
      });
      _this.viewer.imageryLayers.addImageryProvider(_this.google);
      //3d图层配置
      _this.tileset = new Cesium.DE3DTileset({
        url:
          "https://dataearth-preset.bd.bcebos.com/system_resource/xinghan/model.json",
        shadows: Cesium.ShadowMode.ENABLED,
        viewer: _this.viewer,
      });
      //蒙3d图层
      _this.viewer.tilesetLayers.add(_this.tileset);
      //平滑移至3d图层位置
      _this.viewer.flyTo(_this.tileset);
    },
    //全球埃洛克地图
    initGlobalAirLookMap(){
      debugger
      this.viewer = new AirlookMap.Map('container',{
        // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //     url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        // }),
        baseLayerPicker: false,
        navigator: true, //右侧控件加载
        nightExchange: true, //增加夜空效果
      });
      //修改鼠标操作方式（默认鼠标中建旋转，右键zoom，以下方式为：中建zoom，右键旋转）
      this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
        {eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL},
        {eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL}
      ];
      this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
      ];

      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);//home定位到中国范围
      Cesium.Camera.DEFAULT_VIEW_FACTOR = 1.3;//缩放比例
    },
    bindEvents(){
      var initIndex = 0;
      for(let i=0;i<globalObj.datalist.length;i++){
        if(globalObj.modelname==globalObj.datalist[i].name){
          initIndex = i;
        }
        $("#listcontent").append("<div class='modelitem' data-name='"+globalObj.datalist[i].name+"' data-inx='"+i+"'>"+globalObj.datalist[i].name+"</div>");
      }
      // if(!getQueryString("name")){
      // 	$('#listcontent').show();
      // }
      // $('.modelitem[data-inx="'+initIndex+'"]').addClass('onclick');
      $('.modelitem').on('click',function(){
        $('.modelitem').removeClass('onclick');
        $(this).addClass('onclick');
        let inxval = $(this).attr('data-inx');
        globalObj.currentClickIndex = inxval;
        console.log(inxval);
        let cuuobj = globalObj.datalist[inxval];

        viewer.camera.flyTo({
          //fromRadians:弧度,fromDegrees:角度
          destination : Cesium.Cartesian3.fromDegrees(cuuobj.lng,cuuobj.lat,cuuobj.height),
          orientation : {
            heading : Cesium.Math.toRadians(cuuobj.heading),
            pitch : Cesium.Math.toRadians(cuuobj.pitch),
            roll : 0.0
          }
        });
      });

      //获取视角
      $('#getViewBtn').on('click',function(){
        var cartograhphic = viewer.camera.positionCartographic;
        var lng = parseFloat(Cesium.Math.toDegrees(cartograhphic.longitude).toFixed(5)),
          lat = parseFloat(Cesium.Math.toDegrees(cartograhphic.latitude).toFixed(5)),
          height = parseFloat(cartograhphic.height.toFixed(0)),
          heading = parseFloat((viewer.camera.heading* 180 / Math.PI).toFixed(3)),
          pitch = parseFloat((viewer.camera.pitch* 180 / Math.PI).toFixed(3));
        // $('#viewresult').html(lng+','+lat+','+height+'<br/>'+heading+'<br/>'+pitch);
        var resobj = {'name':globalObj.datalist[globalObj.currentClickIndex].name,'lng':lng,'lat':lat,'height':height,'heading':heading,'pitch':pitch};
        $('#viewresult').html(JSON.stringify(resobj));
      });
    }
  },
  mounted() {
    // this.bindEvents();
    this.initGlobalAirLookMap()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.map-wrapper{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0rem;
  top: 0rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .customizing-tool-box{
    position: absolute;
    right: 3rem;
    top: 1.5rem;
    z-index: 2;
    .op-btn{
      width: 4rem;
      height: 1.5rem;
      border-radius: 0.1875rem;
      background-color: rgba(95,158,160);
      color: rgba(255,255,255,1);
      font-weight: bold;
      text-align: center;
      line-height: 1.5rem;
      margin-right: .875rem;
    }
  }
  .map-container{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0rem;
    top: 0rem;
    z-index: 1;
  }
}
</style>
