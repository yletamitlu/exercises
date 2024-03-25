<template>
	<base-dropdown
		v-bind="$attrs"
		@keydown.down="handleArrowDown"
		@keydown.up="handleArrowUp"
	>
		<template #activator="activatorScopedSlots">
			<div :style="{ width: inputWidth }">
				<base-input
					v-bind="$attrs"
					ref="searchInput"
					v-model="inputValue"
					:readonly="readonly"
					:focus="focus"
					@click="handleInputClick(activatorScopedSlots)"
					@input="handleInput(activatorScopedSlots)"
					@keydown.enter="handleEnterKeydown(activatorScopedSlots)"
				>
					<template v-if="$slots.iconLeft" #iconLeft>
						<slot name="iconLeft" v-bind="activatorScopedSlots" />
					</template>

					<template v-if="$slots.iconRight" #iconRight>
						<slot name="iconRight" v-bind="activatorScopedSlots" />
					</template>
				</base-input>
			</div>
		</template>

		<template #popper-header>
			<slot name="select-header" />
		</template>

		<template #default="popperScopedSlots">
			<slot name="pre-content"></slot>
			<!--TODO: We have v-if by popperScopedSlots.shown here as need to disable recalculating inside useVirtualList
			that causes bug with blank view in opened popper and error with ResizeObserver -->
			<items-group
				v-if="popperScopedSlots.shown"
				v-model="modelValue"
				:item-value="itemValue"
				:multiselect="multiselect"
				@update:model-value="$emit('select', $event)"
			>
				<DynamicScroller
					ref="scroller"
					:items="items"
					:min-item-size="itemHeight"
					:style="{ height: popperHeight + 'px' }"
				>
					<template #default="{ item, index, active }">
						<DynamicScrollerItem
							:item="item"
							:active="active"
							:data-index="index"
						>
							<group-item
								:key="getKey(item)"
								ref="itemsRef"
								:item="item"
								:is-hovered="isHovered(index)"
								@click="handleHide(popperScopedSlots.hide)"
								@mouseenter="handleMouseenter"
								@mouseleave="handleMouseleave(index)"
							>
								<template #default="{ selected, toggleOption }">
									<slot
										name="select-item"
										v-bind="{
											item,
											selected,
											toggleOption,
											isHovered: isHovered(index),
										}"
									/>
								</template>
							</group-item>
						</DynamicScrollerItem>
					</template>
				</DynamicScroller>
			</items-group>
		</template>
	</base-dropdown>

	<base-spacer v-if="selectedItems?.length && multiselect" size="m" />

	<items-group
		v-if="selectedItems?.length && multiselect"
		v-model="modelValue"
		:item-value="itemValue"
		@update:model-value="$emit('select', $event)"
	>
		<div class="flex gap-xs flex-wrap">
			<group-item
				v-for="item in (selectedItems as BaseItem[])"
				:key="getKey(item)"
				:item="(item as BaseItem)"
			>
				<template #default="{ toggleOption }">
					<slot
						name="selected-item"
						v-bind="{ item, toggleOption }"
					/>
				</template>
			</group-item>
		</div>
	</items-group>
</template>

<script lang="ts">
import type { BaseItem, BaseItemOrArray } from '@/types'

interface ActivatorScopedSlots {
	shown: boolean
	show: () => void
	hide: () => void
}

interface SelectProps {
	items: BaseItem[]
	modelValue: BaseItemOrArray
	inputValue: string
	itemHeight: number
	popperHeight: number
	inputWidth?: string
	itemValue?: string
	multiselect?: boolean
	readonly?: boolean
	hideSelectedItems?: boolean
	focus?: boolean
	focusOnHide?: boolean
}

interface SelectEmits {
	(e: 'update:modelValue', data: BaseItemOrArray): void
	(e: 'select', data: BaseItemOrArray): void
	(e: 'update:inputValue', data: string): void
}

export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import BaseDropdown from '@/components/dropdown/base-dropdown.vue'
import ItemsGroup from '@/components/groups/items-group/items-group.vue'
import GroupItem from '@/components/groups/items-group/items-group-item.vue'
import BaseSpacer from '@/components/spacer/base-spacer.vue'
import BaseInput from '@/components/inputs/base-input.vue'
import { useKeysNavigation } from '@/composables/useKeysNavigation'
import { hasField } from '@/utils/objectHasField'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

const props = withDefaults(defineProps<SelectProps>(), {
	readonly: true,
	itemValue: undefined,
	inputWidth: 'auto',
	focus: false,
	focusOnHide: false,
})
const emit = defineEmits<SelectEmits>()

const modelValue = useVModel(props, 'modelValue', emit)
const inputValue = useVModel(props, 'inputValue', emit)

const items = computed(() => props.items)
const itemsLength = computed(() => items.value.length)

const itemsRef = ref()
const searchInput = ref()
const scroller = ref()

function selectItemCallback(hoveredItemIdx: number) {
	const itemToAdd = items.value[hoveredItemIdx]

	if (!itemToAdd) {
		return
	}

	if (Array.isArray(modelValue.value)) {
		modelValue.value.push(itemToAdd)
		inputValue.value = ''
	} else {
		modelValue.value = itemToAdd
	}
}

function scrollTo(index: number) {
	if (scroller.value) {
		scroller.value.scrollToItem(index)
	}
}

const {
	isHovered,
	handleArrowDown,
	handleArrowUp,
	handleEnter,
	handleMouseenter,
	handleMouseleave,
} = useKeysNavigation({
	itemsLength,
	itemsRef,
	selectItemCallback,
	scrollTo,
})

const selectedItems = computed<BaseItemOrArray>(() => {
	if (props.itemValue) {
		return props.items.filter((item) => {
			if (
				props.itemValue &&
				hasField(item, props.itemValue) &&
				hasField(modelValue.value, props.itemValue)
			) {
				return !!modelValue.value[item[props.itemValue] as string]
			}

			return false
		})
	}

	return modelValue.value as BaseItemOrArray
})

const getKey = (item: BaseItem) => {
	return (
		props.itemValue && hasField(item, props.itemValue)
			? item[props.itemValue]
			: item
	) as string
}

function handleInputClick(activatorScopedSlots: ActivatorScopedSlots) {
	if (!activatorScopedSlots.shown && !props.multiselect) {
		return activatorScopedSlots.show()
	}
}

function handleInput(activatorScopedSlots: ActivatorScopedSlots) {
	if (!activatorScopedSlots.shown) {
		return activatorScopedSlots.show()
	}
}

function handleHide(hideFn: () => void) {
	hideFn()

	if (props.focusOnHide) {
		searchInput.value.input.focus()
	}
}

function handleEnterKeydown(activatorScopedSlots: ActivatorScopedSlots) {
	handleEnter()
	if (activatorScopedSlots.shown) {
		activatorScopedSlots.hide()
	}
}
</script>
