import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthProvider {
  'LOCAL' = 'local',
  'GOOGLE' = 'google',
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'text' })
  fullname: string;

  @Column({ type: 'boolean', default: false })
  activated: boolean;

  @Column({ type: 'boolean', default: false })
  disabled: boolean;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Column({ nullable: true })
  picture?: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken?: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
