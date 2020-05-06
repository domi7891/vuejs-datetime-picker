<template>
  <div class="datepicker">
    <datepickerinput
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
      :showDayPicker="showDay"
      :firstDate="firstDayOfView"
      :isUTC="isUTC"
      :selectedDate="selectedDate"
      @monthChanged="dayPickerChangedMonth"
      @selectDate="selectDate"
      @closePicker="close"
      @openTimePicker="showTimePicker"
    >
    </pickday>

    <timepicker
      :showTimePicker="showTime"
      :selectedDate="selectedDate"
      @closePicker="close"
      @openCalendarPicker="showPicker"
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
  name: 'datepicker',
  components: {
    Datepickerinput,
    Pickday,
    Timepicker,
  },
  props: {
    name: String,
    format: { type: [String, Function], default: 'D dd MMM yyyy' },
    id: String,
    refName: String,
    placeholder: String,
    inputClass: String,
    timeClass: String,
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
    const curr = utils.setDayOfMonth(new Date(), 1)
    return {
      selectedDate: null,
      firstTimestamp: curr,
      typedDate: false,
      utils: utils,
      calendar: cal,
      showDay: false,
      showTime: true,
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
      this.$emit('selected', d)
    },

    selectDate(date) {
      this.setDate(date.timestamp)
    },
    showPicker() {
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
      this.close()
      this.selectedDate = this.selectedDate || new Date()
      this.showDay = true
      return true
    },

    showTimePicker() {
      this.close()
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
    },
  },
}
</script>

<style>
@import '../style/style.css';
</style>
