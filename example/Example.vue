<template>
  <div id="id">
    <h1>Example of Vue.js Date Time Picker</h1>
    <div>
      <datepicker
        inputClass="test"
        :timeButtons="false"
        :editable="true"
        v-on:selected="getDate"
        v-on:cleared="getDate"
      ></datepicker>
    </div>
    <span id="date"></span>
  </div>
</template>

<script>
import Datepicker from '../src/components/DatePicker.vue'

export default {
  name: 'example',
  components: {
    Datepicker,
  },
  data() {
    return {
      name: 'hi',
    }
  },
  methods: {
    getDate(date) {
      this.$el.querySelector('#date').innerHTML = date || ''
    },
  },
}
</script>

<style></style>
