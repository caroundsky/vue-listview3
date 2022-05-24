import fieldCascader from './Cascader.vue'
import fieldDateTime from './DateTime.vue'
import fieldSelect from './Select.vue'
import fieldTimePickerRange from './TimePickerRange.vue'
import fieldDate from './Date.vue'
import fieldDateTimeRange from './DateTimeRange.vue'
import fieldMultipleSelect from './MultipleSelect.vue'
import fieldText from './Text.vue'
import fieldTimeSelect from './TimeSelect.vue'
import fieldDateRange from './DateRange.vue'
import fieldLabel from './Label.vue'
import fieldNumber from './Number.vue'
import fieldTimePicker from './TimePicker.vue'

const fieldComponentsMap = {
  cascader: fieldCascader,
  dateTime: fieldDateTime,
  select: fieldSelect,
  timePickerRange: fieldTimePickerRange,
  date: fieldDate,
  dateTimeRange: fieldDateTimeRange,
  multipleSelect: fieldMultipleSelect,
  text: fieldText,
  timeSelect: fieldTimeSelect,
  dateRange: fieldDateRange,
  label: fieldLabel,
  number: fieldNumber,
  timePicker: fieldTimePicker,
}

export function getFieldComponent(type: keyof typeof fieldComponentsMap) {
  return fieldComponentsMap[type] || null
}
