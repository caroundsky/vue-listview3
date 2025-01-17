<script lang="tsx">
import type { PropType } from 'vue'
import { isVNode, defineComponent, h } from 'vue'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElButton,
  ElFormItem,
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { isPlainObject, isFunction } from 'is-what'
import { warn } from '@/utils'
import { FilterButton } from '~/types'

interface NormalizedButton {
  text: string
  children: NormalizedButton[]
  buttonAttrs: Record<string, any>
}

function isValidButtonConfig(button: any) {
  return (
    button &&
    (isPlainObject(button) ||
      isFunction(button) ||
      isFunction(button.render) ||
      isVNode(button))
  )
}

function normalizeButton(button: FilterButton): NormalizedButton {
  const {
    click,
    type,
    text = '',
    icon: _icon,
    children: _children,
    ...buttonAttrs
  } = button
  const icon = _icon ? <ElIcon>{h(_icon)}</ElIcon> : null

  let onClick = button.onClick
  if (click) {
    warn(
      `[Migration][filterButtons]: 'click' will remove in next minor version, use 'onClick' instead.`,
      button
    )
    onClick = button.click
  }

  const children = Array.isArray(_children)
    ? _children.map(normalizeButton)
    : []

  return {
    text,
    children,
    buttonAttrs: {
      type,
      icon,
      onClick,
      ...buttonAttrs,
    },
  }
}

export default defineComponent({
  name: 'FilterbarButtons',

  props: {
    buttons: {
      type: Array as PropType<FilterButton[]>,
      default: /* istanbul ignore next */ () => [],
    },
  },

  setup(props) {
    function renderButton(button: FilterButton) {
      if (!isValidButtonConfig(button)) return null

      if (isFunction(button)) {
        return h(button())
      } else if (isFunction(button.render)) {
        return h(button.render())
      } else if (isVNode(button)) {
        return h(button)
      } else if (Array.isArray(button.children)) {
        return renderDropdownButton(button)
      } else {
        return renderSingleButton(button)
      }
    }

    function renderSingleButton(button: FilterButton) {
      const { text, buttonAttrs } = normalizeButton(button)
      return <ElButton {...buttonAttrs}>{text}</ElButton>
    }

    function renderDropdownButton(button: FilterButton) {
      const { text, children, buttonAttrs } = normalizeButton(button)
      return h(
        ElDropdown,
        {
          ...buttonAttrs,
          trigger: 'click',
          placement: 'bottom',
        },
        {
          default: () => {
            const content = []
            buttonAttrs.icon && content.push(buttonAttrs.icon)
            content.push(<span>{text}</span>)

            return buttonAttrs.splitButton ? (
              content
            ) : (
              <ElButton {...buttonAttrs}>
                {content}
                <ElIcon class="ElIcon--right">
                  <ArrowDown />
                </ElIcon>
              </ElButton>
            )
          },
          dropdown: () => (
            <ElDropdownMenu>
              {children.map((child) => {
                const { text, buttonAttrs } = child
                return (
                  <ElDropdownItem {...(buttonAttrs as any)}>
                    {text}
                  </ElDropdownItem>
                )
              })}
            </ElDropdownMenu>
          ),
        }
      )
    }

    return () => (
      <ElFormItem>
        {props.buttons.map((button) => renderButton(button))}
      </ElFormItem>
    )
  },
})
</script>
