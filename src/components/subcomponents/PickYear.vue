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
        <span
          class="prev"
          v-on:click="prev"
          :class="{ disabled: !isChangeEnabled(true) }"
        ></span>
        <span class="togglePickers">{{ currentYearDecade }}</span>
        <span
          class="next"
          v-on:click="next"
          :class="{ disabled: !isChangeEnabled(false) }"
        ></span>
      </header>
      <div>
        <span
          class="col cal-year"
          v-for="y in years"
          :key="y.timestamp"
          :class="{ selected: y.selected, disabled: y.disabled }"
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
    disableYears: [Object, Array, Function],
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
        disabled: this.isDisabled(d),
      }
    },

    isChangeEnabled(left) {
      if (
        !this.disabledExist() ||
        (this.disableYears.from === undefined &&
          this.disableYears.to === undefined)
      )
        return true
      let year = this.utils.getYear(this.firstDate)
      if (left) {
        if (
          this.disableYears.to === undefined ||
          (this.disableYears.to.constructor.name !== 'Date' &&
            this.disableYears.to.constructor.name !== 'Number')
        )
          return true

        let type = this.disableYears.to.constructor.name

        let disabled = this.disableYears.to
        let prev = Math.floor(year / 10) * 10 - 1
        if (type === 'Date') {
          disabled = this.utils.getYear(this.disableYears.to)
        }
        return prev > disabled
      } else {
        if (
          this.disableYears.from === undefined ||
          (this.disableYears.from.constructor.name !== 'Date' &&
            this.disableYears.from.constructor.name !== 'Number')
        )
          return true

        let type = this.disableYears.from.constructor.name

        let disabled = this.disableYears.from
        let next = Math.floor(year / 10) * 10 + 10
        if (type === 'Date') {
          disabled = this.utils.getYear(this.disableYears.from)
        }
        return next < disabled
      }
    },

    isSelected(d) {
      return (
        this.selectedDate &&
        this.utils.getYear(this.selectedDate) === this.utils.getYear(d)
      )
    },

    isDisabled(d) {
      if (!this.disableYears) {
        return false
      }

      if (this.disableYears.constructor.name === 'Array') {
        return this.disableYears.some(a => {
          let b = this.utils.getYear(d)
          if (a == b) {
            return true
          }
        })
      }
      if (this.disableYears.from && this.disableFrom(d)) return true

      if (this.disableYears.to && this.disableTo(d)) return true

      if (this.disableYears.range && this.disableRange(d)) return true

      if (typeof this.disableYears === 'function' && this.disableYears(d)) {
        return true
      }

      if (
        this.disableYears.function &&
        typeof this.disableYears.function === 'function' &&
        this.disableYears.function(d)
      ) {
        return true
      }

      return false
    },

    disableFrom(d) {
      let type = this.disableYears.from.constructor.name
      if (type === 'Date' && d >= this.disableYears.from) {
        return true
      }
      if (
        type === 'Number' &&
        this.utils.getYear(d) >= this.disableYears.from
      ) {
        return true
      }
    },

    disableTo(d) {
      let type = this.disableYears.to.constructor.name
      if (type === 'Date' && d <= this.disableYears.to) {
        return true
      }
      if (type === 'Number' && this.utils.getYear(d) <= this.disableYears.to) {
        return true
      }
    },

    disableRange(d) {
      return this.disableYears.range.some(range => {
        let typeTo = range.to.constructor.name
        let typeFrom = range.to.constructor.name

        if (
          typeTo === 'Date' &&
          typeFrom === 'Date' &&
          d <= range.to &&
          d >= range.from
        ) {
          return true
        }
        if (
          typeFrom === 'Number' &&
          typeTo === 'Number' &&
          this.utils.getYear(d) <= range.to &&
          this.utils.getYear(d) >= range.from
        ) {
          return true
        }
      })
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

    change(monthChange) {
      let date = this.firstDate
      this.utils.setYear(date, this.utils.getYear(date) + monthChange)
      this.$emit('decadeChanged', date)
    },

    prev() {
      this.change(-10)
    },
    next() {
      this.change(10)
    },

    disabledExist() {
      return this.disableYears
    },
  },
}
</script>

<style></style>
