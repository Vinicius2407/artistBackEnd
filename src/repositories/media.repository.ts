import { prisma } from "../infra/prisma/connection";

interface MediaProps {
  name: string;
  path: string;
  post?: string;
}

interface FindAllProps {
  search?: string;
}

class CategoriesRepository {
  async create(media: MediaProps) {
    const stored = await prisma.media.create({
      data: {
        name: media.name,
        path: media.path,
        post : {
          connect :{
            id: media.post
          }
        }
      },
    });

    return stored;
  }

  async findById(id: string) {
    const media = await prisma.media.findUnique({
      where: {
        id,
      },
    });

    return media;
  }

  async update(id: string, media: MediaProps) {
    const stored = await prisma.media.update({
      where: {
        id,
      },
      data: {
        name: media.name,
        path: media.path
      },
    });

    return stored;
  }

  async delete(id: string, media: MediaProps) {
    const stored = await prisma.media.delete({
      where: {
        id,
      }
    });

    return stored;
  }
}

export default new CategoriesRepository();