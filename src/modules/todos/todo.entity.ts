import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class TodoEntity {
  fill(data) {
    for (const index in data) {
      this[index] = data[index];
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  status: number;


  @Column()
  created_at: string;
}
