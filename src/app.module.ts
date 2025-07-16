import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import * as path from 'path';
import * as process from 'node:process';

// Service Imports
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

// Module Imports
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { BusModule } from './bus/bus.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SignalModule } from './monitoring/signal.module';
import { StatisticsModule } from './statistics/statistics.module';

// Entity Imports
import { UserEntity } from './user/user.entity';
import { RoleEntity } from './user/role.entity';
import { BusInfosEntity } from './bus/bus-infos.entity';
import { BusRouteEntity } from './bus/bus-route.entity';
import { BusOccupancyRateEntity } from './bus/bus-occupancy-rate.entity';
import { BusArrivalRateEntity } from './bus/bus-arrival-rate.entity';
import { BusPassengersEntity } from './bus/bus-passengers.entity';
import { BusRouteUsageStatsEntity } from './bus/bus-route-usage-stats.entity';
import { SignalEntity } from './monitoring/signal.entity';
import { FileModule } from './file/file.module';
import { BoardModule } from './board/board.module';
import { FileEntity } from './file/file.entity';
import { BoardEntity } from './board/board.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.DB_LOGGING === 'true',
      timezone: 'local',
      dateStrings: true,
      entities: [path.join(__dirname, 'src/**/*.entity.{ts,js}')],
      migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      BusInfosEntity,
      BusRouteEntity,
      BusOccupancyRateEntity,
      BusArrivalRateEntity,
      BusPassengersEntity,
      BusRouteUsageStatsEntity,
      SignalEntity,
      FileEntity,
      BoardEntity,
    ]),
    AuthModule,
    RedisModule,
    UserModule,
    BusModule,
    DashboardModule,
    SignalModule,
    StatisticsModule,
    FileModule,
    BoardModule,
  ],
  controllers: [],
  providers: [AuthService, JwtService],
  exports: [],
})
export class AppModule {}
