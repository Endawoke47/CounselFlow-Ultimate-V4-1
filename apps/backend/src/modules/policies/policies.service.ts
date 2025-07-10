import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesService {
  create(createPolicyDto: any) {
    return 'This action adds a new policy';
  }

  findAll() {
    return `This action returns all policies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} policy`;
  }

  update(id: number, updatePolicyDto: any) {
    return `This action updates a #${id} policy`;
  }

  remove(id: number) {
    return `This action removes a #${id} policy`;
  }
}
