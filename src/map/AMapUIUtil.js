/**
 * Created by admin on 2018/4/19.
 */
import AMapUI from 'AMapUI'

export default {
  SimpleInfoWindow:undefined,
  loadUI(){
    const t = this;
    AMapUI.loadUI(['overlay/SimpleInfoWindow'], (SimpleInfoWindow) => {
      t.SimpleInfoWindow = SimpleInfoWindow;
    });
  }
}
