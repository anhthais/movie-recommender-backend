import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Playlist from './playlist.entity';

@Entity({ name: 'playlist_item' })
export default class PlaylistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'movie_id',
    nullable: false,
  })
  movieId: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'playlist_id',
  })
  playlist: Playlist;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
