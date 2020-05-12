import Calendar from './calendar'

const utils = {
  useUTC: false,

  getMinutes(date) {
    return this.useUTC ? date.getUTCMinutes() : date.getMinutes()
  },

  getHours(date) {
    return this.useUTC ? date.getUTCHours() : date.getHours()
  },

  getWeekday(date) {
    return this.useUTC ? date.getUTCDay() : date.getDay()
  },

  getDayOfMonth(date) {
    return this.useUTC ? date.getUTCDate() : date.getDate()
  },

  getLastDayOfMonth(date, month) {
    return this.useUTC
      ? new Date(date.getUTCFullYear(), month, 0).getDate()
      : new Date(date.getFullYear(), month, 0).getDate()
  },

  getMonth(date) {
    return this.useUTC ? this.getUTCMonth() : date.getMonth()
  },

  getYear(date) {
    return this.useUTC ? date.getUTCFullYear() : date.getFullYear()
  },

  setMinutes(date, newMinutes) {
    return this.useUTC
      ? date.setUTCMinutes(newMinutes)
      : date.setMinutes(newMinutes)
  },

  setHours(date, newHours) {
    return this.useUTC ? date.setUTCHours(newHours) : date.setHours(newHours)
  },

  setWeekday(date, newDay) {
    return this.useUTC ? date.setUTCDay(newDay) : date.setDay(newDay)
  },

  setDayOfMonth(date, newDate) {
    return this.useUTC ? date.setUTCDate(newDate) : date.setDate(newDate)
  },

  setMonth(date, newMonth) {
    return this.useUTC ? date.setUTCMonth(newMonth) : date.setMonth(newMonth)
  },

  setYear(date, newYear) {
    return this.useUTC
      ? date.setUTCFullYear(newYear)
      : date.setFullYear(newYear)
  },

  compareDates(first, second) {
    if (this.useUTC) {
      first.setUTCSeconds(0, 0)
      second.setUTCSeconds(0, 0)
    } else {
      first.setSeconds(0, 0)
      second.setSeconds(0, 0)
    }

    return first.getTime() === second.getTime()
  },

  isCorrectDate(date) {
    return (
      date &&
      Object.prototype.toString.call(date) === '[object Date]' &&
      !isNaN(date)
    )
  },

  getNameOfMonth(month) {
    return Calendar.months[month]
  },

  getShortNameOfMonth(month) {
    return Calendar.monthsShort[month]
  },

  getShortNameOfDay(day) {
    return Calendar.week[day]
  },

  format(date, format) {
    let day = this.getDayOfMonth(date)
    let month = this.getMonth(date)
    let year = this.getYear(date)
    let hour = this.getHours(date)
    let minute = this.getMinutes(date)

    return format
      .replace(/dd/, ('0' + day).slice(-2))
      .replace(/d/, day)
      .replace(/MMMM/, this.getNameOfMonth(month))
      .replace(/MMM/, this.getShortNameOfMonth(month))
      .replace(/MM/, ('0' + (month + 1)).slice(-2))
      .replace(/M(?!a|ä|e)/, month + 1)
      .replace(/yyyy/, year)
      .replace(/yy/, String(year).slice(2))
      .replace(/D/, this.getShortNameOfDay(this.getWeekday(date)))
      .replace(
        /HH/,
        ('0' + (hour > 12 ? hour - 12 : hour > 0 ? hour : 12)).slice(-2)
      )
      .replace(/mm/, ('0' + minute).slice(-2))
      .replace(/a/, hour > 12 || hour == 0 ? 'PM' : 'AM')
  },

  countDaysOfMonth(month, year) {
    switch (month) {
      case 3:
      case 5:
      case 8:
      case 10:
        return 30
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31
      case 1:
        return year % 4 === 0 || year % 400 === 0 ? 29 : 28
    }
  },
}

export const createUtils = useUTC => ({ ...utils, useUTC })

export default {
  ...utils,
}
