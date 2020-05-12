<template>
  <div class="datepickerinput">
    <input
      type="text"
      :value="formattedValue"
      :id="id"
      :name="name"
      :ref="refName"
      :class="customInputClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :readonly="!editable"
      v-on:click="showPicker"
      v-on:blur="inputBlur"
      v-on:mouseover="inputHover"
      v-on:mouseleave="inputLeave"
    />
    <svg
      class="svg-icon"
      viewBox="5 5 10 10"
      v-on:mouseover="inputHover"
      v-on:click="clear"
    >
      <path
        d="M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"
      ></path>
    </svg>
  </div>
</template>

<script>
import { createUtils } from '../utils/PickerUtils'
export default {
  props: {
    selectedValue: Date,
    format: [String, Function],
    id: String,
    name: String,
    refName: String,
    placeholder: String,
    customInputClass: String,
    disabled: Boolean,
    required: Boolean,
    editable: Boolean,
    isUTC: Boolean,
    withTime: Boolean,
  },
  data() {
    const dateUtils = createUtils(this.isUTC)
    return {
      input: null,
      utils: dateUtils,
    }
  },
  computed: {
    formattedValue() {
      if (!this.selectedValue) return null
      return typeof this.format === 'function'
        ? this.format(this.selectedValue)
        : this.utils.format(new Date(this.selectedValue), this.format)
    },
  },
  methods: {
    showPicker() {
      this.$emit('showPicker')
    },

    inputBlur() {
      this.$emit('closePicker')
    },

    inputHover() {
      let svg = this.$el.querySelector('.svg-icon')
      if (this.input.value) {
        svg.classList.add('showClear')
      }
    },

    inputLeave() {
      this.$el.querySelector('.svg-icon').classList.remove('showClear')
    },

    clear() {
      this.$emit('clear')
      this.inputLeave()
    },
  },
  mounted() {
    this.input = this.$el.querySelector('input')
  },
}
</script>

<style></style>
