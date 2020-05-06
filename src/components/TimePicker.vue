<template>
  <div
    v-show="showTimePicker"
    :class="[customTimeClass, 'timePicker']"
    v-on:mousedown.prevent
  >
    <footer>
      <span class="toCalendar" v-on:click="toCalendar"></span>
    </footer>
    <div class="info">
      <span
        class="hour"
        v-bind:class="which == 'hour' ? 'active' : ''"
        v-on:click="switchState('hour')"
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

      <div
        v-if="which == 'hour'"
        style="position: relative; left: -2px; transform: rotate(1.5deg);"
      >
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
      <div
        v-if="which == 'minute'"
        style="position: relative; left: -2px; transform: rotate(1.5deg);"
      >
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
            }"
          >
            {{ m.val }}
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <span>CANCLE</span>
      <span>OK</span>
    </div>
  </div>
</template>

<script>
const hourDegs = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 0]
const minuteDegs = []

export default {
  props: {
    showTimePicker: Boolean,
    customTimeClass: String,
    selectedDate: Date,
  },
  data() {
    return {
      hour: { val: 12, deg: 0 },
      minute: { val: 0, deg: 0 },
      ampm: 'am',
      which: 'hour',
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
      for (let i = 6; i <= 360; i += 6) {
        if (i == 360) minuteDegs.push(0)
        else minuteDegs.push(i)
      }
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
    this.dragElement(this.$el.querySelector('.selected'))
  },

  updated() {
    this.dragElement(document.querySelector('.selected'))
  },

  methods: {
    switchState(state) {
      this.which = state
      this.clearCurrent()
      this.$el.querySelector('.selected').classList.remove('selected')
    },

    switchAP() {
      this.ampm = this.ampm == 'am' ? 'pm' : 'am'
    },

    toCalendar() {
      this.$emit('closePicker')
      this.$emit('openCalendarPicker')
    },

    selectHour(hour) {
      this.hour.val = hour.val
      this.hour.deg = hour.degree
      this.$el.querySelector('#time-picker-hour-hand').style.transform =
        'rotate(' + hour.degree + 'deg)'
      this.$el.querySelector('.time-picker-current').style.transform =
        'rotate(' + hour.degree + 'deg)'
      this.toggleSelected(hour)
      this.dragElement(document.querySelector('.selected'))
      return true
    },

    toggleSelected(hour) {
      this.$el.querySelector('.selected').classList.remove('selected')
      this.$el
        .querySelector('#time-picker-hour-' + hour.val)
        .classList.add('selected')
    },

    clearCurrent() {
      let selected = this.$el.querySelector('.selected').dataset.vDeg
      console.log(selected)
      this.$el.querySelector('#time-picker-hour-hand').style.transform =
        'rotate(' +
        (this.which == 'hour' ? this.hour.deg : this.minute.deg) +
        'deg)'
      this.$el.querySelector('.time-picker-current').style.transform =
        'rotate(' +
        (this.which == 'hour' ? this.hour.deg : this.minute.deg) +
        'deg)'
    },

    dragElement(elmnt) {
      var vue = this
      var pos3 = 0,
        pos4 = 0
      elmnt.onmousedown = dragMouseDown

      function dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove =
          vue.which == 'hour' ? elementHourDrag : elementMinuteDrag
      }

      function elementHourDrag(e) {
        e = e || window.event
        e.preventDefault()

        let center = vue.$el.querySelector('#time-picker-hour-center')
        let centerX = center.getBoundingClientRect().x
        let centerY = center.getBoundingClientRect().y

        pos3 = e.clientX - centerX
        pos4 = centerY - e.clientY

        let tan = Math.atan(pos4 / pos3) * (180 / Math.PI)
        let deg = Math.round(tan / 30) * 30

        let h = Math.sqrt(Math.pow(pos3, 2) + Math.pow(pos4, 2))
        let cos = pos3 / h

        deg = getDeg(Math.round(tan / 30) * 30, cos)

        vue.hour.val = hourDegs.indexOf(deg) + 1
        vue.hour.deg = deg

        vue.$el.querySelector('#time-picker-hour-hand').style.transform =
          'rotate(' + deg + 'deg)'
        vue.$el.querySelector('.time-picker-current').style.transform =
          'rotate(' + deg + 'deg)'

        toggleSelected(hourDegs.indexOf(deg) + 1)
      }

      function elementMinuteDrag(e) {
        e = e || window.event
        e.preventDefault()

        let center = vue.$el.querySelector('#time-picker-hour-center')
        let centerX = center.getBoundingClientRect().x
        let centerY = center.getBoundingClientRect().y

        pos3 = e.clientX - centerX
        pos4 = centerY - e.clientY

        let tan = Math.atan(pos4 / pos3) * (180 / Math.PI)
        let deg = Math.round(tan / 6) * 6

        let h = Math.sqrt(Math.pow(pos3, 2) + Math.pow(pos4, 2))
        let cos = pos3 / h

        deg = getDeg(Math.round(tan / 6) * 6, cos)

        vue.minute.val =
          minuteDegs.indexOf(deg) + 1 == 60 ? 0 : minuteDegs.indexOf(deg) + 1
        vue.minute.deg = deg

        vue.$el.querySelector('#time-picker-hour-hand').style.transform =
          'rotate(' + deg + 'deg)'
        vue.$el.querySelector('.time-picker-current').style.transform =
          'rotate(' + deg + 'deg)'

        toggleSelected(vue.minute.val)
      }

      function getDeg(deg, cos) {
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
      }

      function toggleSelected(val) {
        let selected = vue.$el.querySelector('.selected')
        selected.onmousedown = null
        selected.classList.remove('selected')
        let next = parseInt(selected.innerHTML) + 1
        if (vue.which == 'minute') {
          next = next == 60 ? 0 : next
          console.log(next)
          vue.$el.querySelector(
            '#time-picker-hour-' + next
          ).style.pointerEvents = 'auto'
        }
        vue.$el
          .querySelector('#time-picker-hour-' + val)
          .classList.add('selected')
        if (vue.which == 'minute') {
          console.log(val)

          next = val + 1
          next = next == 60 ? 0 : next
          vue.$el.querySelector(
            '#time-picker-hour-' + next
          ).style.pointerEvents = 'none'
          let prev = val - 1 < 0 ? 59 : val - 1
          vue.$el.querySelector(
            '#time-picker-hour-' + prev
          ).style.pointerEvents = 'none'
        }
      }

      function closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
        vue.dragElement(vue.$el.querySelector('.selected'))
        if (vue.which == 'hour') vue.switchState('minute')
      }
    },
  },
}
</script>

<style></style>
