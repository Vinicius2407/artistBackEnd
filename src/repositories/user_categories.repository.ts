import { prisma } from "../infra/prisma/connection";

interface UserCategoryProps {
  user: string;
  category: string;
}

class UserCategoriesRepository {
  async create(user_category: UserCategoryProps) {
    const stored = await prisma.user_Category.create({
      data: {
        userId: user_category.user,
        categoryId: user_category.category
      },
    });

    return stored;
  }
 
}

export default new UserCategoriesRepository();
