export default {
  development: [{
    site: 'http://devgkptfc.zhiscity.com',
    port: '',
    path: '/api'
  }, {
    site: 'http://devgkptplat.zhiscity.com',
    port: '',
    path: '/api'
  }],
  release: [{
    site: 'http://gkpt.zq12369.com:8015',
    port: '',
    path: '/api'
  }, {
    site: 'http://gkpt.zq12369.com:8016',
    port: '',
    path: '/api'
  }],
  getRequestUrlByType(type){
    console.log(process.env.API_ROOT);
    let apiConfig = this.release;
    (process.env.API_ROOT === 'PROD') && (apiConfig = this.release);
    let url = undefined;
    let cf = undefined;
    switch (type.toUpperCase()) {
      case 'GSCITYPOLLUTION':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetJjjAnd226MonitorList';
        break;
      case 'GSCITYPOLLUTIONCHART':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetJjjAnd226Detail';
        break;
      case 'LAYERONE':
        url = 'static/data/TY1.json';
        break;
    }
    return url;
  }
}
