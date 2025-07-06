import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Matter } from '../../matters/entities/matter.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['employment', 'service', 'nda', 'partnership', 'licensing', 'real_estate', 'vendor', 'other'], default: 'other' })
  type: string;

  @Column({ type: 'enum', enum: ['draft', 'review', 'negotiation', 'executed', 'expired', 'terminated'], default: 'draft' })
  status: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  value: number;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  renewalDate: Date;

  @Column({ default: false })
  autoRenewal: boolean;

  @Column({ nullable: true })
  renewalNoticeDays: number;

  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'jsonb', nullable: true })
  parties: any[];

  @Column({ type: 'jsonb', nullable: true })
  keyTerms: any;

  @Column({ type: 'jsonb', nullable: true })
  riskAssessment: any;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  documentPath: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedLawyerId' })
  assignedLawyer: User;

  @Column({ nullable: true })
  assignedLawyerId: string;

  @ManyToOne(() => Matter, { nullable: true })
  @JoinColumn({ name: 'matterId' })
  matter: Matter;

  @Column({ nullable: true })
  matterId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}