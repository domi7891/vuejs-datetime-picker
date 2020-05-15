<template>
  <div id="id">
    <h1>Example of Vue.js Date Time Picker</h1>
    <div style="display: flex; justify-content: space-around; width: 60%">
      <datetimepicker
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
      <datepicker></datepicker>
      <timepicker :timeButtons="true"></timepicker>
    </div>
    <span
      id="date"
      style="position: absolute; right: 0; top: 50%; width: 50%; height: 50px;"
    ></span>
  </div>
</template>

<script>
import Datetimepicker from '../src/components/DateTimePicker.vue'
import Datepicker from '../src/components/DatePicker.vue'
import Timepicker from '../src/components/TimePicker.vue'

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
