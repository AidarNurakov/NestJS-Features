import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import File from './file.entity';
import { FilesService } from './files.service';
import PrivateFile from './privateFiles.entity';
import { PrivateFilesService } from './privateFiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, PrivateFile]),
    ConfigModule
  ],
  providers: [FilesService, PrivateFilesService],
  exports: [FilesService, PrivateFilesService]
})
export class FilesModule { }
