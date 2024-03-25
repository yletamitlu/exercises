<template>
	<div :class="{ 'w-full': block }">
		<slot
			v-bind="{
				selected: isSelected(item),
				toggleOption,
			}"
		/>
	</div>
</template>

<script lang="ts">
import { SELECT_PROVIDER, type SelectProvider } from './index'
import type { BaseItem } from '@/types'

interface VItemProps {
	item: BaseItem
	isHovered?: boolean
	block?: boolean
}
</script>

<script lang="ts" setup>
import { inject } from 'vue'

defineProps<VItemProps>()

const { isSelected, toggleOption } = inject<SelectProvider>(
	SELECT_PROVIDER,
) as SelectProvider
</script>
