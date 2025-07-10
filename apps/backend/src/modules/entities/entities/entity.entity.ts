import { Entity as TypeOrmEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Runtime interface for the entity with deserialized JSON fields
export interface EntityData {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  status: string;
  description?: string;
  details?: Record<string, any>;
  incorporationDate?: Date;
  dissolutionDate?: Date;
  registrationNumber?: string;
  taxId?: string;
  officers?: Record<string, any>[];
  filings?: Record<string, any>[];
  compliance?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Database entity with string JSON fields for SQLite compatibility
@TypeOrmEntity('entities')
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'corporation', 'llc', 'partnership', 'subsidiary'

  @Column()
  jurisdiction: string;

  @Column()
  status: string; // 'active', 'inactive', 'dissolved', 'suspended'

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  details: string;

  @Column('date', { nullable: true })
  incorporationDate: Date;

  @Column('date', { nullable: true })
  dissolutionDate: Date;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column('text', { nullable: true })
  officers: string;

  @Column('text', { nullable: true })
  filings: string;

  @Column('text', { nullable: true })
  compliance: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
