<template>
  <div
    v-show="showTimePicker"
    :class="[customTimeClass, 'timePicker']"
    v-on:mousedown.prevent
  >
    <footer v-if="dateAndTime">
      <span class="toCalendar" v-on:click="toCalendar"></span>
    </footer>
    <div class="info">
      <span
        class="hour"
        v-bind:class="which == 'hour' ? 'active' : ''"
        v-on:click="switchState('hour')"
        v-on:blur="contentEditable = false"
        v-html="(hour.val < 10 ? '0' : '') + hour.val"
      ></span>
      <span class="spacer">:</span>
      <span
        class="minute"
        v-bind:class="which == 'minute' ? 'active' : ''"
        v-html="(minute.val < 10 ? '0' : '') + minute.val"
        v-on:click="switchState('minute')"
      ></span>
      <div class="ampm">
        <span
          class="ap"
          v-on:click="switchAP('am')"
          v-html="ampm.toUpperCase()"
        ></span>
      </div>
    </div>
    <div class="clockWatch">
      <span id="time-picker-hour-hand"></span>
      <span id="time-picker-hour-center"></span>
      <div class="time-picker-current" style="transform: rotate(0deg)">
        <span id="time-picker-current-box"></span>
      </div>

      <div v-if="which == 'hour'" style="position: relative;">
        <div
          v-for="h in hours"
          v-bind:key="h.val"
          v-bind:style="'transform: rotate(' + h.degree + 'deg)'"
        >
          <p
            v-bind:id="'time-picker-hour-' + h.val"
            class="time-picker-hour"
            v-bind:data-v-deg="h.degree"
            v-bind:class="h.val == hour.val ? 'selected' : ''"
            v-bind:style="'transform: rotate(-' + h.degree + 'deg)'"
            v-on:click="selectHour(h)"
          >
            {{ h.val }}
          </p>
        </div>
      </div>
      <div v-if="which == 'minute'" style="position: relative;">
        <div
          v-for="m in minutes"
          v-bind:key="m.val"
          v-bind:style="'transform: rotate(' + m.degree + 'deg)'"
        >
          <p
            v-bind:id="'time-picker-hour-' + m.val"
            class="time-picker-hour"
            v-bind:data-v-deg="m.degree"
            v-bind:class="{ selected: m.val == minute.val, disabled: !m.show }"
            v-bind:style="{
              transform: 'rotate(-' + m.degree + 'deg)',
              pointerEvent: 'none',
            }"
            v-on:click="m.val % 5 == 0 ? selectMinute(m) : ''"
          >
            {{ m.val }}
          </p>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="timeButtons">
      <span v-on:click="cancle">CANCLE</span>
      <span v-on:click="saveAndClose">OK</span>
    </div>
  </div>
</template>

<script>
import { createUtils } from '../../utils/PickerUtils'

const hourDegs = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 0]
const minuteDegs = []
for (let i = 6; i <= 360; i += 6) {
  if (i == 360) minuteDegs.push(0)
  else minuteDegs.push(i)
}

