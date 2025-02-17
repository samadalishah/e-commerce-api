import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  public update(user: User): User {
    this.name = user.name
    this.email = user.email
    this.password = user.password

    return this
  }
}