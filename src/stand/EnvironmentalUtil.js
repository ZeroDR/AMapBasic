/**
 * Created by admin on 2018/1/5.
 */
export default {
  //根据污染等级获取颜色
  getColorByIndex(index) {
    let color = '#999';
    switch (index) {
      case 0:
        color = '#999';
        break;
      case 1:
        color = '#43ce17';
        break;
      case 2:
        color = '#efdc31';
        break;
      case 3:
        color = '#fa0';
        break;
      case 4:
        color = '#ff401a';
        break;
      case 5:
        color = '#d20040';
        break;
      case 6:
        color = '#9c0a4e';
        break;
    }
    return color;
  },

  //根据污染等级获取空气污染质量
  getQualityByLevel(index) {
    let quality = '无';
    switch (index) {
      case 0:
        quality = '无';
        break;
      case 1:
        quality = '优';
        break;
      case 2:
        quality = '良';
        break;
      case 3:
        quality = '轻度污染';
        break;
      case 4:
        quality = '中度污染';
        break;
      case 5:
        quality = '重度污染';
        break;
      case 6:
        quality = '严重污染';
        break;
    }
    return quality
  },

  //根据AQI值获取污染等级
  getAQILevelIndex(aqi) {
    aqi = parseInt(aqi);
    let level = 0;
    if (aqi === 0) {
      level = 0
    }
    else if (aqi <= 200) {
      level = Math.ceil(aqi / 50);
      if (level < 0) {
        level = 1;
      }
    }
    else if (aqi < 300) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据PM25监测值获取污染等级
  getPM25LevelIndex(pm2_5) {
    pm2_5 = parseInt(pm2_5);
    let level = 0;
    if (pm2_5 === 0) {
      level = 0;
    }
    else if (pm2_5 <= 35) {
      level = 1;
    }
    else if (pm2_5 <= 75) {
      level = 2;
    }
    else if (pm2_5 <= 115) {
      level = 3;
    }
    else if (pm2_5 <= 150) {
      level = 4;
    }
    else if (pm2_5 <= 250) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据PM10监测值获取污染等级
  getPM10LevelIndex(pm10) {
    pm10 = parseInt(pm10);
    let level = 0;
    if (pm10 === 0) {
      level = 0;
    }
    else if (pm10 <= 50) {
      level = 1;
    }
    else if (pm10 <= 150) {
      level = 2;
    }
    else if (pm10 <= 250) {
      level = 3;
    }
    else if (pm10 <= 350) {
      level = 4;
    }
    else if (pm10 <= 420) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据SO2监测值获取污染等级
  getSO2LevelIndex(so2) {
    so2 = parseInt(so2);
    let level = 0;
    if (so2 === 0) {
      level = 0;
    }
    else if (so2 <= 50) {
      level = 1;
    }
    else if (so2 <= 150) {
      level = 2;
    }
    else if (so2 <= 475) {
      level = 3;
    }
    else if (so2 <= 800) {
      level = 4;
    }
    else if (so2 <= 1600) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据NO2监测值获取污染等级
  getNO2LevelIndex(no2) {
    no2 = parseInt(no2);
    let level = 0;
    if (no2 === 0) {
      level = 0;
    }
    else if (no2 <= 40) {
      level = 1;
    }
    else if (no2 <= 80) {
      level = 2;
    }
    else if (no2 <= 180) {
      level = 3;
    }
    else if (no2 <= 280) {
      level = 4;
    }
    else if (no2 <= 565) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据O3监测值获取污染等级
  getO3LevelIndex(o3) {
    o3 = parseInt(o3);
    let level = 0;
    if (o3 === 0) {
      level = 0;
    }
    else if (o3 <= 160) {
      level = 1;
    }
    else if (o3 <= 200) {
      level = 2;
    }
    else if (o3 <= 300) {
      level = 3;
    }
    else if (o3 <= 400) {
      level = 4;
    }
    else if (o3 <= 800) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据CO监测值获取污染等级
  getCOLevelIndex(co) {
    co = parseInt(co);
    let level = 0;
    if (co === 0) {
      level = 0;
    }
    else if (co <= 2) {
      level = 1;
    }
    else if (co <= 4) {
      level = 2;
    }
    else if (co <= 14) {
      level = 3;
    }
    else if (co <= 24) {
      level = 4;
    }
    else if (co <= 36) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据综合指数计算值获取污染等级
  getComplexIndex(comp) {
    comp = parseInt(comp);
    let level = 0;
    if (comp === 0) {
      level = 0;
    }
    else if (comp <= 4) {
      level = 1;
    }
    else if (comp <= 6) {
      level = 2;
    }
    else if (comp <= 8) {
      level = 3;
    }
    else if (comp <= 10) {
      level = 4;
    }
    else if (comp <= 12) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据温度值获取状态等级
  getTempLevelIndex(temp) {
    temp = parseInt(temp);
    let level = 0;
    if (temp <= 0) {
      level = 1;
    }
    else if (temp <= 8) {
      level = 2;
    }
    else if (temp <= 16) {
      level = 3;
    }
    else if (temp <= 24) {
      level = 4;
    }
    else if (temp <= 32) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level
  },

  //根据湿气值获取状态等级
  getHumiLevelIndex(humi) {
    humi = parseInt(humi);
    let level = 0;
    if (humi === 0) {
      level = 0;
    }
    else if (humi <= 20) {
      level = 1;
    }
    else if (humi <= 40) {
      level = 2;
    }
    else if (humi <= 60) {
      level = 3;
    }
    else if (humi <= 80) {
      level = 4;
    }
    else if (humi <= 100) {
      level = 5;
    }
    return level;
  },

  //根据风力获取状态等级
  getWindLevelIndex(wind) {
    wind = parseInt(wind);
    let level = 0;
    if (value === 0) {
      level = 0;
    }
    else if (value <= 1) {
      level = 1;
    }
    else if (value <= 2) {
      level = 2;
    }
    else if (value <= 3) {
      level = 3;
    }
    else if (value <= 4) {
      level = 4;
    }
    else if (value <= 5) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  },

  //根据VOC监测值获取污染等级
  getVOCLevelIndex(voc) {
    voc = parseInt(voc);
    let level = 0;
    if (voc === 0) {
      level = 0;
    }
    else if (1 <= voc && voc <= 80) {
      level = 1;
    }
    else if (81 <= voc && voc <= 150) {
      level = 2;
    }
    else if (151 <= voc && voc <= 300) {
      level = 3;
    }
    else if (301 <= voc && voc <= 400) {
      level = 4;
    }
    else if (401 <= voc && voc <= 2000) {
      level = 5;
    }
    else {
      level = 6;
    }
    return level;
  }
}
