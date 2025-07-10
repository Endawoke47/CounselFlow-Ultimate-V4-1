import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  category: string; // 'HR', 'IT', 'Legal', 'Compliance', 'Operations'

  @Column()
  type: string; // 'policy', 'procedure', 'guideline'

  @Column()
  status: string; // 'draft', 'active', 'archived', 'under_review'

  @Column('text')
  content: string;

  @Column()
  version: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  owner: string;

  @Column('text', { nullable: true })
  approvers: string;

  @Column('date', { nullable: true })
  effectiveDate: Date;

  @Column('date', { nullable: true })
  reviewDate: Date;

  @Column('date', { nullable: true })
  expirationDate: Date;

  @Column('text', { nullable: true })
  tags: string;

  @Column('text', { nullable: true })
  relatedPolicies: string;

  @Column('text', { nullable: true })
  attachments: string;

  @Column('text', { nullable: true })
  changeLog: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
