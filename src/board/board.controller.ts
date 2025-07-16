import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

import { BoardService } from './board.service';

import { ReqViewNoticeDto } from './dto/req/req.view-notice.dto';
import { ReqViewBoardDto } from './dto/req/req.view-board.dto';
import { ResViewNoticeDto } from './dto/res/res.view-notice.dto';
import { ResViewBoardDto } from './dto/res/res.view-board.dto';
import { ReqWriteNoticeDto } from './dto/req/req.write-notice.dto';
import { ReqWriteBoardDto } from './dto/req/req.write-board.dto';
import { ResWriteBoardDto } from './dto/res/res.write-board.dto';
import { ResWriteNoticeDto } from './dto/res/res.write-notice.dto';
import { ResListNoticeDto } from './dto/res/res.list-notice.dto';
import { ResListBoardDto } from './dto/res/res.list-board.dto';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('general')
  @ApiOperation({ summary: '게시글 작성' })
  @ApiBody({ type: ReqWriteBoardDto })
  @ApiResponse({ status: 200, description: '게시글 작성 성공', type: ResWriteBoardDto })
  @ApiResponse({ status: 400, description: '게시글 작성 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async createBoard(@Req() req, @Body() body: ReqWriteBoardDto): Promise<ResWriteBoardDto> {
    return this.boardService.createBoard(req.user.email, body);
  }

  @Get('general/view')
  @ApiOperation({ summary: '게시글 리스트' })
  @ApiResponse({ status: 200, description: '게시글 리스트 불러오기 성공', type: ResListBoardDto, isArray: true })
  @ApiResponse({ status: 404, description: '게시글 리스트 불러오기 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async viewBoard(): Promise<ResListBoardDto[]> {
    return await this.boardService.getAllBoardListByBoardType('general');
  }

  @Get('general/view/:boardId')
  @ApiOperation({ summary: '게시글 읽기' })
  @ApiResponse({ status: 200, description: '게시글 읽기 성공', type: ResViewNoticeDto })
  @ApiResponse({ status: 404, description: '게시글 읽기 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'boardId',
    description: '',
    required: true,
    type: 'string',
  })
  async viewContentInBoard(@Param() param: ReqViewBoardDto): Promise<ResViewNoticeDto> {
    return await this.boardService.getContentByBoardTypeAndBoardId('general', param.boardId);
  }

  @Post('notice')
  @ApiOperation({ summary: '공지 게시글 작성' })
  @ApiBody({ type: ReqWriteNoticeDto })
  @ApiResponse({ status: 200, description: '공지 게시글 작성 성공', type: ResWriteNoticeDto })
  @ApiResponse({ status: 400, description: '공지 게시글 작성 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async createNotice(@Body() body: ReqWriteNoticeDto): Promise<ResWriteNoticeDto> {
    return this.boardService.createNotice(body);
  }

  @Get('notice/view')
  @ApiOperation({ summary: '공지 게시글 리스트' })
  @ApiResponse({ status: 200, description: '공지 게시글 리스트 불러오기 성공', type: ResListNoticeDto, isArray: true })
  @ApiResponse({ status: 404, description: '공지 게시글 리스트 불러오기 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async viewNoticeBoard(): Promise<ResListNoticeDto[]> {
    return await this.boardService.getAllBoardListByBoardType('notice');
  }

  @Get('notice/view/:boardId')
  @ApiOperation({ summary: '공지 게시글 읽기' })
  @ApiResponse({ status: 200, description: '공지 게시글 읽기 성공', type: ResViewBoardDto })
  @ApiResponse({ status: 404, description: '공지 게시글 읽기 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'boardId',
    description: '',
    required: true,
    type: 'string',
  })
  async viewContentInNoticeBoard(@Param() param: ReqViewNoticeDto): Promise<ResViewBoardDto> {
    return await this.boardService.getContentByBoardTypeAndBoardId('notice', param.boardId);
  }
}
