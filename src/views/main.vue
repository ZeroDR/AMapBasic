<template>
  <div class="content">
    <div id="map"></div>
  </div>
</template>
<script>
  import RequestHandle from '@/request'
  import AMapUtil from '@/map/AMapUtil'
  import EnvironmentalUtil from '@/stand/EnvironmentalUtil'

  export default {
    name: 'Main',
    data () {
      return {
        source: {}
      };
    },
    created(){
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
          AMapUtil.render('map',this.loadedMap);
      },

      //加载地图
      loadedMap(){
          let t = this;
          let dt = {
            "geoType": "POINT",
            "attr": {
              "code": "27fc33a6-b08c-4cdb-82ff",
              "lc": "LAYER_GS",
              "lt": "MI",
              "vl": 93,
              "nm": "霸州市第三小学",
              "le": 2,
              "el": {
                context:"<div style='background:#ff0000;height:20px;width:20px;'></div>",
                height:20,
                width:20
              },
              "hd": true,
              "miu": "static/imgs/environmental/gs-g.png",
              "col": "#efdc31"
            },
            "geo": {
              "lng": 116.417,
              "lat": 39.124
            }
          };
        AMapUtil.loadedOverlay(dt, {hasEvent: true, fcbClick: t.requestMarker}, {hasEvent: false, hasValue: true});


        setTimeout(function(){
            AMapUtil.loadedPointSimplifier();
//            let ls = AMapUtil.getOverlayByLayerType('LAYER_GS','NAMEL');
//            AMapUtil.removeMapOverlay(ls);
            //AMapUtil.clearMapOverlay();
        },5000)
      },

      loadedGeo(){

      },

      //点击弹出框事件
      requestMarker(fc, callback){
          callback(fc,'<div style="height:120px;width:120px;background:#333;border:solid 1px #000;" onclick="alert(12)">123</div>',{width: 410, height: 'auto'});
      },

      //设置图表
      setGSChartData(code, data){
        let x = [];
        let y = [];
        let dt = [];
        let col = [];
        data.forEach(v => (dt.push({name: v.time, value: [v.time, v.value]}), x.push(v.time), y.push(v.value), col.push(EnvironmentalUtil.getColorByIndex(EnvironmentalUtil.getAQILevelIndex(v.value)))));
        let option = {
          data: dt,
          col: col
        };
        this.loadCharts(code, option);
      },

      //加载图表
      loadCharts(code, option){
        let echarts = require('echarts');
        let c = echarts.init(document.getElementById('citychart_' + code));
        let options = {
          title: {
            show: false
          },
          tooltip: {
            show: true,
            trigger: 'axis'
          },
          grid: {
            top: 10,
            bottom: 35
          },
          xAxis: [{
            type: 'time',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#333'
              }
            }
          }],
          yAxis: [{
            type: 'value',
            boundaryGap: [0, '100%'],
            splitNumber: 2,
            axisLine: {
              show: false
            },
            splitLine: {
              show: true
            },
            axisTick: {
              lineStyle: {
                color: 'none'
              }
            }
          }],
          series: [{
            name: '',
            type: 'bar',
            data: option.data,
            barWidth: '50%',
            itemStyle: {
              normal: {
                color: function (params) {
                  return option.col[params.dataIndex]
                }
              }
            }
          }]
        };
        c.setOption(options);
      },

      //数据转换 data:待转换数据 lc:图层标识 kf:唯一标识 vf:ValueField lt:点显示方式
      dataTransform(data, lc, kf, vf, lt){
        let rtValue = [];
        let fs = data.features;
        for (let i = 0, length = fs.length; i < length; i++) {
          let v = fs[i];
          let le = 0;
          switch (vf.toUpperCase()) {
            case 'AQI':
              le = EnvironmentalUtil.getAQILevelIndex(v[vf]);
              break;
            case 'SO2':
              le = EnvironmentalUtil.getSO2LevelIndex(v[vf]);
              break;
          }
          rtValue.push({
            geoType: 'POINT',
            attr: {
              code: v[kf],
              lc: lc,
              lt: lt,
              vl: v[vf],
              el:{
                context:'<div style="height:20px;width:20px;border-radius: 10px;background-color:#333;"></div>',
                height:20,
                width:20
              },
              nm: v.pointname,
              le: le,
              hd: false,//le > 3,
              miu: 'static/imgs/environmental/gs-g.png',//16*16
              col: EnvironmentalUtil.getColorByIndex(le)
            },
            geo: {
              lng: v.longitude,
              lat: v.latitude
            },
          });
        }
        return rtValue;
      },

      geoTransform(data, lc, lt){
        let rtValue = [];
        let fs = data.features;
        for (let i = 0, length = fs.length; i < length; i++) {
          let v = fs[i];
          let attr = v.attributes;
          attr['lc'] = lc;
          attr['lt'] = lt;
          rtValue.push({
            geoType: 'POLYGON',
            attr: attr,
            geo: v.geometry
          });
        }
        return rtValue;
      },

      handleClick(e){
        let els = document.getElementsByClassName('t-text');
        if (els.length) {
          for (let i = 0, length = els.length; i < length; i++) {
            els[i].style.width = this.hasClose ? '160px' : '0';
          }
        }
        this.hasClose = !this.hasClose;
      }
    }
  }
  ;
</script>
<style scoped>
  .content {
    position: relative;
    height: 100%;
  }

  #map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #333;
    position: absolute;
  }
</style>
