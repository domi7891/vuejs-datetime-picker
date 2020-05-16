<template>
  <div id="id">
    <h1>Example of Vue.js Date Time Picker</h1>
    <div style="display: flex; justify-content: space-around; width: 60%">
      <datetimepicker
        value="05/02/2020 23:47"
        inputClass="test"
        :timeButtons="true"
        :editable="true"
        highestPicker="month"
        v-on:selected="getDate"
        v-on:cleared="getDate"
      ></datetimepicker>
      <!-- <datetimepicker
        inputClass="test"
        :timeButtons="true"
        :editable="true"
        v-on:selected="getDate"
        v-on:cleared="getDate"
      ></datetimepicker> -->
      <!-- <datetimepicker
        pickerId="picker3"
        inputClass="test"
        :timeButtons="true"
        :editable="true"
        v-on:selected="getDate"
        v-on:cleared="getDate"
      ></datetimepicker> -->
      <datepicker value="12 12 2020"></datepicker>
      <timepicker :timeButtons="true" value="05:47"></timepicker>
    </div>
    <span
      id="date"
      style="position: absolute; right: 0; top: 50%; width: 50%; height: 50px;"
    ></span>
  </div>
</template>

<script>
import {
  Datetimepicker,
  Datepicker,
  Timepicker,
  // } from '../dist/vuejs-datetime-picker.umd.min.js'
} from '../src/index'

export default {
  name: 'example',
  components: {
    Datetimepicker,
    Datepicker,
    Timepicker,
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
