<template>
  <div class="datepicker" :class="wrapperClass" :id="pickerId">
    <datepickerinput
      ref="pickerinput"
      :selectedValue="selectedDate"
      :format="format"
      :id="inputId"
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
      v-if="canShowView('day')"
      ref="daypicker"
      :showDayPicker="showDay"
      :firstDate="firstDayOfView"
      :canShowView="canShowView"
      :isUTC="isUTC"
      :selectedDate="selectedDate"
      :customCalendarClass="calendarClass"
      :dateAndTime="true"
      @monthChanged="pickerChangedView"
      @selectDate="selectDate"
      @closePicker="close"
      @openTimePicker="showTimePicker"
      @openMonthPicker="showMonthPicker"
    >
    </pickday>
    <pickmonth
      v-if="canShowView('month')"
      ref="monthpicker"
      :showMonthPicker="showMonth"
      :firstDate="firstDayOfView"
      :canShowView="canShowView"
      :isUTC="isUTC"
      :selectedDate="selectedDate"
      :customCalendarClass="calendarClass"
      :dateAndTime="true"
      @selectMonth="selectMonth"
      @closePicker="close"
      @openTimePicker="showTimePicker"
      @openYearPicker="showYearPicker"
      @yearChanged="pickerChangedView"
    >
    </pickmonth>
    <pickyear
      v-if="canShowView('year')"
      ref="yearpicker"
      :showYearPicker="showYear"
      :firstDate="firstDayOfView"
      :canShowView="canShowView"
      :isUTC="isUTC"
      :selectedDate="selectedDate"
      :customCalendarClass="calendarClass"
      :dateAndTime="true"
      @selectYear="selectYear"
      @closePicker="close"
      @openTimePicker="showTimePicker"
      @decadeChanged="pickerChangedView"
    >
    </pickyear>

    <timepicker
      ref="timepicker"
      :showTimePicker="showTime"
      :selectedDate="selectedDate"
      :customTimeClass="timeClass"
      :timeButtons="timeButtons"
      :id="pickerId"
      :dateAndTime="true"
      @closePicker="close"
      @openCalendarPicker="showPicker"
      @selectTime="selectTime"
    ></timepicker>
  </div>
</template>

<script>
import Datepickerinput from './DatePickerInput'
import Pickday from './subcomponents/PickDay'
import Pickmonth from './subcomponents/PickMonth'
import Pickyear from './subcomponents/PickYear'
import Timepicker from './subcomponents/PickTime'
import Calendar from '../utils/calendar'
import utils, { createUtils } from '../utils/PickerUtils'

export default {
  name: 'datetimepicker',
  components: {
    Datepickerinput,
    Pickday,
    Pickmonth,
    Pickyear,
    Timepicker,
  },
  props: {
    value: {
      validator: val => utils.validate(val),
    },
    name: String,
    format: { type: [String, Function], default: 'dd/MM/yyyy HH:mm a' },
    pickerId: { type: String, default: 'picker' },
    inputId: String,
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
      showMonth: false,
      showYear: false,
      showTime: false,
    }
  },
  watch: {
    initialPicker() {
      this.setInitialPicker()
    },
    value(val) {
      this.setValue(val)
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.value) {
        this.setValue(this.value)
        this.$refs.pickerinput.setFocus()
      }
    },

    setValue(val) {
      if (typeof val === 'string') {
        let parsed = new Date(val)
        val = isNaN(parsed.valueOf()) ? null : parsed
      }
      if (!val) {
        this.setFirstDate()
        this.selectedDate = null
        return
      }
      this.selectedDate = val
      this.setFirstDate(val)
    },
    setFirstDate(date) {
      if (!date) {
        date = new Date()
      }
      this.firstTimestamp = this.utils.setDayOfMonth(new Date(date), 1)
    },

    pickerChangedView(date) {
      this.setFirstDate(date)
    },

    canShowView(view) {
      const views = ['day', 'month', 'year']
      const lowIndex = views.indexOf(this.lowestPicker)
      const highIndex = views.indexOf(this.highestPicker)
      const viewIndex = views.indexOf(view)

      return viewIndex >= lowIndex && viewIndex <= highIndex
    },

    setDate(date) {
      const d = new Date(date)
      this.selectedDate = d
      this.setFirstDate(d)
    },

    selectDate(date) {
      this.setDate(date.timestamp)
      this.$emit('changedDay', date)
      if (!this.timeButtons) this.$emit('selected', this.selectedDate)
    },

    selectMonth(month) {
      const date = new Date(month.timestamp)
      if (this.canShowView('day')) {
        this.setFirstDate(date)
        this.$emit('changedMonth', month)
        this.showDayPicker()
      } else {
        this.selectDate(month)
      }
    },

    selectYear(year) {
      const date = new Date(year.timestamp)
      if (this.canShowView('month')) {
        this.setFirstDate(date)
        this.$emit('changedYear', year)
        this.showMonthPicker()
      } else {
        this.selectDate(year)
      }
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
      if (!this.canShowView(picker)) {
        throw new Error(
          `initialView '${this.initialPicker}' cannot be rendered based on minimum '${this.lowestPicker}' and maximum '${this.highestPicker}'`
        )
      }
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
      if (!this.canShowView('day')) {
        return false
      }
      const d = new Date()
      this.close()
      this.selectedDate = this.selectedDate || d
      this.showDay = true
      return true
    },

    showMonthPicker() {
      if (!this.canShowView('month')) {
        return false
      }
      this.close()
      this.showMonth = true
      return true
    },

    showYearPicker() {
      if (!this.canShowView('year')) {
        return false
      }
      this.close()
      this.showYear = true
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
      this.showDay = this.showMonth = this.showYear = this.showTime = false
      this.$emit('pickerClosed')
    },
  },
}
</script>

<style lang="scss">
// @import '../style/style.css';
</style>
