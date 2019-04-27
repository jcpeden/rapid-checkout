import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(VModal, { dynamic: true })

var rapidCheckoutInit = ($) => {
  $('body').append('<div id="rapid-checkout-wrapper"></div>');
  new Vue({
    render: h => h(App),
  }).$mount('#rapid-checkout-wrapper')
}


function loadScript(url, callback){

  var script = document.createElement("script")
  script.type = "text/javascript";

  if (script.readyState){  //IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
        script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
  loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js', function(){
      window.jQuery1110 = jQuery.noConflict(true);
      rapidCheckoutInit(jQuery1110);
    });
} else {
  rapidCheckoutInit(jQuery);
}
