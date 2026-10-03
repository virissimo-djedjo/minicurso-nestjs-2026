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
  declare id: number;

  @Column({
    type: DataType.TEXT,
  })
  declare nome: string;
  @Column({
    type: DataType.TEXT,
  })
  declare sobrenome: string;
  @Column({
    type: DataType.STRING(35),
  })
  declare nomeUsuario: string;
  @Column({
    type: DataType.STRING(255),
  })
  declare email: string;
  @Column({
    type: DataType.TEXT,
  })
  declare senhaHash: string;
  @Column({
    type: DataType.STRING(14),
  })
  declare cpf: string;
  @Column({
    type: DataType.JSONB,
  })
  declare bio: any;
  @Column({
    type: DataType.TEXT,
  })
  declare imagemPerfilUrl: string;
  @Column({
    type: DataType.TEXT,
  })
  declare status: string;
}
