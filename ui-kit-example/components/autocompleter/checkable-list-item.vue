<template>
	<list-item v-bind="$attrs" @click="handleClick">
		<template v-if="$slots.icon" #prepend>
			<slot name="icon" />
		</template>

		<template #default>
			<slot />
		</template>

		<template #append>
			<base-checkbox
				:model-value="active"
				:has-background="false"
				:has-text="false"
				@click.stop
			/>
		</template>
	</list-item>
</template>

<script lang="ts">
import type { Nullable } from '@/types'

interface ListItemProps {
	active: boolean
}

export default {
	inheritAttrs: false,
}

interface ListItemEmits {
	(e: 'click', event: Nullable<object>): void
}
</script>

<script setup lang="ts">
import ListItem from '@/components/list-item/list-item.vue'
import BaseCheckbox from '@/components/checkbox/base-checkbox.vue'
defineProps<ListItemProps>()

const emit = defineEmits<ListItemEmits>()

function handleClick(event: Nullable<object>) {
	emit('click', event)
}
</script>
