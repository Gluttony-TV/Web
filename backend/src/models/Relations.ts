import { BaseEntity, DeepPartial } from 'typeorm'

export type One<E extends BaseEntity> = DeepPartial<E> | Promise<DeepPartial<E>>
export type Many<E extends BaseEntity> = DeepPartial<E[]> | Promise<DeepPartial<E>[]>
