<template>
	<slot />
</template>

<script lang="ts">
import { SELECT_PROVIDER, type SelectProvider } from './index'
import type { BaseItemOrArray } from '@/types'

interface ItemsGroupProps {
	modelValue: BaseItemOrArray
	itemValue?: string
	multiselect?: boolean
}

interface ItemsGroupEmits {
	(e: 'update:modelValue', data: BaseItemOrArray): void
}

export default {
	inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { provide } from 'vue'
import { useSelect } from '@/composables/useSelect'
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<ItemsGroupProps>(), {
	multiselect: true,
})
const emit = defineEmits<ItemsGroupEmits>()

const modelValue = useVModel(props, 'modelValue', emit)

const { isSelected, toggleOption } = useSelect({
	selected: modelValue,
	itemValue: props.itemValue,
	multiselect: props.multiselect,
})

provide<SelectProvider>(SELECT_PROVIDER, {
	isSelected,
	toggleOption,
})
</script>
