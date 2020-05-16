<div align="center"><h1>Vue.js Date-Time Picker</h1>

![GitHub top language](https://img.shields.io/github/languages/top/domi7891/vuejs-datetime-picker)
[![Version](https://img.shields.io/npm/v/@domi7891/vuejs-datetime-picker)](https://www.npmjs.com/package/@domi7891/vuejs-datetime-picker/v/0.3.0)
![GitHub last commit](https://img.shields.io/github/last-commit/domi7891/vuejs-datetime-picker)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@domi7891/vuejs-datetime-picker)
![npm](https://img.shields.io/npm/dw/@domi7891/vuejs-datetime-picker)

</div>

A date and time picker Vue component.

#### Support

<a href="https://www.buymeacoffee.com/domi7891" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 35px !important;width: 152px !important;" ></a>

- [Install](#install)
- [Usage](#usage)
- [Properties](#properties)
- [Events](#events)
- [Formats](#formats)

## Install

```bash
npm install @domi7891/vuejs-datetime-picker
```

```javascript
import {
  Datetimepicker,
  Datepicker,
  Timepicker,
} from '@domi7891/vuejs-datetime-picker'

export default {
  // ...
  components: {
    Datetimepicker,
    Datepicker,
    Timepicker,
    //...
  },
  //...
}
```

## Usage

```html
<datetimepicker></datetimepicker>
<!-- or -->
<datepicker></datepicker>
<!-- or -->
<timepicker></timepicker>
```

Pass a start value as _value_. Preferred a Date object<br>
Supported String formats:

- DateTime: `MM/dd/yyyy HH:mm`, `MM.dd.yyyy HH:mm`, `MM-dd-yyyy HH:mm`
- Date: `MM/dd/yyyy`, `MM.dd.yyyy`, `MM-dd-yyyy`
- Time: `HH:mm`

```html
<script>
  var date = new Date()
</script>
<datetimepicker :value="date"></datetimepicker>
<!-- or string May 2, 2020 -->
<datetimepicker :value="05/02/2020"></datetimepicker>
```

Events

```html
<datetimepicker
  v-on:selected="doWhenDateSelected"
  v-on:cleared="doWhenDateCleared"
></datetimepicker>
```

## Properties

| Property       | Type               | Default                           | Description                                                      |
| -------------- | ------------------ | --------------------------------- | ---------------------------------------------------------------- |
| value          | Date \| String     | `none`                            | Start value of the picker                                        |
| format         | String \| Function | `'dd/MM/yyyy HH:mm a'`            | Date format                                                      |
| picker-id      | String             | `'picker'`                        | Id of a picker. When using multiple pickers, specify id for each |
| input-id       | String             | `none`                            | Id of the picker input                                           |
| name           | String             | `none`                            | Name of the picker input                                         |
| ref-name       | String             | `none`                            | Reference of the picker input                                    |
| placeholder    | String             | `Pick Date-Time or (Date | Time)` | Placeholder text of the input                                    |
| input-class    | String \| Object   | `none`                            | CSS class of the input element                                   |
| time-class     | String \| Object   | `none`                            | CSS class of the time picker                                     |
| calendar-class | String \| Object   | `none`                            | CSS class of the date picker                                     |
| wrapper-class  | String \| Object   | `none`                            | CSS class of the wrapper div                                     |
| time-buttons   | Boolean            | `false`                           | To show buttons at the time picker                               |
| disabled       | Boolean            | `false`                           | Disable the picker                                               |
| required       | Boolean            | `false`                           | Set input as required field                                      |
| editable       | Boolean            | `false`                           | Input can be edited by typing                                    |
| initial-picker | String             | `lowest-picker`                   | Open date picker on specified level                              |
| lowest-picker  | String             | `day`                             | Lowest level of datepicker                                       |
| highest-picker | String             | `year`                            | Highest level of datepicker                                      |

## Events

| Event         | Return Type  | Description                            |
| ------------- | ------------ | -------------------------------------- |
| selected      | Date \| null | A date or time has beend selected      |
| cleared       | `none`       | Current date or time has beend cleared |
| pickerOpened  | `none`       | A picker has beend opened              |
| pickerClosed  | `none`       | A picker has beend closed              |
| changedDay    | Object       | A new day has been selected            |
| changedMonth  | Object       | A new month has been selected          |
| changedYear   | Object       | A new year has been selected           |
| changedHour   | Number       | A new hour has been selected           |
| changedMinute | Number       | A new minute has been selected         |

## Formats

### Function as formatter <!-- omit in toc -->

A Function can be provided as format value. The values will be passed to the function and returns. A string value has to be the return value of the function.

#### Example <!-- omit in toc -->

```html
<script>
  //..
  methods: {
    //..
    formatterFunction(date){
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`

    }
  }
</script>
<datepicker :format="formatterFunction"></datepicker>
```

### String format <!-- omit in toc -->

| Letter | Description                   | Example   |
| ------ | ----------------------------- | --------- |
| d      | numbered day                  | 3         |
| dd     | numbered day with leading 0   | 03        |
| D      | short day name                | Wed       |
| M      | numbered motnh                | 9         |
| MM     | numbered month with leading 0 | 09        |
| MMM    | short month name              | Sept      |
| MMMM   | month name                    | September |
| yy     | 2 digit year                  | 20        |
| yyyy   | 4 digit year                  | 2020      |
| HH     | hour with leading 0           | 05        |
| mm     | minute with leading 0         | 01        |
