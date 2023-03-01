import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from './category.entity';
import UpdateCategoryDto from './dto/updateCategory.dto';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>) { }

    public getAllCategories() {
        return this.categoriesRepository.find({ relations: ['posts'] })
    }

    public async getCategoryById(id: number) {
        const category = await this.categoriesRepository.findOne({ where: { id }, relations: ['posts'] });
        if (category) {
            return category;
        }
        throw new CategoryNotFoundException(id);
    }

    public async updateCategory(id: number, category: UpdateCategoryDto) {
        await this.categoriesRepository.update(id, category);
        const updatedCategory = await this.categoriesRepository.findOne({ where: { id }, relations: ['posts'] });
        if (updatedCategory) {
            return updatedCategory
        }
        throw new CategoryNotFoundException(id);
    }
}
