import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenAiService } from './services/openai.service';
import { DeepSeekService } from './services/deepseek.service';
import { AIProviderService } from './services/ai-provider.service';
import { LegalResearchService } from './services/legal-research.service';
import { ContractAnalysisService } from './services/contract-analysis.service';
import { DocumentGenerationService } from './services/document-generation.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    OpenAiService,
    DeepSeekService,
    AIProviderService,
    LegalResearchService,
    ContractAnalysisService,
    DocumentGenerationService,
  ],
  controllers: [AiController],
  exports: [AiService, AIProviderService],
})
export class AiModule {}