import { Injectable } from '@nestjs/common';

@Injectable()
export class KnowledgeService {
  create(createKnowledgeDto: any) {
    return 'This action adds a new knowledge item';
  }

  findAll() {
    return `This action returns all knowledge items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} knowledge item`;
  }

  update(id: number, updateKnowledgeDto: any) {
    return `This action updates a #${id} knowledge item`;
  }

  remove(id: number) {
    return `This action removes a #${id} knowledge item`;
  }
}
