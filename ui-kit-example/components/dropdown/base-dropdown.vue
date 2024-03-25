<template>
	<FloatingDropdown
		v-bind="{ ...dropdownConfig, ...$attrs }"
		theme="dropdown-theme"
		:flip="false"
	>
		<template #default="activatorScopedSlots">
			<div v-if="$slots.activator">
				<slot name="activator" v-bind="activatorScopedSlots" />
			</div>
		</template>

		<template #popper="popperScopedSlots">
			<div
				v-if="$slots['default'] || $slots['popper-header']"
				class="bg-neutral-0 rounded-small p-s"
				:class="popperClasses"
				:style="{ width: popperWidth }"
			>
				<slot name="popper-header" />

				<slot v-bind="popperScopedSlots" />
			</div>
		</template>
	</FloatingDropdown>
</template>

<script lang="ts">
interface DropdownProps {
	popperWidth?: string
	popperClasses?: string[]
}

export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { Dropdown as FloatingDropdown } from 'floating-vue'
import { defineComponent } from 'vue'
import { dropdownConfig } from '.'

withDefaults(defineProps<DropdownProps>(), {
	popperWidth: 'auto',
})

defineComponent({
	...FloatingDropdown,
	vDropdownTheme: 'dropdown-theme',
})
</script>
