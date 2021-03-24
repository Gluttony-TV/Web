import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import UUID from '../decorators/UUID'
import BadRequestError from '../error/BadRequestError'
import Credentials from './Credentials'
import Progress from './Progress'
import { Many } from './Relations'
import Session from './Session'
import Timestamps from './Timestamps'

export enum UserRole {
   ADMIN = 'admin',
   USER = 'user',
   FAKE = 'fake',
}

@Entity()
export default class User extends BaseEntity {
   @UUID()
   id!: string

   @Column(() => Timestamps)
   timestamps!: Timestamps

   @Column()
   username!: string

   @Column({ default: false })
   verified!: boolean

   @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
   role!: UserRole

   @OneToMany(() => Session, t => t.user, { cascade: true })
   sessions!: Many<Session>

   @OneToMany(() => Progress, p => p.user, { cascade: true })
   progress!: Many<Progress>

   @Column('timestamp', { nullable: true })
   birth?: Date

   //@OneToMany(() => Credentials, a => a.user, { cascade: true })
   //accounts!: LazyMany<Credentials>

   @OneToOne(() => Credentials, c => c.user, { cascade: true, eager: true, nullable: true })
   @JoinColumn()
   credentials?: Credentials

   static async register(data: { username: string; email?: string; password: string; role?: UserRole }) {
      const { email, password, ...user } = data

      const existing = await Credentials.findOne({ email })
      if (existing) throw new BadRequestError('User with this username does already exist', 'username')

      const credentials = Credentials.create({ email, password })
      return await User.create({ ...user, credentials }).save()
   }
}
