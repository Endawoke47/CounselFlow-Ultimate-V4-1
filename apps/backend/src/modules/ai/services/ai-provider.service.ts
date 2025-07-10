import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from './openai.service';
import { DeepSeekService } from './deepseek.service';

export type AIProvider = 'openai' | 'deepseek' | 'mock';

@Injectable()
export class AIProviderService {
  private readonly logger = new Logger(AIProviderService.name);
  private currentProvider: AIProvider;

  constructor(
    private configService: ConfigService,
    private openAiService: OpenAiService,
    private deepSeekService: DeepSeekService,
  ) {
    this.currentProvider = this.configService.get<AIProvider>('AI_PROVIDER') || 'mock';
    this.logger.log(`🤖 AI Provider Service initialized with provider: ${this.currentProvider}`);
  }

  async chat(message: string, context?: string, conversationHistory?: any[]): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.chat(message, context, conversationHistory);
        case 'deepseek':
          return await this.deepSeekService.chat(message, context, conversationHistory);
        default:
          return await this.openAiService.chat(message, context, conversationHistory); // Fallback to mock
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      // Fallback to OpenAI service (which has mock fallback)
      return await this.openAiService.chat(message, context, conversationHistory);
    }
  }

  async summarize(text: string): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.summarize(text);
        case 'deepseek':
          return await this.deepSeekService.summarize(text);
        default:
          return await this.openAiService.summarize(text);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.summarize(text);
    }
  }

  async extractKeyTerms(text: string): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.extractKeyTerms(text);
        case 'deepseek':
          return await this.deepSeekService.extractKeyTerms(text);
        default:
          return await this.openAiService.extractKeyTerms(text);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.extractKeyTerms(text);
    }
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general'): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.assessRisk(content, type);
        case 'deepseek':
          return await this.deepSeekService.assessRisk(content, type);
        default:
          return await this.openAiService.assessRisk(content, type);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.assessRisk(content, type);
    }
  }

  async analyzeContract(contractText: string, contractType?: string): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.analyzeContract(contractText, contractType);
        case 'deepseek':
          return await this.deepSeekService.analyzeContract(contractText, contractType);
        default:
          return await this.openAiService.analyzeContract(contractText, contractType);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.analyzeContract(contractText, contractType);
    }
  }

  async generateDocument(documentType: string, parameters: any): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.generateDocument(documentType, parameters);
        case 'deepseek':
          return await this.deepSeekService.generateDocument(documentType, parameters);
        default:
          return await this.openAiService.generateDocument(documentType, parameters);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.generateDocument(documentType, parameters);
    }
  }

  async generateInsights(data: any, type: 'dashboard' | 'matter' | 'contract'): Promise<any> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          return await this.openAiService.generateInsights(data, type);
        case 'deepseek':
          // DeepSeek doesn't have generateInsights, fallback to OpenAI
          return await this.openAiService.generateInsights(data, type);
        default:
          return await this.openAiService.generateInsights(data, type);
      }
    } catch (error) {
      this.logger.error(`Error with ${this.currentProvider} provider:`, error.message);
      return await this.openAiService.generateInsights(data, type);
    }
  }

  getCurrentProvider(): AIProvider {
    return this.currentProvider;
  }

  async switchProvider(provider: AIProvider): Promise<void> {
    this.currentProvider = provider;
    this.logger.log(`🔄 Switched AI provider to: ${provider}`);
  }

  async getProviderStatus(): Promise<any> {
    return {
      currentProvider: this.currentProvider,
      available: {
        openai: !!this.configService.get<string>('OPENAI_API_KEY'),
        deepseek: !!this.configService.get<string>('DEEPSEEK_API_KEY'),
        mock: true
      },
      models: {
        openai: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o',
        deepseek: this.configService.get<string>('DEEPSEEK_MODEL') || 'deepseek-chat'
      }
    };
  }
}
