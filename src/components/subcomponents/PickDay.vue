<template>
  <div
    v-show="showDayPicker"
    :class="[customCalendarClass, 'calendar']"
    v-on:mousedown.prevent
  >
    <div class="info">
      <div class="today" v-on:click="selectToday">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path
            d="M24 2v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2zm6.687 13.482c0-.802-.418-1.429-1.109-1.695.528-.264.836-.807.836-1.503 0-1.346-1.312-2.149-2.581-2.149-1.477 0-2.591.925-2.659 2.763h1.645c-.014-.761.271-1.315 1.025-1.315.449 0 .933.272.933.869 0 .754-.816.862-1.567.797v1.28c1.067 0 1.704.067 1.704.985 0 .724-.548 1.048-1.091 1.048-.822 0-1.159-.614-1.188-1.452h-1.634c-.032 1.892 1.114 2.89 2.842 2.89 1.543 0 2.844-.943 2.844-2.518zm4.313 2.518v-7.718h-1.392c-.173 1.154-.995 1.491-2.171 1.459v1.346h1.852v4.913h1.711z"
          />
        </svg>
      </div>
      <span class="year" v-html="currentYearName"></span>
      <span class="dayMonth" v-html="getDayMonthString()"></span>
    </div>
    <div class="calWrapper">
      <header>
        <span class="prev" v-on:click="prev"></span>
        <span
          class="togglePickers"
          v-on:click="showMonthPicker"
          style="cursor: pointer;"
          >{{ currentMonthName }} {{ currentYearName }}</span
        >
        <span class="next" v-on:click="next"></span>
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
    showDayPicker: Boolean,
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

    selectToday() {
      const d = new Date()
      this.utils.setHours(d, this.utils.getHours(this.selectedDate))
      this.utils.setMinutes(d, this.utils.getMinutes(this.selectedDate))
      this.$emit('selectDate', { timestamp: d.getTime() })
    },

    toTimePicker() {
      this.$emit('closePicker')
      this.$emit('openTimePicker')
    },

    showMonthPicker() {
      this.$emit('openMonthPicker')
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
