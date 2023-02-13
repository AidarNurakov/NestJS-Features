import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly filesService: FilesService
    ) { }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOneBy({ email })
        if (user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async create(userData: CreateUserDto) {
        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async findAll() {
        return this.usersRepository.find()
    }

    async getById(id: number) {
        const user = await this.usersRepository.findOneBy({ id });
        if (user) {
            return user
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
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

    async deleteAvatar(userId: number) {
        const user = await this.getById(userId);
        const fileId = user.avatar?.id;
        if(fileId) {
            await this.usersRepository.update(userId, {
                avatar: null
            });
            await this.filesService.deleteFile(fileId)
        }
    }
}
