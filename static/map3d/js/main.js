/********
***
***javascript
***
*********/
var globalObj = {};//全局变量
var viewer = null;

//当前模块的url，部分功能需要根据模块判断相关逻辑
globalObj.modelname = getQueryString("name") || "天津";
globalObj.currentClickIndex = -1;

globalObj.datalist = [
	{'name':'天津','lng':117.18343,'lat':39.02106,'height':5254,'heading':357.249,'pitch':-29.448},
	{"name":"湖南株洲","lng":113.07378,"lat":27.78950,"height":2257,"heading":1.685,"pitch":-26.109},
	{"name":"德清","lng":119.95494,"lat":30.50526,"height":1045,"heading":16.746,"pitch":-20.343},
	{"name":"乌兰察布","lng":113.13434,"lat":40.99435,"height":2799,"heading":353.985,"pitch":-23.53},
	{"name":"河南武陟","lng":113.40743,"lat":35.08075,"height":998,"heading":3.649,"pitch":-28.417},
	{"name":"哈尔滨市南岗区","lng":126.6769,"lat":45.7664,"height":638,"heading":348.816,"pitch":-29.378},
	{"name":"徐州","lng":117.18169,"lat":34.19327,"height":539,"heading":358.261,"pitch":-21.694},
	{"name":"稻城亚丁村","lng":100.33882,"lat":28.45236,"height":225,"heading":6.23,"pitch":-24.64},
	{"name":"四川省成都市都江堰市","lng":103.62388,"lat":30.92836,"height":2831,"heading":7.072,"pitch":-27.379},
	{"name":"海南儋州市","lng":109.56228,"lat":19.46911,"height":2192,"heading":16.799,"pitch":-22.064},
	{"name":"陕西省咸阳市兴平市","lng":108.45948,"lat":34.27588,"height":1486,"heading":19.56,"pitch":-20.209},
	{"name":"共青城市鄱阳湖模型基地","lng":115.8275,"lat":29.20055,"height":575,"heading":0.327,"pitch":-23.466},
	{"name":"安徽省黄山市","lng":118.29241,"lat":30.13929,"height":1025,"heading":12.654,"pitch":-28.947},
];

$(function(){
	domlistener();
	initMap();
});
function initMap(){
	viewer = new AirlookMap.Map('container',{
        // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //     url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        // }),
        baseLayerPicker: false,
        navigator: true, //右侧控件加载
        nightExchange: true, //增加夜空效果
    });
	//修改鼠标操作方式（默认鼠标中建旋转，右键zoom，以下方式为：中建zoom，右键旋转）
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
		Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
		{eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL},
		{eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL}
    ];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    	Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
    ];

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);//home定位到中国范围
	Cesium.Camera.DEFAULT_VIEW_FACTOR = 1.3;//缩放比例


 //    var initIndex = 0;
	// for(let i=0;i<globalObj.datalist.length;i++){
	// 	if(globalObj.modelname==globalObj.datalist[i].name){
	// 		initIndex = i;
	// 		break;
	// 	}
	// }
 //    var firstobj = globalObj.datalist[initIndex];
 //    setTimeout(function(){
 //    	viewer.camera.flyTo({
 //    		//fromRadians:弧度,fromDegrees:角度
 //            destination : Cesium.Cartesian3.fromDegrees(firstobj.lng,firstobj.lat,firstobj.height),
 //            orientation : {
 //                heading : Cesium.Math.toRadians(firstobj.heading),
 //                pitch : Cesium.Math.toRadians(firstobj.pitch),
 //                roll : 0.0
 //            }
 //        });
 //    },500);
}
function domlistener(){
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
//获取url传入的参数
function getQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  decodeURIComponent(r[2]); return null;
}
//根据名称飞行到指定位置
function flyToPosByName(name){
	let cuuobj = globalObj.datalist[0];
	for(let i=0;i<globalObj.datalist.length;i++){
		if(name==globalObj.datalist[i].name){
			cuuobj = globalObj.datalist[i];
			break;
		}
	}
	$('.modelitem').removeClass('onclick');
	$('.modelitem[data-name="'+name+'"]').addClass('onclick');

	viewer.camera.flyTo({
		//fromRadians:弧度,fromDegrees:角度
        destination : Cesium.Cartesian3.fromDegrees(cuuobj.lng,cuuobj.lat,cuuobj.height),
        orientation : {
            heading : Cesium.Math.toRadians(cuuobj.heading),
            pitch : Cesium.Math.toRadians(cuuobj.pitch),
            roll : 0.0
        }
    });
}
//窗体变大时显示列表，缩小不显示
function showDataList(isshow){
	$('#listcontent').css({'display':isshow?'block':'none'});
}
//定位到全球
function flyToChina(){
	viewer.scene.camera.setView({destination:new Cesium.Cartesian3.fromDegrees(107.515637, 31.105743, 10044209)});
}