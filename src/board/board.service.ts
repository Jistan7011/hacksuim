import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { BoardEntity } from './board.entity';
import { ReqWriteBoardDto } from './dto/req/req.write-board.dto';
import { ReqWriteNoticeDto } from './dto/req/req.write-notice.dto';
import { BadRequestException } from '../common/exception';
import { UserEntity } from '../user/user.entity';
import { FileEntity } from '../file/file.entity';

@Injectable()
export class BoardService {
  private readonly boardType: string[] = ['general', 'notice'];

  constructor(
    @InjectRepository(BoardEntity)
    private boardRepository: Repository<BoardEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async createBoard(currentUserEmail: string, data: ReqWriteBoardDto): Promise<{ boardId: string; boardType: string }> {
    const DEFAULT_BOARD_TYPE: string = 'general';
    const boardId: string = uuidv4();

    if (currentUserEmail !== data.writerEmail) {
      throw new BadRequestException('정상적인 작성자 정보가 아닙니다.');
    }

    if (!this.boardType.includes(data.boardType) || data.boardType !== DEFAULT_BOARD_TYPE) {
      throw new BadRequestException('잘못된 접근.');
    }

    const checkWriter: UserEntity | null = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: data.writerEmail })
      .getOne();

    if (!checkWriter) {
      throw new BadRequestException('작성자가 정보 존재하지 않음.');
    }

    if (data.fileId) {
      const checkUploadedFile = await this.fileRepository
        .createQueryBuilder('files')
        .where('files.file_id = :file_id', { file_id: data.fileId })
        .getOne();

      if (!checkUploadedFile) {
        throw new BadRequestException('첨부파일 오류 발생.');
      }
    }

    try {
      await this.boardRepository
        .createQueryBuilder('boards')
        .insert()
        .into(BoardEntity)
        .values({
          board_id: boardId,
          writer_email: data.writerEmail,
          file_id: data.fileId ? data.fileId : null,
          board_type: DEFAULT_BOARD_TYPE,
          title: data.title,
          content: data.content,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('게시글 생성 실패.');
    }

    return { boardId: boardId, boardType: DEFAULT_BOARD_TYPE };
  }

  async createNotice(data: ReqWriteNoticeDto): Promise<{ boardId: string; boardType: string }> {
    const DEFAULT_BOARD_TYPE: string = 'notice';
    const boardId: string = uuidv4();

    if (!this.boardType.includes(data.boardType) || data.boardType !== DEFAULT_BOARD_TYPE) {
      throw new BadRequestException('잘못된 접근.');
    }

    const checkWriter: UserEntity | null = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: data.writerEmail })
      .andWhere(`(users.role = 'level_1' OR users.role = 'level_2')`)
      .getOne();

    if (!checkWriter) {
      throw new BadRequestException('작성자 정보 존재하지 않음.');
    }

    if (data.fileId) {
      const checkUploadedFile = await this.fileRepository
        .createQueryBuilder('files')
        .where('files.file_id = :file_id', { file_id: data.fileId })
        .getOne();

      if (!checkUploadedFile) {
        throw new BadRequestException('첨부파일 오류 발생.');
      }
    }

    try {
      await this.boardRepository
        .createQueryBuilder('boards')
        .insert()
        .into(BoardEntity)
        .values({
          board_id: boardId,
          writer_email: data.writerEmail,
          file_id: data.fileId === '' ? null : data.fileId,
          board_type: DEFAULT_BOARD_TYPE,
          title: data.title,
          content: data.content,
        })
        .execute();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('공지 생성 실패.');
    }

    return { boardId: boardId, boardType: DEFAULT_BOARD_TYPE };
  }

  async getAllBoardListByBoardType(boardType: string): Promise<any[]> {
    const qb: BoardEntity[] = await this.boardRepository
      .createQueryBuilder('boards')
      .where('boards.board_type = :board_type', { board_type: boardType })
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      boardId: r.board_id,
      writerEmail: r.writer_email,
      fileId: r.file_id,
      boardType: r.board_type,
      title: r.title,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getContentByBoardTypeAndBoardId(boardType: string, boardId: string): Promise<any> {
    const rows = await this.boardRepository.query(
      `SELECT id,
              board_id     as boardId,
              writer_email as writerEmail,
              file_id      as fileId,
              board_type   as boardType,
              title,
              content,
              created_at   as createdAt,
              updated_at   as updatedAt
       FROM boards
       WHERE board_type = '${boardType}' AND board_id = '${boardId}'`,
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return {};
  }
}
