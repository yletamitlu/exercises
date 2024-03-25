export type UniqueId = 'string'

export type Nullable<T> = T | undefined | null

export type BaseObject = { [key: string]: unknown }

export interface IdentifiableObject extends BaseObject {
	id: string
}

export type BaseItem = BaseObject | string

export type BaseItemOrArray = BaseItem[] | BaseItem
