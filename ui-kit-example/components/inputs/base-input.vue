<template>
	<div class="flex flex-col gap-xxs" :class="{ 'w-full': block }">
		<template v-if="label">
			<base-label :size="Size.M">
				{{ label }}
			</base-label>
		</template>

		<label
			class="flex justify-start items-center h-[56px] px-s border-m rounded-small cursor-text text-left bg-neutral-0"
			:class="calculatedStyles"
		>
			<div v-if="$slots.iconLeft" class="self-center mr-xxs">
				<slot name="iconLeft" />
			</div>

			<span class="block flex-1">
				<input
					ref="input"
					v-model="value"
					class="w-full bg-transparent outline-none text-neutral-900 placeholder-neutral-100"
					:class="{
						'hover:cursor-pointer': readonly,
						'bg-neutral-25': disabled,
					}"
					:readonly="readonly"
					:disabled="disabled"
					v-bind="$attrs"
					@focus="focusin"
					@focusout="focusout"
					@select.stop
				/>
			</span>

			<span
				v-if="clearable || $slots.iconRight"
				class="flex justify-end items-center"
			>
				<template v-if="clearable && !readonly">
					<button
						type="button"
						:class="{
							'opacity-0 invisible': !hasFocus || !modelValue,
						}"
						tabindex="-1"
						@mousedown.prevent
						@click="erase()"
					>
						<svg-icon class="text-neutral-300" name="close" />
					</button>
				</template>

				<div v-if="$slots.iconRight" class="self-center cursor-default">
					<slot name="iconRight" />
				</div>
			</span>
		</label>

		<base-message v-if="!!message">{{ message }}</base-message>
	</div>
</template>

<script lang="ts">
interface InputProps {
	modelValue: string
	label?: string
	message?: string
	focus?: boolean
	clearable?: boolean
	hasError?: boolean
	disabled?: boolean
	readonly?: boolean
	block?: boolean
	border?: boolean
}

export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import BaseLabel from '@/components/typography/base-label.vue'
import { Size } from '@/components/typography'
import { useVModel } from '@vueuse/core'
import BaseMessage from '@/components/message/base-message.vue'

const props = withDefaults(defineProps<InputProps>(), {
	modelValue: '',
	label: '',
	message: '',
})

const emit = defineEmits(['update:modelValue'])

const hasFocus = ref(false)
const input = ref<HTMLInputElement | null>(null)
const value = useVModel(props, 'modelValue', emit)

defineExpose({
	input,
})

onMounted(() => {
	if (props.focus) {
		input.value?.focus()
	}
})

watch(
	() => props.focus,
	(newVal) => {
		if (newVal) {
			input.value?.focus()
		}
	},
	{
		deep: true,
	},
)

const calculatedStyles = computed(() => {
	return [
		{ 'border-neutral-100 hover:border-neutral-300': !props.hasError },
		{
			'border-neutral-300':
				hasFocus.value &&
				!props.disabled &&
				!props.readonly &&
				!props.hasError,
		},
		{ 'border-error-500 hover:border-error-500': props.hasError },
		{
			'bg-neutral-25 cursor-auto hover:border-neutral-25': props.disabled,
		},
		{ 'hover:cursor-pointer': props.readonly },
		{ 'hover:border-neutral-100': props.readonly && !props.hasError },
	]
})

function erase() {
	if (props.readonly || props.disabled) {
		return
	}

	emit('update:modelValue', '')
	input.value?.focus()
}

function focusin() {
	hasFocus.value = true
}

function focusout() {
	hasFocus.value = false
}
</script>
