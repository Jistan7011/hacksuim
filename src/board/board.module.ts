import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardEntity } from './board.entity';
import { UserEntity } from '../user/user.entity';
import { FileEntity } from '../file/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, UserEntity, FileEntity])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
