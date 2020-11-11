import {
  EntityRepository,
  Repository,
  getRepository,
  DeepPartial,
} from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async createIfNotExist<T>(
    field: string,
    value: string | number | Date,
    entity: DeepPartial<Category>,
  ): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const oldCategory = await categoriesRepository
      .createQueryBuilder('categories')
      .where(`categories.${field} = :value`, { value })
      .cache(false)
      .getOne();

    if (!oldCategory) {
      const newCategory = categoriesRepository.create(entity);
      await categoriesRepository.save(newCategory);
      return newCategory;
    }

    return oldCategory;
  }
}

export default CategoriesRepository;
