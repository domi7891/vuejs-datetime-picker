<template>
  <div
    v-show="showYearPicker"
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
        <span class="togglePickers">{{ currentYearDecade }}</span>
        <span class="next" v-on:click="next"></span>
      </header>
      <div>
        <span
          class="col cal-year"
          v-for="y in years"
          :key="y.timestamp"
          :class="{ selected: y.selected }"
          v-on:click="select(y)"
          >{{ y.year }}</span
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
    showYearPicker: Boolean,
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
    years() {
      const d = this.createDateObject()
      let years = []

      for (let i = 0; i < 10; i++) {
        years.push(this.createYearObject(d, i))
        this.utils.setYear(d, this.utils.getYear(d) + 1)
      }
      return years
    },

    currentYearName() {
      return this.utils.getYear(this.firstDate)
    },

    currentYearDecade() {
      const decadeStart =
        Math.floor(this.utils.getYear(this.firstDate) / 10) * 10
      const decadeEnd = decadeStart + 9
      return `${decadeStart} - ${decadeEnd}`
    },
  },
  methods: {
    select(date) {
      this.$emit('selectYear', date)
    },

    toTimePicker() {
      this.$emit('closePicker')
      this.$emit('openTimePicker')
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

    createYearObject(d) {
      return {
        year: this.utils.getYear(d),
        timestamp: d.getTime(),
        selected: this.isSelected(d),
      }
    },

    isSelected(d) {
      return (
        this.selectedDate &&
        this.utils.getYear(this.selectedDate) === this.utils.getYear(d)
      )
    },

    createDateObject() {
      const first = this.firstDate
      let d = this.isUTC
        ? new Date(
            Date.UTC(
              Math.floor(first.getUTCFullYear() / 10) * 10,
              first.getUTCMonth(),
              first.getUTCDate()
            )
          )
        : new Date(
            Math.floor(first.getFullYear() / 10) * 10,
            first.getMonth(),
            first.getDate(),
            first.getHours(),
            first.getMinutes()
          )
      return d
    },

    monthContent(day) {
      return day.date
    },
    monthClass(day) {
      return {
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        selected: day.selected,
      }
    },

    change(monthChange) {
      let date = this.firstDate
      this.utils.setYear(date, this.utils.getYear(date) + monthChange)
    },

    prev() {
      this.change(-10)
    },
    next() {
      this.change(10)
    },
  },
}
</script>

<style></style>
