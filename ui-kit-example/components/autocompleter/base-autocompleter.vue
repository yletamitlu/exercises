<template>
	<base-select
		v-model="selectedItems"
		:items="searchedItems"
		:multiselect="props.multiselect"
		:popper-height="contentHeight"
		:item-height="itemHeight"
		auto-hide
		:focus="focus"
		:input-value="searchValue"
		:item-value="itemValue"
		:readonly="false"
		v-bind="$attrs"
		@update:input-value="handleSearchChange"
		@select="$emit('select', $event)"
	>
		<template #iconLeft="activatorScopedSlots">
			<slot name="iconLeft" v-bind="activatorScopedSlots">
				<svg-icon name="search" />
			</slot>
		</template>

		<template #iconRight="activatorScopedSlots">
			<slot name="iconRight" v-bind="activatorScopedSlots" />
		</template>
		<template #select-header>
			<slot
				name="autocompleter-header"
				v-bind="{ searchValue, handleSearchChange }"
			/>
			<slot name="nothingFound">
				<slot
					v-if="searchedItems.length && !loading"
					name="pre-content"
				></slot>

				<div
					v-if="!searchedItems.length && !loading"
					class="w-full flex justify-center py-s pr-xs"
				>
					<base-label :size="Size.M" :mode="Mode.SECONDARY">
						Nothing was found
					</base-label>
				</div>
			</slot>

			<slot v-if="loading" name="loading-content" />
		</template>

		<template
			v-if="!loading"
			#select-item="{ selected, item, toggleOption, isHovered }"
		>
			<slot
				name="autocompleterItem"
				v-bind="{
					selected,
					item,
					toggleOption,
					isHovered,
					handleSearchChange,
				}"
			>
				<list-item
					:active="selected"
					:checkable="true"
					:is-force-hovered="isHovered"
					@click="toggleOption(item)"
				>
					{{
						itemTitle && hasField(item, itemTitle)
							? item[itemTitle]
							: item
					}}
				</list-item>
			</slot>
		</template>

		<template #selected-item="{ item, toggleOption }">
			<slot name="selected-item" v-bind="{ item, toggleOption }">
				<base-chip
					:closable="true"
					@close="toggleOption(item as BaseItem)"
				>
					{{
						itemTitle && hasField(item, itemTitle)
							? item[itemTitle]
							: item
					}}
				</base-chip>
			</slot>
		</template>
	</base-select>
</template>

<script lang="ts">
import type { BaseObject, BaseItemOrArray } from '@/types'

interface AutoCompleterProps {
	modelValue: BaseItemOrArray
	items: BaseObject[]
	itemTitle: string
	filterKeys: string[]
	itemValue?: string
	popperHeight: number
	itemHeight: number
	multiselect?: boolean
	loading?: boolean
	initialInputValue?: string
	focus?: boolean
}

interface AutoCompleterEmits {
	(e: 'update:modelValue', data: unknown): void
	(e: 'update:inputValue', data: string): void
	(e: 'select', data: unknown): void
}

export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { useSearch } from '@/composables/useSearch'
import { Mode, Size } from '@/components/typography'
import type { BaseItem } from '@/types'
import BaseSelect from '@/components/select/base-select.vue'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import BaseChip from '@/components/chip/base-chip.vue'
import BaseLabel from '@/components/typography/base-label.vue'
import ListItem from './checkable-list-item.vue'
import { hasField } from '@/utils/objectHasField'

const props = withDefaults(defineProps<AutoCompleterProps>(), {
	items: () => [],
	multiselect: false,
	itemTitle: 'title',
	filterKeys: () => ['title'],
	initialInputValue: '',
})

const emit = defineEmits<AutoCompleterEmits>()
const selectedItems = useVModel(props, 'modelValue', emit)

const items = computed(() => props.items)
const { searchValue, searchedItems } = useSearch(
	items,
	props.filterKeys,
	props.initialInputValue,
)

function handleSearchChange(e: string) {
	searchValue.value = e
	emit('update:inputValue', e)
}

if (!props.multiselect) {
	watch(
		selectedItems,
		() => {
			if (selectedItems.value) {
				if (
					props.itemTitle &&
					hasField(selectedItems.value, props.itemTitle)
				) {
					searchValue.value = selectedItems.value[
						props.itemTitle
					] as string
				} else {
					searchValue.value = selectedItems.value as string
				}
			}
		},
		{ deep: true },
	)
}

const contentHeight = computed(() => {
	if (!searchedItems.value.length) {
		return 0
	}

	const currentItemsHeight = searchedItems.value.length * props.itemHeight
	const ratio = props.popperHeight / currentItemsHeight

	return ratio > 1 ? currentItemsHeight : props.popperHeight
})
</script>
