<template>
  <div
    v-show="showDayPicker"
    :class="[customCalendarClass, 'calendar']"
    v-on:mousedown.prevent
  >
    <div class="info">
      <span class="year" v-html="currentYearName"></span>
      <span class="dayMonth" v-html="getDayMonthString()"></span>
    </div>
    <div class="calWrapper">
      <header>
        <span class="prev" v-on:click="prev">&lt;</span>
        <span class="togglePickers"
          >{{ currentMonthName }} {{ currentYearName }}</span
        >
        <span class="next" v-on:click="next">&gt;</span>
      </header>
      <div>
        <span
          class="col cal-day-header"
          v-for="d in daysOfWeek"
          :key="d.timestamp"
          >{{ d }}</span
        >
        <template v-if="daysLastMonth.length > 0">
          <span
            class="col cal-day cal-day-last"
            v-for="d in daysLastMonth"
            :key="d.timestamp"
            :class="dayClass(d)"
            v-html="dayContent(d)"
            v-on:click="prev"
          ></span>
        </template>
        <span
          class="col cal-day"
          v-for="d in days"
          :key="d.timestamp"
          :class="dayClass(d)"
          v-html="dayContent(d)"
          v-on:click="select(d)"
        ></span>
        <template v-if="daysNextMonth.length > 0">
          <span
            class="col cal-day cal-day-next"
            v-for="d in daysNextMonth"
            :key="d.timestamp"
            :class="dayClass(d)"
            v-html="dayContent(d)"
            v-on:click="next"
          ></span>
        </template>
      </div>
    </div>
    <footer>
      <span class="toTimePicker" v-on:click="toTimePicker"></span>
    </footer>
  </div>
</template>

<script>
import calendar from '../utils/calendar'
import { createUtils } from '../utils/PickerUtils'
export default {
  props: {
    showDayPicker: Boolean,
    customCalendarClass: String,
    firstDate: Date,
    isUTC: Boolean,
    selectedDate: Date,
  },
  data() {
    const utils = createUtils(this.isUTC)
    return {
      utils: utils,
    }
  },
  computed: {
    daysOfWeek() {
      return calendar.week
    },
    daysLastMonth() {
      const date = this.createDateObject()
      const daysLastMonth = this.utils.getWeekday(date)
      const lastDayOfLastMonth = this.utils.getLastDayOfMonth(
        date,
        this.utils.getMonth(date)
      )

      let days = []

      let d = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        lastDayOfLastMonth
      )
      for (
        let i = lastDayOfLastMonth;
        i > lastDayOfLastMonth - daysLastMonth;
        i--
      ) {
        days.push(this.createDaysObject(d))
        this.utils.setDayOfMonth(d, this.utils.getDayOfMonth(d) - 1)
      }
      return days.reverse()
    },

    daysNextMonth() {
      const date = this.createDateObject()
      const weekdayLastDay = this.utils.getWeekday(
        new Date(
          this.utils.getYear(date),
          this.utils.getMonth(date),
          this.utils.getLastDayOfMonth(date, this.utils.getMonth(date) + 1)
        )
      )

      let days = []

      let d = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      for (let i = 0; i < 7 - (weekdayLastDay + 1); i++) {
        days.push(this.createDaysObject(d))
        this.utils.setDayOfMonth(d, this.utils.getDayOfMonth(d) + 1)
      }
      return days
    },

    days() {
      const d = this.createDateObject()
      let days = []

      let daysMonth = this.utils.countDaysOfMonth(
        this.utils.getMonth(d),
        this.utils.getYear(d)
      )
      for (let i = 0; i < daysMonth; i++) {
        days.push(this.createDaysObject(d))
        this.utils.setDayOfMonth(d, this.utils.getDayOfMonth(d) + 1)
      }
      return days
    },

    currentMonthName() {
      return this.utils.getShortNameOfMonth(this.utils.getMonth(this.firstDate))
    },

    currentYearName() {
      return this.utils.getYear(this.firstDate)
    },
  },
  methods: {
    select(date) {
      this.$emit('selectDate', date)
      // if (close) this.$emit('closePicker')
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

    createDaysObject(d) {
      return {
        date: this.utils.getDayOfMonth(d),
        timestamp: d.getTime(),
        selected: this.isSelected(d),
        isToday: this.utils.compareDates(d, new Date()),
        isWeekend:
          this.utils.getWeekday(d) === 6 || this.utils.getWeekday(d) === 0,
        isSaturday: this.utils.getWeekday(d) === 6,
        isSunday: this.utils.getWeekday(d) === 0,
      }
    },

    isSelected(d) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, d)
    },

    createDateObject() {
      const first = this.firstDate
      let d = this.isUTC
        ? new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1))
        : new Date(
            first.getFullYear(),
            first.getMonth(),
            1,
            first.getHours(),
            first.getMinutes()
          )
      return d
    },

    dayContent(day) {
      return day.date
    },
    dayClass(day) {
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
      this.utils.setMonth(date, this.utils.getMonth(date) + monthChange)
      this.$emit('monthChanged', date)
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
