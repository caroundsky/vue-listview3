import type { FilterField } from '~/types'

import { computed, onMounted, ref, unref } from 'vue'
import { merge } from 'lodash-es'
import { isPlainObject, isFunction } from 'is-what'
import { useLvStore } from '@/useLvStore'
import { error, get } from './index'

export function useFilterField<T = any>(field: FilterField) {
  const lvStore = useLvStore()

  const fieldRef = ref(field)
  const disabled = computed(() => unref(fieldRef).disabled)
  const placeholder = computed(() => unref(fieldRef).label)
  const value = computed<T>({
    get() {
      const key = unref(fieldRef).model
      let value = null
      if (key) {
        value = get(lvStore.filterModel, key)
      }
      return value
    },
    set(newVal) {
      const key = unref(fieldRef).model
      if (key) {
        lvStore.filterModel[key] = newVal
      } else {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
          error(
            `${JSON.stringify(
              unref(fieldRef)
            )}\n 未配置 model 属性，无法写入值。`
          )
        }
      }
    },
  })

  const componentAttrs = computed<FilterField['componentAttrs']>(() => {
    const componentAttrs = isPlainObject(unref(fieldRef).componentAttrs)
      ? unref(fieldRef).componentAttrs
      : {}
    return merge(componentAttrs, {
      disabled: unref(disabled),
      placeholder: unref(placeholder),
    })
  })
  const componentSlots = computed<FilterField['componentSlots']>(() => {
    return unref(fieldRef).componentSlots || {}
  })

  onMounted(() => {
    if (isFunction(field.effect)) {
      field.effect({
        fieldRef,
        filterModel: lvStore.filterModel,
      } as any)
    }
  })

  return {
    value,
    disabled,
    placeholder,
    componentAttrs,
    componentSlots,
  }
}
