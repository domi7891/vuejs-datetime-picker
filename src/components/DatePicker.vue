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
      :dateAndTime="false"
      @monthChanged="pickerChangedView"
      @selectDate="selectDate"
      @closePicker="close"
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
      :dateAndTime="false"
      @selectMonth="selectMonth"
      @closePicker="close"
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
      :dateAndTime="false"
      @selectYear="selectYear"
      @closePicker="close"
      @decadeChanged="pickerChangedView"
    >
    </pickyear>
  </div>
</template>

<script>
import Datepickerinput from './DatePickerInput'
import Pickday from './subcomponents/PickDay'
import Pickmonth from './subcomponents/PickMonth'
import Pickyear from './subcomponents/PickYear'
import Calendar from '../utils/calendar'
import { createUtils } from '../utils/PickerUtils'

export default {
  name: 'datepicker',
  components: {
    Datepickerinput,
    Pickday,
    Pickmonth,
    Pickyear,
  },
  props: {
    name: String,
    format: { type: [String, Function], default: 'dd/MM/yyyy' },
    pickerId: { type: String, default: 'picker' },
    inputId: String,
    refName: String,
    placeholder: {
      type: String,
      default: 'Pick Date',
    },
    inputClass: [String, Array, Object],
    calendarClass: [String, Array, Object],
    wrapperClass: [String, Array, Object],
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

    canShowView(view) {
      const views = ['day', 'month', 'year']
      const lowIndex = views.indexOf(this.lowestPicker)
      const highIndex = views.indexOf(this.highestPicker)
      const viewIndex = views.indexOf(view)

      return viewIndex >= lowIndex && viewIndex <= highIndex
    },

    pickerChangedView(date) {
      this.setFirstDate(date)
    },

    setDate(date) {
      const d = new Date(date)
      this.selectedDate = d
      this.setFirstDate(d)
    },

    selectDate(date) {
      this.setDate(date.timestamp)
      this.$emit('selected', this.selectedDate)
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

    clear() {
      this.selectedDate = null
      this.setFirstDate()
      this.$emit('cleared')
    },

    close() {
      this.showDay = this.showMonth = this.showYear = false
      this.$emit('pickerClosed')
    },
  },
}
</script>

<style lang="scss">
// @import '../style/style.css';
</style>
