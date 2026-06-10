import { Global, Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';

/**
 * Módulo global: exporta RolesGuard para usar @UseGuards(RolesGuard) + @Roles(...)
 * en cualquier controlador sin importar AuthModule (evita dependencias circulares).
 */
@Global()
@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RbacModule {}
