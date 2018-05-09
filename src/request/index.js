import RequestConfig from '@/request/RequestConfig'
import Axios from 'axios'

export default {
  request(params, callback1, callback0){
    let qs = require('qs');
    let url = RequestConfig.getRequestUrlByType(params.ptype);
    let type = params.type.toUpperCase();
    let pms = params.pms;
    let hasLocal = params.hasLocal;
    type === 'GET' ? this.requestGET(url, pms, hasLocal, callback1, callback0) : this.requestPOST(url, pms, hasLocal, callback1, callback0);
  },
  requestGET(url, pms, hasLocal, callback1, callback0){
    Axios.get(url, {
      params: pms,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      responseType: 'json'
    }).then(function (result) {
      if (!result.data.errorcode) {
        let data = result.data;
        data = typeof data === 'string' ? JSON.parse(data) : data;
        data = hasLocal ? data : {
          success: data.hasOwnProperty('status') ? data.status : data.Status,
          history: data.history ? (typeof data.history === 'string' ? JSON.parse(data.history) : data.history) : undefined,
          features: (typeof data.obj === 'string' ? JSON.parse(data.obj) : data.obj) || (typeof data.Data === 'string' ? JSON.parse(data.Data) : data.Data)
        };
        callback1(data);
      }
      else {
        callback0(result.data);
      }
    }).catch(function (ex) {
      callback0(ex);
    })
  },
  requestPOST(url, pms, hasLocal, callback1, callback0){
    let qs = require('qs');
    Axios.post(url, qs.stringify(pms), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      responseType: 'json'
    }).then(function (result) {
      if (!result.data.errorcode) {
        let data = result.data;
        data = typeof data === 'string' ? JSON.parse(data) : data;
        data = hasLocal ? data : {
          success: data.hasOwnProperty('status') ? data.status : data.Status,
          history: data.history ? (typeof data.history === 'string' ? JSON.parse(data.history) : data.history) : undefined,
          features: (typeof data.obj === 'string' ? JSON.parse(data.obj) : data.obj) || (typeof data.Data === 'string' ? JSON.parse(data.Data) : data.Data)
        };
        callback1(data);
      }
      else {
        callback0(result.data);
      }
    }).catch(function (ex) {
      callback0(ex);
    })
  }
};
