import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { BusInfosEntity } from './bus-infos.entity';
import { BusRouteEntity } from './bus-route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusInfosEntity, BusRouteEntity])],
  controllers: [BusController],
  providers: [BusService],
  exports: [BusService],
})
export class BusModule {}
