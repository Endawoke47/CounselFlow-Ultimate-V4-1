import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity, EntityData } from './entities/entity.entity';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(Entity)
    private readonly entityRepository: Repository<Entity>,
  ) {}

  async create(createEntityDto: CreateEntityDto): Promise<EntityData> {
    // Serialize JSON fields to strings for SQLite compatibility
    const entityData = {
      ...createEntityDto,
      details: createEntityDto.details ? JSON.stringify(createEntityDto.details) : null,
      officers: createEntityDto.officers ? JSON.stringify(createEntityDto.officers) : null,
      filings: createEntityDto.filings ? JSON.stringify(createEntityDto.filings) : null,
      compliance: createEntityDto.compliance ? JSON.stringify(createEntityDto.compliance) : null,
    };
    
    const entity = this.entityRepository.create(entityData);
    const savedEntity = await this.entityRepository.save(entity);
    return this.deserializeEntity(savedEntity);
  }

  async findAll(): Promise<EntityData[]> {
    const entities = await this.entityRepository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.deserializeEntity(entity));
  }

  async findOne(id: string): Promise<EntityData> {
    const entity = await this.entityRepository.findOne({ where: { id } });
    return entity ? this.deserializeEntity(entity) : null;
  }

  async update(id: string, updateEntityDto: UpdateEntityDto): Promise<EntityData> {
    // Serialize JSON fields to strings for SQLite compatibility
    const updateData = {
      ...updateEntityDto,
      details: updateEntityDto.details ? JSON.stringify(updateEntityDto.details) : undefined,
      officers: updateEntityDto.officers ? JSON.stringify(updateEntityDto.officers) : undefined,
      filings: updateEntityDto.filings ? JSON.stringify(updateEntityDto.filings) : undefined,
      compliance: updateEntityDto.compliance ? JSON.stringify(updateEntityDto.compliance) : undefined,
    };
    
    await this.entityRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.entityRepository.delete(id);
  }

  async findByType(type: string): Promise<EntityData[]> {
    const entities = await this.entityRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.deserializeEntity(entity));
  }

  async findByJurisdiction(jurisdiction: string): Promise<Entity[]> {
    return this.entityRepository.find({
      where: { jurisdiction },
      order: { createdAt: 'DESC' },
    });
  }

  private deserializeEntity(entity: Entity): EntityData {
    if (!entity) return entity as any;
    
    return {
      ...entity,
      details: entity.details ? JSON.parse(entity.details) : null,
      officers: entity.officers ? JSON.parse(entity.officers) : null,
      filings: entity.filings ? JSON.parse(entity.filings) : null,
      compliance: entity.compliance ? JSON.parse(entity.compliance) : null,
    } as EntityData;
  }
}
