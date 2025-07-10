import { Injectable } from '@nestjs/common';
import { AIProviderService } from './services/ai-provider.service';
import { LegalResearchService } from './services/legal-research.service';
import { ContractAnalysisService } from './services/contract-analysis.service';
import { DocumentGenerationService } from './services/document-generation.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { LegalResearchDto } from './dto/legal-research.dto';
import { ContractAnalysisDto } from './dto/contract-analysis.dto';
import { DocumentGenerationDto } from './dto/document-generation.dto';

@Injectable()
export class AiService {
  constructor(
    private aiProviderService: AIProviderService,
    private legalResearchService: LegalResearchService,
    private contractAnalysisService: ContractAnalysisService,
    private documentGenerationService: DocumentGenerationService,
  ) {}

  async chat(chatMessageDto: ChatMessageDto) {
    const response = await this.aiProviderService.chat(
      chatMessageDto.message, 
      chatMessageDto.context
    );
    return {
      message: response.message || response.response,
      assistantName: response.assistantName || 'Flow',
      provider: response.provider,
      model: response.model,
      timestamp: response.timestamp,
      usage: response.usage
    };
  }

  async legalResearch(legalResearchDto: LegalResearchDto) {
    return this.legalResearchService.research(legalResearchDto);
  }

  async analyzeContract(contractAnalysisDto: ContractAnalysisDto) {
    // Use AI provider for enhanced contract analysis
    const aiResponse = await this.aiProviderService.analyzeContract(
      contractAnalysisDto.contractText,
      contractAnalysisDto.contractType
    );
    
    // Combine with specialized contract analysis service
    const detailedAnalysis = await this.contractAnalysisService.analyze(contractAnalysisDto);
    
    return {
      ...detailedAnalysis,
      aiAnalysis: aiResponse.message,
      provider: aiResponse.provider,
      timestamp: aiResponse.timestamp
    };
  }

  async generateDocument(documentGenerationDto: DocumentGenerationDto) {
    return this.aiProviderService.generateDocument(
      documentGenerationDto.documentType,
      documentGenerationDto.parameters
    );
  }

  async summarizeText(text: string) {
    return this.aiProviderService.summarize(text);
  }

  async extractKeyTerms(text: string) {
    return this.aiProviderService.extractKeyTerms(text);
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general') {
    return this.aiProviderService.assessRisk(content, type);
  }

  async generateInsights(data: any, type: 'dashboard' | 'matter' | 'contract') {
    return this.aiProviderService.generateInsights(data, type);
  }

  async getProviderStatus() {
    return this.aiProviderService.getProviderStatus();
  }

  async switchProvider(provider: 'openai' | 'deepseek' | 'mock') {
    return this.aiProviderService.switchProvider(provider);
  }
}