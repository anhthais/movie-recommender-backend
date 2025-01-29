import User from '@/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import PlaylistItem from './playlist-item.entity';

export enum PlayListAccessibility {
  'PUBLIC' = 'public',
  'PRIVATE' = 'private',
}

@Entity({ name: 'playlist' })
export default class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: PlayListAccessibility,
    default: PlayListAccessibility.PUBLIC,
  })
  accessibility: PlayListAccessibility;

  @OneToMany(() => PlaylistItem, (item) => item.playlist)
  items: PlaylistItem[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
