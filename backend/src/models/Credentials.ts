import bcrypt from 'bcrypt'
import { BaseEntity, BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import Hidden from '../decorators/Hidden'
import { One } from './Relations'
import Timestamps from './Timestamps'
import User from './User'

@Entity()
export default class Credentials extends BaseEntity {
   @PrimaryGeneratedColumn()
   id!: number

   @Column(() => Timestamps)
   timestamps!: Timestamps

   @OneToOne(() => User, u => u.credentials)
   user!: One<User>

   @Column({ unique: true, nullable: true })
   email?: string

   @Column({ default: false })
   verified!: boolean

   @Hidden()
   @Column()
   password!: string

   @Hidden()
   @Column()
   salt!: string

   @BeforeInsert()
   async setPassword(password: string) {
      this.salt ??= bcrypt.genSaltSync()
      this.password = bcrypt.hashSync(password ?? this.password, this.salt)
   }
}
