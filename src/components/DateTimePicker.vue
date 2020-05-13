<template>
  <div class="datepicker" :class="wrapperClass">
    <datepickerinput
      ref="pickerinput"
      :selectedValue="selectedDate"
      :format="format"
      :id="id"
      :name="name"
      :refName="refName"
      :placeholder="placeholder"
      :customInputClass="inputClass"
      :disabled="disabled"
      :required="required"
      :editable="editable"
      :isUTC="isUTC"
      @showPicker="showPicker"
      @closePicker="close"
      @clear="clear"
    ></datepickerinput>
    <pickday
      ref="daypicker"
      :showDayPicker="showDay"
      :firstDate="firstDayOfView"
      :isUTC="isUTC"
      :selectedDate="selectedDate"
      :customCalendarClass="calendarClass"
      @monthChanged="dayPickerChangedMonth"
      @selectDate="selectDate"
      @closePicker="close"
      @openTimePicker="showTimePicker"
    >
    </pickday>

    <timepicker
      ref="timepicker"
      :showTimePicker="showTime"
      :selectedDate="selectedDate"
      :customTimeClass="timeClass"
      :timeButtons="timeButtons"
      @closePicker="close"
      @openCalendarPicker="showPicker"
      @selectTime="selectTime"
    ></timepicker>
  </div>
</template>

<script>
import Datepickerinput from './DatePickerInput'
import Pickday from './PickDay'
import Timepicker from './TimePicker'
import Calendar from '../utils/calendar'
import { createUtils } from '../utils/PickerUtils'

export default {
  name: 'datetimepicker',
  components: {
    Datepickerinput,
    Pickday,
    Timepicker,
  },
  props: {
    name: String,
    format: { type: [String, Function], default: 'dd/MM/yyyy HH:mm a' },
    id: String,
    refName: String,
    placeholder: {
      type: String,
      default: 'Pick Date-Time',
    },
    inputClass: [String, Array, Object],
    timeClass: [String, Array, Object],
    calendarClass: [String, Array, Object],
    wrapperClass: [String, Array, Object],
    timeButtons: { type: Boolean, default: false },
    disabled: Boolean,
    required: Boolean,
    editable: Boolean,
    isUTC: Boolean,
    initialPicker: String,
    lowestPicker: {
      type: String,
      default: 'day',
    },
    highestPicker: {
      type: String,
      default: 'year',
    },
  },
  data() {
    const cal = Calendar
    const utils = createUtils(this.isUTCisUTC)
    const d = new Date()
    const curr = utils.setDayOfMonth(d, 1)
    return {
      selectedDate: null,
      firstTimestamp: curr,
      typedDate: false,
      utils: utils,
      calendar: cal,
      showDay: false,
      showTime: false,
    }
  },
  watch: {
    initialPicker() {
      this.setInitialPicker()
    },
  },
  computed: {
    firstDayOfView() {
      return new Date(this.firstTimestamp)
    },
    checkInitialPicker() {
      if (!this.initialPicker) return this.lowestPicker
      return this.initialPicker
    },
  },
  methods: {
    setFirstDate(date) {
      if (!date) {
        date = new Date()
      }
      this.firstTimestamp = this.utils.setDayOfMonth(new Date(date), 1)
    },

    dayPickerChangedMonth(date) {
      this.setFirstDate(date)
    },

    setDate(date) {
      const d = new Date(date)
      this.selectedDate = d
      this.setFirstDate(d)
    },

    selectDate(date) {
      this.setDate(date.timestamp)
      if (!this.timeButtons) this.$emit('selected', this.selectedDate)
    },

    selectTime(date, close) {
      this.setDate(date)
      if (this.timeButtons && close) this.$refs.pickerinput.removeInputFocus()
      this.$emit('selected', this.selectedDate)
    },

    showPicker() {
      this.$emit('pickerOpened')
      this.setInitialPicker()
    },

    setInitialPicker() {
      const picker = this.checkInitialPicker
      switch (picker) {
        case 'month':
          this.showMonthPicker()
          break
        case 'year':
          this.showYearPicker()
          break
        default:
          this.showDayPicker()
          break
      }
    },

    showDayPicker() {
      const d = new Date()
      this.close()
      this.selectedDate = this.selectedDate || d
      this.showDay = true
      return true
    },

    showTimePicker() {
      this.close()
      this.$refs.timepicker.setInitTime()
      this.showTime = true
      return true
    },

    clear() {
      this.selectedDate = null
      this.setFirstDate()
      this.$emit('cleared')
    },

    close() {
      this.showDay = this.showTime = false
      this.$emit('pickerClosed')
    },
  },
}
</script>

<style>
@import '../style/style.css';
</style>
