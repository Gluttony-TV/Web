import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { stripHidden } from '../decorators/Hidden'
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
   credentials?: Credentials

   static findBy(username: string, email = username) {
      const query = this.createQueryBuilder('user').orWhere('creds.email = :email OR creds.username = :username', { username, email }).leftJoinAndSelect('user.credentials', 'creds')

      console.log(query.getSql())

      return query.getOne()
   }

   joinCredentials() {
      const creds = this.credentials
      return creds ? { ...stripHidden(this), ...stripHidden(creds) } : stripHidden(this)
   }

   static async register(data: { username: string; email?: string; password: string; role?: UserRole }) {
      const { email, username, password, ...user } = data

      const existing = await this.findBy(username, email)
      if (existing) throw new BadRequestError('User with this username does already exist', 'username')

      const credentials = Credentials.create({ email, password, username })
      return await User.create({ ...user, credentials }).save()
   }
}
