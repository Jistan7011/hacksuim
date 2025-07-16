import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createObjectCsvWriter } from 'csv-writer';

import { UserEntity } from './user.entity';
import { extname, join } from 'path';
import { InternalServerErrorException } from '../common/exception';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findUserByEmail(email: string): Promise<any> {
    const qb: UserEntity | null = await this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.email',
        'users.name',
        'users.phone_number',
        'users.birthday',
        'users.position',
        'users.department',
        'users.role',
        'users.created_at',
        'users.updated_at',
      ])
      .where('users.email = :email', { email: email })
      .getOne();

    return {
      id: qb?.id,
      email: qb?.email,
      name: qb?.name,
      phoneNumber: qb?.phone_number,
      birthday: qb?.birthday,
      position: qb?.position,
      department: qb?.department,
      role: qb?.role,
      createdAt: qb?.created_at,
      updatedAt: qb?.updated_at,
    };
  }

  async allUsers(sortKey: string, sorting: string, limit: string): Promise<any[]> {
    let query = 'SELECT id, name, email, phone_number as phoneNumber, birthday, position, department, role, created_at as createdAt, updated_at as updatedAt FROM users';
    if (sortKey && sorting) {
      query += ` ORDER BY ${sortKey} ${sorting}`;
    } else if (sortKey && sorting == null) {
      query += ` ORDER BY ${sortKey} ASC`;
    }

    if (limit && !isNaN(parseInt(limit))) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const rows = await this.userRepository.query(query);

    return rows;
  }

  async employeesDownloadCsv(sortKey: string, sorting: string, limit: string, originFilename: string) {
    const qbObj = this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.name',
        'users.email',
        'users.phone_number',
        'users.birthday',
        'users.position',
        'users.department',
        'users.role',
        'users.created_at',
        'users.updated_at',
      ]);

    if (limit) {
      let sanitize_limit = parseInt(limit);

      if (sanitize_limit < 1) {
        sanitize_limit = 1;
      }

      if (sanitize_limit > 100) {
        sanitize_limit = 100;
      }

      qbObj.limit(sanitize_limit);
    }

    sortKey = ['id', 'email', 'role', 'department'].includes(sortKey) ? sortKey : 'id';
    qbObj.orderBy(`users.${sortKey}`, sorting === 'DESC' ? sorting : 'ASC');

    const qb: UserEntity[] = await qbObj.getMany();

    const employees = qb.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phoneNumber: r.phone_number,
      birthday: r.birthday,
      position: r.position,
      department: r.department,
      role: r.role,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const uploadDir = this.configService.get<string>('UPLOAD_FILE_PATH');
    if (!uploadDir) {
      throw new InternalServerErrorException('서버 오류 발생.');
    }

    let filename: string = '';
    if (originFilename) {
      filename = originFilename;
    } else {
      filename = `employees-${uuidv4()}.csv`;
    }
    const filepath = join(uploadDir, filename);

    if (extname(filepath) === '.csv') {
      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'phone_number', title: 'Phone Number' },
          { id: 'birthday', title: 'Birthday' },
          { id: 'position', title: 'Position' },
          { id: 'department', title: 'Department' },
          { id: 'role', title: 'Role' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' },
        ],
      });

      await csvWriter.writeRecords(employees);

      if (!existsSync(filepath)) {
        throw new InternalServerErrorException('파일 없음');
      }
    } else {
      if (!existsSync(filepath)) {
        throw new InternalServerErrorException('파일 없음');
      }
    }

    return createReadStream(filepath);
  }
}
