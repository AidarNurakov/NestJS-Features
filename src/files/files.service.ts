import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import File from './file.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File) private readonly filesRepository: Repository<File>,
        private readonly configService: ConfigService
    ) { }

    async uploadFile(dataBuffer: Buffer, filename: string) {
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        })
            .promise();

        const newFile = this.filesRepository.create({
            key: uploadResult.Key,
            url: uploadResult.Location
        })
        await this.filesRepository.save(newFile);
        return newFile;
    }

    async deleteFile(fileId: number) {
        const file = await this.filesRepository.findOneBy({ id: fileId })
        const s3 = new S3();
        await s3.deleteObject({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: file.key,
        }).promise();
        await this.filesRepository.delete(fileId)
    }
}
