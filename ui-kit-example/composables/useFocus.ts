import { ref } from 'vue'

export const useFocus = () => {
	const hasFocus = ref(false)

	function focusIn() {
		hasFocus.value = true
	}

	function focusOut() {
		hasFocus.value = false
	}

	return {
		hasFocus,
		focusIn,
		focusOut,
	}
}
