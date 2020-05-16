import Vue from 'vue'
import Example from './Example.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(Example),
})
