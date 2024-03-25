import type { BaseItem } from '@/types'

export const SELECT_PROVIDER = 'selectProvider'

export interface SelectProvider {
	isSelected: (option: BaseItem) => boolean
	toggleOption: (option: BaseItem) => void
}
