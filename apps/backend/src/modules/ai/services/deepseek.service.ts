import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DeepSeekService {
  private readonly logger = new Logger(DeepSeekService.name);
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    this.baseUrl = this.configService.get<string>('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com';
    this.model = this.configService.get<string>('DEEPSEEK_MODEL') || 'deepseek-chat';
    
    if (this.apiKey) {
      this.logger.log(`✅ DeepSeek service initialized with model: ${this.model}`);
    } else {
      this.logger.warn('⚠️  DeepSeek API key not provided');
    }
  }

  async chat(message: string, context?: string, conversationHistory?: any[]): Promise<any> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const messages = [
        {
          role: 'system',
          content: `You are Flow, an advanced AI legal assistant specializing in legal research, contract analysis, document drafting, and providing strategic legal guidance. You are knowledgeable, professional, and helpful. Always provide accurate, well-reasoned legal insights while noting when users should consult with qualified attorneys for specific legal advice.`
        }
      ];

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        messages.push(...conversationHistory);
      }

      // Add context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `Additional context: ${context}`
        });
      }

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: this.model,
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        message: response.data.choices[0].message.content,
        provider: 'deepseek',
        model: this.model,
        timestamp: new Date().toISOString(),
        assistantName: 'Flow',
        usage: response.data.usage
      };
    } catch (error) {
      this.logger.error('DeepSeek API error:', error.response?.data || error.message);
      throw new Error('Failed to get response from DeepSeek');
    }
  }

  async summarize(text: string): Promise<any> {
    const prompt = `Please provide a concise summary of the following legal document or text, highlighting key points, important clauses, and potential areas of concern:\n\n${text}`;
    return this.chat(prompt);
  }

  async extractKeyTerms(text: string): Promise<any> {
    const prompt = `Analyze the following legal text and extract key terms, important clauses, deadlines, parties involved, and any critical legal concepts:\n\n${text}`;
    return this.chat(prompt);
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general'): Promise<any> {
    const prompt = `As a legal AI assistant, please assess the potential risks in the following ${type}. Identify high, medium, and low-risk areas, provide recommendations for mitigation, and highlight any red flags:\n\n${content}`;
    return this.chat(prompt);
  }

  async analyzeContract(contractText: string, contractType?: string): Promise<any> {
    const prompt = `Please analyze this ${contractType || 'legal contract'} and provide:
1. Summary of key terms and obligations
2. Potential risks and concerns
3. Missing or unclear clauses
4. Recommendations for improvement
5. Compliance considerations

Contract text:
${contractText}`;
    return this.chat(prompt);
  }

  async generateDocument(documentType: string, parameters: any): Promise<any> {
    const prompt = `Generate a professional ${documentType} with the following parameters: ${JSON.stringify(parameters)}. Please ensure the document is legally sound, professional, and includes all necessary clauses and provisions.`;
    return this.chat(prompt);
  }
}