export default {
  props: {
    showTimePicker: Boolean,
    customTimeClass: String,
    selectedDate: Date,
    timeButtons: Boolean,
    firstTime: Date,
    id: String,
    dateAndTime: Boolean,
  },
  data() {
    const utils = createUtils(this.isUTC)
    return {
      hour: {
        val: 12,
        deg: 0,
      },
      minute: { val: 0, deg: 0 },
      ampm: 'pm',
      which: 'hour',
      utils: utils,
      didDrag: false,
    }
  },

  computed: {
    hours() {
      let hours = []
      for (let i = 1; i <= 12; i++) {
        hours.push({
          val: i,
          degree: hourDegs[i - 1],
        })
      }
      return hours
    },
    minutes() {
      let minutes = []
      for (let i = 0; i <= 59; i++) {
        minutes.push({
          val: i,
          degree:
            i == 0 ? minuteDegs[minuteDegs.length - 1] : minuteDegs[i - 1],
          show: i % 5 == 0 ? true : false,
        })
      }
      return minutes
    },
  },

  mounted() {
    this.dragElement(this.$el.querySelector('#' + this.id + ' p.selected'))
  },

  updated() {
    this.dragElement(document.querySelector('#' + this.id + ' p.selected'))
  },

  methods: {
    switchState(state) {
      if (this.which == state) return
      this.which = state
      this.clearCurrent()
      this.setDraggable()
      this.$el
        .querySelector('#' + this.id + ' p.selected')
        .classList.remove('selected')
    },

    switchAP() {
      this.ampm = this.ampm == 'am' ? 'pm' : 'am'
      if (!this.timeButtons) this.save(false)
    },

    setInitTime(d) {
      this.selectedDate = d
      this.which = 'hour'
      let hour = this.utils.getHours(d == undefined ? this.selectedDate : d)
      let minute = this.utils.getMinutes(d == undefined ? this.selectedDate : d)

      this.ampm = hour > 12 || hour == 0 ? 'pm' : 'am'

      hour = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour
      minute == 60 ? 0 : minute

      let hourDeg = hourDegs[hour - 1]
      let minuteDeg =
        minute == 0 ? minuteDegs[minuteDegs.length - 1] : minuteDegs[minute - 1]

      let hourObj = {
        val: hour,
        degree: hourDeg,
      }

      this.minute = {
        val: minute,
        deg: minuteDeg,
      }

      this.selectHour(hourObj)
    },

    toCalendar() {
      this.$emit('closePicker')
      this.$emit('openCalendarPicker')
    },

    setDraggable() {
      this.dragElement(document.querySelector('#' + this.id + ' p.selected'))
    },

    removeDraggable(val) {
      this.$el.querySelector(
        '#' + this.id + ' #time-picker-hour-' + val
      ).onmousedown = null
    },

    removeSelected() {
      this.$el
        .querySelector('#' + this.id + ' p.selected')
        .classList.remove('selected')
    },

    addSelected(val) {
      this.$el
        .querySelector('#' + this.id + ' #time-picker-hour-' + val)
        .classList.add('selected')
    },

    selectHour(hour) {
      this.removeDraggable(this.hour.val)
      this.hour.val = hour.val
      this.hour.deg = hour.degree
      this.$el.querySelector('#time-picker-hour-hand').style.transform =
        'rotate(' + hour.degree + 'deg)'
      this.$el.querySelector('.time-picker-current').style.transform =
        'rotate(' + hour.degree + 'deg)'
      this.removeSelected()
      this.addSelected(hour.val)
      this.dragElement(document.querySelector('#' + this.id + ' p.selected'))
      if (!this.timeButtons) this.save(false)
      return true
    },

    selectMinute(minute) {
      this.removeDraggable(this.hour.val)
      if (
        this.didDrag &&
        this.$el.querySelector('.selected').innerHTML == minute.val - 1 &&
        minute.val % 5 == 0
      ) {
        this.didDrag = false
        return
      }
      this.minute.val = minute.val
      this.minute.deg = minute.degree
      this.$el.querySelector('#time-picker-hour-hand').style.transform =
        'rotate(' + minute.degree + 'deg)'
      this.$el.querySelector('.time-picker-current').style.transform =
        'rotate(' + minute.degree + 'deg)'
      this.removeSelected()
      this.addSelected(minute.val)
      this.dragElement(document.querySelector('#' + this.id + ' p.selected'))
      if (!this.timeButtons) this.save(false)
      return true
    },

    clearCurrent() {
      this.$el.querySelector('#time-picker-hour-hand').style.transform =
        'rotate(' +
        (this.which == 'hour' ? this.hour.deg : this.minute.deg) +
        'deg)'
      this.$el.querySelector('.time-picker-current').style.transform =
        'rotate(' +
        (this.which == 'hour' ? this.hour.deg : this.minute.deg) +
        'deg)'
      this.$el
        .querySelectorAll('p[id^="time-picker-hour-"]')
        .forEach(e => (e.style.pointerEvent = 'none'))
      this.$el.querySelector('#' + this.id + ' p.selected').style.pointerEvent =
        'auto'
    },
    save(close) {
      let newHours = this.ampm == 'pm' ? this.hour.val + 12 : this.hour.val
      newHours = newHours == 24 ? 0 : newHours
      this.utils.setHours(this.selectedDate, newHours)
      this.utils.setMinutes(this.selectedDate, this.minute.val)
      this.$emit('selectTime', this.selectedDate, close)
    },

    saveAndClose() {
      this.save(true)
      this.cancle()
    },

    cancle() {
      this.$emit('closePicker')
    },

    dragElement(elmnt) {
      var vue = this
      var pos3 = 0,
        pos4 = 0
      var elm = elmnt
      elmnt.onmousedown = dragMouseDown

      function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        document.onmousemove =
          vue.which == 'hour' ? elementHourDrag : elementMinuteDrag
      }

      function elementHourDrag(e) {
        e = e || window.event
        e.preventDefault()

        vue.removeDraggable(vue.hour.val)

        let center = vue.$el.querySelector('#time-picker-hour-center')
        let centerX = center.getBoundingClientRect().x
        let centerY = center.getBoundingClientRect().y

        pos3 = e.clientX - centerX
        pos4 = centerY - e.clientY

        let tan = Math.atan(pos4 / pos3) * (180 / Math.PI)
        let deg = Math.round(tan / 30) * 30

        let h = Math.sqrt(Math.pow(pos3, 2) + Math.pow(pos4, 2))
        let cos = pos3 / h

        deg = vue.getDeg(Math.round(tan / 30) * 30, cos)

        vue.hour.val = hourDegs.indexOf(deg) + 1
        vue.hour.deg = deg

        vue.$el.querySelector('#time-picker-hour-hand').style.transform =
          'rotate(' + deg + 'deg)'
        vue.$el.querySelector('.time-picker-current').style.transform =
          'rotate(' + deg + 'deg)'

        vue.removeSelected()
        vue.addSelected(vue.hour.val)

        if (!vue.timeButtons) vue.save(false)
      }

      function elementMinuteDrag(e) {
        vue.didDrag = true
        e = e || window.event
        e.preventDefault()

        vue.removeDraggable(vue.minute.val)

        let center = vue.$el.querySelector('#time-picker-hour-center')
        let centerX = center.getBoundingClientRect().x
        let centerY = center.getBoundingClientRect().y

        pos3 = e.clientX - centerX
        pos4 = centerY - e.clientY

        let tan = Math.atan(pos4 / pos3) * (180 / Math.PI)
        let deg = Math.round(tan / 6) * 6

        let h = Math.sqrt(Math.pow(pos3, 2) + Math.pow(pos4, 2))
        let cos = pos3 / h

        deg = vue.getDeg(Math.round(tan / 6) * 6, cos)

        vue.minute.val =
          minuteDegs.indexOf(deg) + 1 == 60 ? 0 : minuteDegs.indexOf(deg) + 1
        vue.minute.deg = deg

        vue.$el.querySelector('#time-picker-hour-hand').style.transform =
          'rotate(' + deg + 'deg)'
        vue.$el.querySelector('.time-picker-current').style.transform =
          'rotate(' + deg + 'deg)'

        vue.removeSelected()
        vue.addSelected(vue.minute.val)

        if (!vue.timeButtons) vue.save(false)
      }

      function closeDragElement(e) {
        e.preventDefault()
        document.onmouseup = null
        document.onmousemove = null
        elm.onmousedown = null
        vue.dragElement(vue.$el.querySelector('#' + vue.id + ' p.selected'))
        if (vue.which == 'hour') vue.switchState('minute')
        return false
      }
    },
    getDeg(deg, cos) {
      if (deg == 90 && cos > 0) return 0
      if (deg == 84 && cos > 0) return 6
      if (deg == 78 && cos > 0) return 12
      if (deg == 72 && cos > 0) return 18
      if (deg == 66 && cos > 0) return 24
      if (deg == 60 && cos > 0) return 30
      if (deg == 54 && cos > 0) return 36
      if (deg == 48 && cos > 0) return 42
      if (deg == 42 && cos > 0) return 48
      if (deg == 36 && cos > 0) return 54
      if (deg == 30 && cos > 0) return 60
      if (deg == 24 && cos > 0) return 66
      if (deg == 18 && cos > 0) return 72
      if (deg == 12 && cos > 0) return 78
      if (deg == 6 && cos > 0) return 84
      if (deg == 0 && cos > 0) return 90
      if (deg == -6 && cos > 0) return 96
      if (deg == -12 && cos > 0) return 102
      if (deg == -18 && cos > 0) return 108
      if (deg == -24 && cos > 0) return 114
      if (deg == -30 && cos > 0) return 120
      if (deg == -36 && cos > 0) return 126
      if (deg == -42 && cos > 0) return 132
      if (deg == -48 && cos > 0) return 138
      if (deg == -54 && cos > 0) return 144
      if (deg == -60 && cos > 0) return 150
      if (deg == -66 && cos > 0) return 156
      if (deg == -72 && cos > 0) return 162
      if (deg == -78 && cos > 0) return 168
      if (deg == -84 && cos > 0) return 174
      if (deg == -90 && cos > 0) return 180
      if (deg == 90 && cos < 0) return 180
      if (deg == 84 && cos < 0) return 186
      if (deg == 78 && cos < 0) return 192
      if (deg == 72 && cos < 0) return 198
      if (deg == 66 && cos < 0) return 204
      if (deg == 60 && cos < 0) return 210
      if (deg == 54 && cos < 0) return 216
      if (deg == 48 && cos < 0) return 222
      if (deg == 42 && cos < 0) return 228
      if (deg == 36 && cos < 0) return 234
      if (deg == 30 && cos < 0) return 240
      if (deg == 24 && cos < 0) return 246
      if (deg == 18 && cos < 0) return 252
      if (deg == 12 && cos < 0) return 258
      if (deg == 6 && cos < 0) return 264
      if (deg == 0 && cos < 0) return 270
      if (deg == -6 && cos < 0) return 276
      if (deg == -12 && cos < 0) return 282
      if (deg == -18 && cos < 0) return 288
      if (deg == -24 && cos < 0) return 294
      if (deg == -30 && cos < 0) return 300
      if (deg == -36 && cos < 0) return 306
      if (deg == -42 && cos < 0) return 312
      if (deg == -48 && cos < 0) return 318
      if (deg == -54 && cos < 0) return 324
      if (deg == -60 && cos < 0) return 330
      if (deg == -66 && cos < 0) return 336
      if (deg == -72 && cos < 0) return 342
      if (deg == -78 && cos < 0) return 348
      if (deg == -84 && cos < 0) return 354
      if (deg == -90 && cos < 0) return 0
    },
  },
}
</script>

<style></style>
