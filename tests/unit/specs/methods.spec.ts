import { describe, it, expect } from 'vitest'
import { createListviewWrapper, wait } from '../helpers'

describe('Methods', () => {
  it('resetFilter()', async () => {
    const { vm, lvStore } = await createListviewWrapper({
      filterModel: {
        text: '123',
        multiple: [1, 2, 3],
      },
      filterFields: [
        { type: 'text', model: 'text' },
        { type: 'multipleSelect', model: 'multiple' },
      ],
    })

    vm.resetFilter()
    await wait()
    expect(lvStore.filterModel).toEqual({
      text: undefined,
      multiple: [],
    })
  })

  describe('setContentMessage', () => {
    it('setContentMessage("text")', async () => {
      const { wrapper, vm } = await createListviewWrapper({ autoload: false })
      const messageText = 'message text'
      vm.setContentMessage(messageText)
      await wait()
      expect(wrapper.find('.lv__message-text').text().trim()).toBe(messageText)
    })

    it('setContentMessage("text", "error")', async () => {
      const { wrapper, vm } = await createListviewWrapper({ autoload: false })
      vm.setContentMessage('text', 'error')
      await wait()
      expect(
        wrapper.find('.lv__message.lv__message--error').exists()
      ).toBeTruthy()
    })

    it('setContentMessage("text", "error", true)', async () => {
      const { wrapper, vm } = await createListviewWrapper({
        requestHandler: () => ({
          result: { items: [{}], total: 1 },
          is_success: true,
        }),
      })
      vm.setContentMessage('text')
      await wait()
      expect(wrapper.find('.lv__message').exists()).toBe(false)
      vm.setContentMessage('text', null, true)
      await wait()
      expect(wrapper.find('.lv__message').exists()).toBe(true)
    })
  })
})
