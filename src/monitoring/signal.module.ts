import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalEntity } from './signal.entity';
import { SignalController } from './signal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SignalEntity])],
  controllers: [SignalController],
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
