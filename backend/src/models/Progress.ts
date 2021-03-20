import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { One } from './Relations'
import Timestamps from './Timestamps'
import User from './User'

@Entity()
@Index('show_per_user', p => [p.user, p.show], { unique: true })
export default class Progress extends BaseEntity {
   @PrimaryGeneratedColumn()
   id!: number

   @ManyToOne(() => User, u => u.progress)
   user!: One<User>

   @Column()
   show!: number

   @Column('int', { unsigned: true, array: true })
   watched!: number[]

   @Column(() => Timestamps)
   timestamps!: Timestamps
}
