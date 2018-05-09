/**
 * Created by admin on 2018/1/5.
 * 涉及属性对象标准
 * 如:{geoType:'',attr:{code:'',lng:'',lat:'',vl:'',nm:'',lt:'',col:'',miu:'',le:''},geo:{lng:'',lat:''}}
 * 说明:
 * geoType:空间数据类别（点、线、面）
 * code:唯一标识
 * lng:经度
 * lat:纬度
 * vl:显示值
 * nm:名称
 * lc:图层名称(唯一标识)
 * el:{context:'',height:20,width:20}显示HTML标签，仅lt为EL时有效果
 * lt:图层类型(LL:两个Label ML:Marker和Label MI:Marker和Icon NL:NameLabel VL:ValueLabel)
 * col:状态颜色
 * miu:图标路径
 * le:污染等级
 * hd:是否警报(默认判断为污染等级，也可自定义)
 */
import AMap from 'AMap'
import AMapUI from 'AMapUI'

export default{
  map: undefined,//地图对象
  center: [116.417, 39.127],//默认城市名称
  defaultZoom: 10,//默认地图比例
  style: 'blue',//地图默认样式
  hasLoaded: false,//是否初次加载
  lsMarker: [],//marker集合
  lsRedLabel: [],//预警Label集合
  lsNameLabel: [],//显示值Label集合,
  lsPolygon: [],//面集合
  mouseLabel: undefined,//鼠标Label集合
  searchInfoWindow: undefined,//弹出信息框

  //重置MapUtil
  reset(){
    this.map = undefined;
    this.hasLoaded = false;
    this.lsMarker.length = 0;
    this.lsRedLabel.length = 0;
    this.lsNameLabel.length = 0;
    this.mouseLabel = undefined;
    this.searchInfoWindow = undefined;
  },

  //初始化地图 el:地图容器Id fcb:地图加载完回调函数
  render(el, fcb){
    this.createMap(el, fcb);
  },

  //创建地图对象 el:地图容器Id fcb:地图加载完回调函数
  createMap(el, fcb){
    this.map = new AMap.Map(el, {
      resizeEnable: true,
      zoom: 10,
      center: this.center
    });
    this.map.setMapStyle('amap://styles/' + this.style);

    this.map.on('complete', function () {
      fcb();
    });
  },

  //加载数据 a:属性集合 fcbClick:点击回调函数 fcbMouse:鼠标事件
  loadedOverlay(a, fcbClick, fcbMouse){
    let t = this;
    let attr = a.attr;
    if (attr.hd) {
      let rl = this.createRedLabel(a, false);
      rl && (this.addMapOverlay(rl, 'RLABEL', attr.lc));
    }
    switch (attr.lt) {
      case 'LL':
        let vll = this.createValueLabel(a);
        let nll = this.createNameLabel(a);
        vll && (this.addMapOverlay(vll, 'MARKER', attr.lc), vll.attributes = a, this.overlayEvent(vll, fcbClick, fcbMouse));
        nll && (this.addMapOverlay(nll, 'NAMEL', attr.lc));
        break;
      case 'ML':
        let mkl = this.createMarker(a, true);
        mkl && (this.addMapOverlay(mkl, 'MARKER', attr.lc), mkl.attributes = a, this.overlayEvent(mkl, fcbClick, fcbMouse));
        break;
      case 'MI':
        let mki = this.createMarker(a, false);
        mki && (this.addMapOverlay(mki, 'MARKER', attr.lc), mki.attributes = a, this.overlayEvent(mki, fcbClick, fcbMouse));
        break;
      case 'VL':
        let vl = this.createValueLabel(a);
        vl && (this.addMapOverlay(vl, 'MARKER', attr.lc), vl.attributes = a, this.overlayEvent(vl, fcbClick, fcbMouse));
        break;
      case 'NL':
        let nl = this.createNameLabel(a, true);
        nl && (this.addMapOverlay(nl, 'NAMEL', attr.lc));
        break;
      case 'EL':
        let el = this.createElementLabel(a);
        el && (this.addMapOverlay(el, 'MARKER', attr.lc), el.attributes = a, this.overlayEvent(el, fcbClick, fcbMouse));
        break;
      case 'OP':
        let op = this.createPolygon(a);
        op && op.forEach(v => (t.addMapOverlay(v, 'POLYGON', attr.lc), v.attributes = attr));
        break;
    }
  },

  //加载海量点
  loadedPointSimplifier(){
    const t = this;
    AMapUI.loadUI(['misc/PointSimplifier'], function (PointSimplifier) {
      if (!PointSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }
      //启动页面
      let pointSimplifierIns = new PointSimplifier({
        map: t.map, //关联的map
        compareDataItem: function (a, b, aIndex, bIndex) {
          //数据源中靠后的元素优先，index大的排到前面去
          return aIndex > bIndex ? -1 : 1;
        },
        getPosition: function (dataItem) {
          //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
          return dataItem.position;
        },
        getHoverTitle: function (dataItem, idx) {
          //返回数据项的Title信息，鼠标hover时显示
          return '序号: ' + idx;
        },
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          //点的样式
          pointStyle: {
            height: 6,
            width: 6,
            content: (ctx, x, y, width, height) => {
              ctx.moveTo(x, y); //移动到左上角

              ctx.lineTo(x + width, y);  //连接到右上角

              ctx.lineTo(x + width, y + height);//连接到右下角

              ctx.lineTo(x, y + height); //连接到左下角

              ctx.lineTo(x, y);//连接到左上角
            }
          },
          hoverTitleStyle: {
            position: 'top'
          }, getGroupId: (item, idx) => {
            return idx;
          }, groupStyleOptions: (gid) => {
            return {
              pointStyle: {
                fillStyle: '#' + Math.floor(Math.random() * 16777215).toString(16)
              }
            };
          }
        }
      });
      //随机创建一批点，仅作示意
      let data = t.createPoints(t.map.getCenter(), 100000);

      //设置数据源，data需要是一个数组
      pointSimplifierIns.setData(data);
    });
  },

  createPoints(center, num) {
    let data = [];
    for (let i = 0, len = num; i < len; i++) {
      data.push({
        position: [
          center.getLng() + (Math.random() > 0.5 ? 1 : -1) * Math.random(),
          center.getLat() + (Math.random() > 0.5 ? 1 : -1) * Math.random()
        ],
        attr: {
          name: '12'
        }
      });
    }
    return data;
  },

  //创建Marker a(attributes):空间信息及属性信息 hasLabel:Marker是否加载Label
  createMarker(a, hasLabel){
    let geo = a.geo;
    let attr = a.attr;
    let pt = this.createPoint(geo.lng, geo.lat);
    let icon = new AMap.Icon({
      image: attr.miu,
      imageSize: new AMap.Size(16, 16)
    });
    let m = new AMap.Marker({
      position: pt,
      icon: icon,
      offset: new AMap.Pixel(-8, -8)
    });

    if (hasLabel) {
      let l = this.createMarkerLabel(a, true);
      l && m.setLabel(l)
    }
    return m;
  },

  //创建Label a(attributes):空间信息及属性信息 说明：显示点名称 hasArrow:是否带箭头 默认:false
  createMarkerLabel(a, hasArrow){
    let attr = a.attr;
    let value = attr.nm;
    return {
      offset: new AMap.Pixel(-((value.length * 12 + 5) / 2 ), 22),
      content: ('<span style="padding:0 5px;">' + (value || '--') + '</span>') + (hasArrow ? ('<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;  margin-top:-24px;margin-left:' + (value.length * 7 - 9) + 'px  " ></div>') : '')
    };
  },

  //创建Label a(attributes):空间信息及属性信息 说明：显示点名称 hasArrow:是否带箭头 默认:false
  createNameLabel(a, hasArrow){
    let geo = a.geo;
    let attr = a.attr;
    let pt = this.createPoint(geo.lng, geo.lat);
    let value = attr.nm;
    let txt = new AMap.Text({
      text: ('<span style="padding:0 5px;">' + (value || '--') + '</span>') + (hasArrow ? ('<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;  margin-top:-24px;margin-left:' + (value.length * 7 - 9) + 'px  " ></div>') : ''),
      position: pt,
      style: {
        'border': 'none',
        'color': '#333',
        'background': 'rgba(255, 255, 255, 0.8)',
        'fontSize': '14px',
        'fontFamily': 'Microsoft YaHei',
        'boxShadow': '1px 3px 4px rgba(0,0,0,0.18)',
        'padding': '0 5px'
      }
    });
    hasArrow ? (txt.setOffset(new AMap.Pixel(8, 16))) : (txt.setOffset(new AMap.Pixel(0, 14)));
    return txt;
  },

  //创建污染指标值Label a:属性信息
  createValueLabel(a){
    let geo = a.geo;
    let attr = a.attr;
    let pt = this.createPoint(geo.lng, geo.lat);
    return new AMap.Text({
      text: ((attr.vl || '--') + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:' + attr.col + '; position: absolute;  margin-top:-2px;margin-left:10px  " ></div>'),
      style: {
        'color': attr.le > 3 ? '#fff' : '#333',
        'background': attr.col,
        'fontSize': '14px',
        'border': 'none',
        'width': '36px',
        'textAlign': 'center',
        'height': '22px',
        'lineHeight': '22px',
        'borderRadius': '4px'
      },
      position: pt,
      offset: new AMap.Pixel(0, -14)
    });
  },

  //创建标签元素
  createElementLabel(a){
    let geo = a.geo;
    let pt = this.createPoint(geo.lng, geo.lat);
    let domElement = a.attr.el;
    let elContext = domElement.context;
    return new AMap.Text({
      text: elContext,
      position: pt,
      style: {
        'border': 'none',
        'background': 'none',
        'height': (domElement.height || 20) + 'px',
        'width': (domElement.width || 20) + 'px',
      }
    });
  },

  //创建警报Label a:属性信息 hasIcon:是否为动态图片
  createRedLabel(a, hasIcon){
    let geo = a.geo;
    let labelRed = undefined;
    let pt = this.createPoint(geo.lng, geo.lat);
    if (!hasIcon) {
      let elContext = '<div class="pulse"></div><div class="pulse1"></div>';
      labelRed = new AMap.Text({
        text: elContext,
        position: pt,
        style: {
          border: 'none',
          background: 'none',
          height: '60px',
          width: '60px'
        }
      });
    } else {
      let imgUrl = 'static/imgs/main/red10.gif';
      let icon = new BMap.Icon(imgUrl, new BMap.Size(64, 64));
      labelRed = new BMap.Marker(pt, {
        icon: icon,
        offset: new BMap.Size(-5, -5)
      });
    }
    return labelRed;
  },

  //创建点对象 lng:经度 lat:纬度 hasTransform:是否坐标转换  默认百度坐标
  createPoint(lng, lat){
    return new AMap.LngLat(lng, lat);
  },

  //创建弹出框 a:属性信息 el:弹出框标签字符串 fs:设置弹出框高度和宽度 fcbClose:弹出框关闭回调函数
  createInfoWindow(a, el, fs, fcbClose){
    let geo = a.geo;
    let attr = a.attr;
    let pt = this.createPoint(geo.lng, geo.lat);
    const t = this;
    AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {
      t.searchInfoWindow = new SimpleInfoWindow({
        infoTitle: '弹出框',
        infoBody: el,
        autoMove: true
      });
      t.searchInfoWindow.open(t.map, pt);
    });
  },

  //地图添加覆盖物集合 o:覆盖物 ot:覆盖物类型 lc:图层标识
  addMapOverlay(o, ot, lc){
    o && (ot === 'MARKER' ? (this.lsMarker.push({overlay: o, type: lc}), this.map.add(o))
      : (ot === 'RLABEL' ? (this.lsRedLabel.push({overlay: o, type: lc}), this.map.add(o))
        : (ot === 'NAMEL' ? (this.lsNameLabel.push({overlay: o, type: lc}), this.map.add(o))
          : (ot === 'POLYGON' && (this.lsPolygon.push({overlay: 0, type: lc}, this.map.add(o)))))));
  },

  //覆盖物添加事件 o:覆盖物 efc:是否注册点击事件,包含回调函数({hasEvent:true|false,fcbClick:fun}) efm:是否注册鼠标事件,包含回调函数({hasEvent:true|false,fcbOver:fun,fcbOut:fun})
  overlayEvent(o, efc, efm){
    let t = this;
    (efc && efc.hasEvent) && (o.on('click', function (e) {
      let tg = e.target || e.currentTarget;
      let atr = tg.attributes;
      efc.fcbClick(atr, function (attr, res, fs) {
        t.createInfoWindow(attr, res, fs);
      });
    }));
    (efm && efm.hasEvent) && (o.on('mouseover', function (e) {
      let tg = e.target || e.currentTarget;
      let atr = tg.attributes;
      !t.mouseLabel ? t.createMouseLabel(atr, efm.hasValue) : t.setMouseLabelContent(atr, efm.hasValue);
    }), o.on('mouseout', function (e) {
      t.mouseLabel && t.mouseLabel.hide();
    }));
  },

  //根据图层类型和集合类型获取检索集合 lc:图层标识  ot:覆盖物类型
  getOverlayByLayerType(lc, ot){
    let ls = [];
    switch (ot.toUpperCase()) {
      case 'MARKER':
        ls = this.lsMarker;
        break;
      case 'RLABEL':
        ls = this.lsRedLabel;
        break;
      case 'NAMEL':
        ls = this.lsNameLabel;
        break;
      case 'POLYGON':
        ls = this.lsPolygon;
        break;
      default:
        ls = [];
        break;
    }
    return ls.filter(v => v.type.toUpperCase() === lc.toUpperCase());
  },

  //地图删除覆盖物集合 lsOverlay:覆盖物集合
  removeMapOverlay(lsOverlay){
    let t = this;
    lsOverlay.forEach(v => t.map.remove(v.overlay));
  },

  //清除地图MouseLabel
  removeMouseLabel(){
    this.mouseLabel && (this.map.remove(this.mouseLabel), this.mouseLabel = undefined);
  },

  //清除地图上所有覆盖物
  clearMapOverlay(){
    this.map.clearMap();
  },

  //设置默认城市 name:默认城市
  setCenterName(lng, lat){
    this.center = [lng, lat];
  },

  //设置默认地图比例 zoom:默认比例
  setDefaultZoom(zoom){
    this.defaultZoom = zoom;
  },

  //设置地图样式 style:默认地图样式
  setDefaultStyle(style){
    this.style = style;
    this.map.setMapStyle('amap://styles/' + style);
  }
}
