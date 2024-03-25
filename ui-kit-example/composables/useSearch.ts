import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { BaseObject } from '@/types'
import { hasField } from '@/utils/objectHasField'

export function useSearch(
	items: Ref<BaseObject[]>,
	fields: Array<keyof BaseObject> = ['title'],
	initialSearchValue = '',
) {
	const searchValue: Ref<string> = ref(initialSearchValue)

	const searchedItems = computed(() => {
		const searchString = searchValue.value?.toLowerCase() || ''

		if (!searchString) {
			return items.value
		}

		const filtered = items.value.filter((item: BaseObject) => {
			return fields.some((field) => {
				if (hasField(item, field)) {
					const fieldValue = item[field]

					if (typeof fieldValue === 'string') {
						return fieldValue.toLowerCase().includes(searchString)
					}
				}

				return false
			})
		})

		return filtered.sort((a, b) => {
			// Find key, which contains searched value for both objects
			const field = fields.find(
				(el) =>
					(a[el] as string).includes(initialSearchValue) &&
					(b[el] as string).includes(initialSearchValue),
			)

			if (!field) {
				return 0
			}

			const indexA = ((a[field] || '') as string)
				.toLowerCase()
				.indexOf(searchString)
			const indexB = ((b[field] || '') as string)
				.toLowerCase()
				.indexOf(searchString)

			if (indexA === -1 && indexB === -1) {
				return 0
			}

			if (indexA === -1) {
				return 1
			}

			if (indexB === -1) {
				return -1
			}

			return indexA - indexB
		})
	})

	return {
		searchedItems,
		searchValue,
	}
}
