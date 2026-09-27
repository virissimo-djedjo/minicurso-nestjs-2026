import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [CommonModule, UsuariosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
