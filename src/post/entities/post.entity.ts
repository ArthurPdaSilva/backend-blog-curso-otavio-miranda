import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ unique: true })
  slug: string

  @Column('text')
  content: string

  @Column()
  excerpt: string

  @Column({ nullable: true })
  coverImageUrl: string

  @Column({ default: false })
  published: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Cascade -> ao apagar o usuário é apagado todos os posts deles
  // set null => seta a foreing key como null
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User
}
