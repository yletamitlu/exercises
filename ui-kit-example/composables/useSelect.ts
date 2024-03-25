import type { Ref } from 'vue'
import type { BaseItem } from '@/types'
import { isArray, isEqual } from 'lodash'
import { hasField } from '@/utils/objectHasField'

type SelectOptionType<S> = S | string

interface SelectInterface<T extends BaseItem> {
	selected: Ref<SelectOptionType<T>[] | SelectOptionType<T>>
	itemValue?: string
	multiselect?: boolean
}

export function useSelect<T extends BaseItem>({
	selected,
	itemValue,
	multiselect = false,
}: SelectInterface<T>) {
	function isSelected(option: SelectOptionType<T>) {
		if (multiselect && isArray(selected.value)) {
			return !!selected.value.find((el) => {
				if (itemValue && hasField(option, itemValue)) {
					return el === option[itemValue]
				} else {
					return isEqual(el, option)
				}
			})
		}

		return isEqual(option, selected.value)
	}

	function selectOption(option: SelectOptionType<T>) {
		let item: T | string

		if (itemValue && hasField(option, itemValue)) {
			item = option[itemValue] as string
		} else {
			item = option
		}

		if (multiselect && isArray(selected.value)) {
			selected.value = [...selected.value, item]
		} else {
			selected.value = item
		}
	}

	function deselectOption(option: SelectOptionType<T>) {
		if (multiselect && isArray(selected.value)) {
			selected.value = selected.value.filter((el) => {
				if (itemValue && hasField(option, itemValue)) {
					return el !== option[itemValue]
				}
				return !isEqual(el, option)
			})
		}
	}

	function toggleOption(option: SelectOptionType<T>) {
		const added = isSelected(option)

		if (multiselect) {
			added ? deselectOption(option) : selectOption(option)
		} else if (!added) {
			selected.value = option
		}
	}

	return {
		isSelected,
		toggleOption,
		selectOption,
		deselectOption,
	}
}
