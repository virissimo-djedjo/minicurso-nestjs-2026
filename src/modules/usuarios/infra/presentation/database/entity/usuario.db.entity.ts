import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UsuarioModel } from '../../../../domain/entity/usuario.entity';

@Table({
  timestamps: true,
  tableName: 'usuarios',
  underscored: true,
})
export default class UsuarioDBEntity extends Model<UsuarioModel> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  declare public readonly id: number;

  @Column({
    type: DataType.TEXT,
  })
  public nome: string;
  @Column({
    type: DataType.TEXT,
  })
  public sobrenome: string;
  @Column({
    type: DataType.STRING(35),
  })
  public nomeUsuario: string;
  @Column({
    type: DataType.STRING(255),
  })
  public email: string;
  @Column({
    type: DataType.TEXT,
  })
  public senhaHash: string;
  @Column({
    type: DataType.STRING(14),
  })
  public cpf: string;
  @Column({
    type: DataType.JSONB,
  })
  public bio: any;
  @Column({
    type: DataType.TEXT,
  })
  public imagemPerfilUrl: string;
  @Column({
    type: DataType.TEXT,
  })
  public status: string;
}
