<template>
  <div
    v-show="showMonthPicker"
    :class="[customCalendarClass, 'calendar']"
    v-on:mousedown.prevent
  >
    <div class="info">
      <span class="year" v-html="currentYearName"></span>
      <span class="dayMonth" v-html="getDayMonthString()"></span>
    </div>
    <div class="calWrapper">
      <header>
        <span class="prev" v-on:click="prev"></span>
        <span
          class="togglePickers"
          v-on:click="showYearPicker"
          style="cursor: pointer;"
          >{{ currentYearName }}</span
        >
        <span class="next" v-on:click="next"></span>
      </header>
      <div>
        <span
          class="col cal-month"
          v-for="m in months"
          :key="m.timestamp"
          :class="{ selected: m.selected }"
          v-on:click="select(m)"
          >{{ m.month }}</span
        >
      </div>
    </div>
    <footer v-if="dateAndTime">
      <span class="toTimePicker" v-on:click="toTimePicker"></span>
    </footer>
  </div>
</template>

<script>
import calendar from '../../utils/calendar'
import { createUtils } from '../../utils/PickerUtils'
export default {
  props: {
    showMonthPicker: Boolean,
    customCalendarClass: [String, Object, Array],
    firstDate: Date,
    isUTC: Boolean,
    selectedDate: Date,
    dateAndTime: Boolean,
  },
  data() {
    const utils = createUtils(this.isUTC)
    return {
      utils: utils,
    }
  },
  computed: {
    months() {
      const d = this.createDateObject()
      let months = []

      for (let i = 0; i < 12; i++) {
        months.push(this.createMonthObject(d, i))
        this.utils.setMonth(d, this.utils.getMonth(d) + 1)
      }
      return months
    },

    currentYearName() {
      return this.utils.getYear(this.firstDate)
    },
  },
  methods: {
    select(date) {
      this.$emit('selectMonth', date)
    },

    toTimePicker() {
      this.$emit('closePicker')
      this.$emit('openTimePicker')
    },
    showYearPicker() {
      this.$emit('openYearPicker')
    },

    getDayMonthString() {
      const d = this.selectedDate === null ? new Date() : this.selectedDate

      let str =
        calendar.week[this.utils.getWeekday(d)] +
        ', ' +
        this.utils.getShortNameOfMonth(this.utils.getMonth(d)) +
        ' '
      if (this.selectedDate) {
        str += `${(this.utils.getDayOfMonth(d) < 10 ? '0' : '') +
          this.utils.getDayOfMonth(d)}`
      }
      return str
    },

    createMonthObject(d, i) {
      return {
        month: this.utils.getShortNameOfMonth(i),
        timestamp: d.getTime(),
        selected: this.isSelected(d),
      }
    },

    isSelected(d) {
      return (
        this.selectedDate &&
        this.utils.getYear(this.selectedDate) === this.utils.getYear(d) &&
        this.utils.getMonth(this.selectedDate) === this.utils.getMonth(d)
      )
    },

    createDateObject() {
      const first = this.firstDate
      let d = this.isUTC
        ? new Date(Date.UTC(first.getUTCFullYear(), 0, first.getUTCDate()))
        : new Date(
            first.getFullYear(),
            0,
            first.getDate(),
            first.getHours(),
            first.getMinutes()
          )
      return d
    },

    change(monthChange) {
      let date = this.firstDate
      this.utils.setYear(date, this.utils.getYear(date) + monthChange)
      this.$emit('yearChanged', date)
    },

    prev() {
      this.change(-1)
    },
    next() {
      this.change(1)
    },
  },
}
</script>

<style></style>
