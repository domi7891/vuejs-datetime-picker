<template>
  <div id="id" class="w-70">
    <h1>Example of Vue.js Date-Time Picker</h1>
    <div class="row dflex just-spbt w-90">
      <div class="column">
        <h3>Default DateTimePicker</h3>
        <datetimepicker></datetimepicker>
      </div>
      <div class="column">
        <h3>Default DatePicker</h3>
        <datepicker></datepicker>
      </div>
      <div class="column">
        <h3>Default TimePicker</h3>
        <timepicker></timepicker>
      </div>
    </div>

    <div class="row-wrapper dflex just-spbt w-95">
      <div class="row dflex just-spbt float-l">
        <div class="column">
          <h3>Start Value:</h3>
          <datetimepicker
            :value="new Date()"
            :disableDates="{
              years: {
                function: date => {
                  if (date.getFullYear() % 7 == 0) return true
                },
              },
            }"
          ></datetimepicker>
        </div>
      </div>
      <div class="row dflex just-spbt float-l">
        <div class="column">
          <h3>Start Value:</h3>
          <datetimepicker :value="new Date()"></datetimepicker>
        </div>
      </div>
      <div class="row dflex just-spbt float-l">
        <div class="column">
          <h3>Start Value:</h3>
          <datetimepicker :value="new Date()"></datetimepicker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Datetimepicker, Datepicker, Timepicker } from '../src/index'

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
    changed(date) {
      console.log(date)
    },
    newHour(hour) {
      console.log(hour)
    },
    customFormatter(date) {
      return (
        date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
      )
    },
  },
}
</script>

<style lang="scss">
@import './example.scss';
</style>
