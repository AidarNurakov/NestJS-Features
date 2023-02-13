import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from 'src/files/privateFiles.service';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly filesService: FilesService,
        private readonly privateFilesService: PrivateFilesService
    ) { }

    public async getByEmail(email: string) {
        const user = await this.usersRepository.findOneBy({ email })
        if (user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    public async create(userData: CreateUserDto) {
        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }

    public async findAll() {
        return this.usersRepository.find()
    }

    public async getById(id: number) {
        const user = await this.usersRepository.findOneBy({ id });
        if (user) {
            return user
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    public async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
        const user = await this.getById(userId);
        if (user.avatar) {
            await this.usersRepository.update(userId, {
                ...user,
                avatar: null
            })
            await this.filesService.deleteFile(user.avatar.id);
        }
        const avatar = await this.filesService.uploadFile(imageBuffer, filename);
        await this.usersRepository.update(userId, {
            ...user,
            avatar
        })
        return avatar;
    }

    public async deleteAvatar(userId: number) {
        const user = await this.getById(userId);
        const fileId = user.avatar?.id;
        if (fileId) {
            await this.usersRepository.update(userId, {
                avatar: null
            });
            await this.filesService.deleteFile(fileId)
        }
    }

    public async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
        return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
    }

    public async getPrivateFile(userId: number, fileId: number) {
        const file = await this.privateFilesService.getPrivateFile(fileId);
        if (file.info.owner.id === userId) {
            return file;
        }
        throw new UnauthorizedException();
    }

    public async getAllPrivateFiles(userId: number) {
        const userWithFiles = await this.usersRepository.findOne({
            where: { id: userId }, relations: ['files']
        });
        if (userWithFiles) {
            return Promise.all(
                userWithFiles.files.map(async (file) => {
                    const url = await this.privateFilesService.generatePresignedUrl(file.key);
                    return {
                        ...file,
                        url
                    }
                })
            )
        }
        throw new NotFoundException('User with this id does not exist');
    }
}
