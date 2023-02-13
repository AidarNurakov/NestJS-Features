import { Controller, Get, Post, Req, UploadedFile, Param, UseInterceptors, UseGuards, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard';
import RequestWithUser from 'src/authentication/requestWithUset.interface';
import { UsersService } from './users.service';
import { Express, Response } from 'express';
import FindOneParams from 'src/utils/findOneParams';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll()
    }

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }

    @Post('files')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
    }

    @Get('files/:id')
    @UseGuards(JwtAuthenticationGuard)
    async getPrivateFile(
        @Req() request: RequestWithUser,
        @Param() { id }: FindOneParams,
        @Res() res: Response
    ) {
        const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
        file.stream.pipe(res);
    }

    @Get('files')
    @UseGuards(JwtAuthenticationGuard)
    async getAllPrivateFiles(@Req() request: RequestWithUser) {
        return this.usersService.getAllPrivateFiles(request.user.id);
    }
}
