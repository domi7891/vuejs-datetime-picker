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
      @showPicker="showTimePicker"
      @closePicker="close"
      @clear="clear"
    ></datepickerinput>
    <picktime
      ref="timepicker"
      :showTimePicker="showTime"
      :firstTime="firstDayOfView"
      :selectedDate="selectedDate"
      :customTimeClass="timeClass"
      :timeButtons="timeButtons"
      :id="pickerId"
      :dateAndTime="false"
      @closePicker="close"
      @selectTime="selectTime"
    ></picktime>
  </div>
</template>

<script>
import Datepickerinput from './DatePickerInput'
import Picktime from './subcomponents/PickTime'
import Calendar from '../utils/calendar'
import utils, { createUtils } from '../utils/PickerUtils'
import '../style/style.css'

export default {
  name: 'timepicker',
  components: {
    Datepickerinput,
    Picktime,
  },
  props: {
    value: {
      validator: val => utils.validate(val),
    },
    name: String,
    format: { type: [String, Function], default: 'HH:mm a' },
    pickerId: { type: String, default: 'timePicker' },
    inputId: String,
    refName: String,
    placeholder: {
      type: String,
      default: 'Pick Time',
    },
    inputClass: [String, Array, Object],
    timeClass: [String, Array, Object],
    wrapperClass: [String, Array, Object],
    timeButtons: { type: Boolean, default: false },
    disabled: Boolean,
    required: Boolean,
    editable: Boolean,
    isUTC: Boolean,
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
      showTime: false,
    }
  },
  watch: {
    value(val) {
      this.setValue(val)
    },
  },
  computed: {
    firstDayOfView() {
      return new Date(this.firstTimestamp)
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
        let [hours, minutes] = val.split(':')
        let parsed = new Date()
        parsed.setHours(hours, minutes)
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

    showTimePicker() {
      const d = new Date()
      if (this.selectedDate == null) this.selectedDate = d
      this.close()
      this.$refs.timepicker.setInitTime(
        this.selectedDate == null ? d : this.selectedDate
      )
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
