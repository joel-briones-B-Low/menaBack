import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Venta } from './venta.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Venta],
      synchronize: true,
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([Venta]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
