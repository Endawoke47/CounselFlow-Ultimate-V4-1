import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  create(@Body() createKnowledgeDto: any) {
    return this.knowledgeService.create(createKnowledgeDto);
  }

  @Get()
  findAll() {
    return this.knowledgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKnowledgeDto: any) {
    return this.knowledgeService.update(+id, updateKnowledgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeService.remove(+id);
  }
}
