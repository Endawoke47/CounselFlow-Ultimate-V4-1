import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    } else {
      this.logger.warn('OpenAI API key not found. AI features will use mock responses.');
    }
  }

  async chat(message: string, context?: string): Promise<any> {
    if (!this.openai) {
      return this.getMockChatResponse(message);
    }

    try {
      const systemPrompt = `You are a highly knowledgeable legal AI assistant specializing in law practice management. 
      You provide accurate, helpful advice on legal matters, contract analysis, risk assessment, and law firm operations.
      Always maintain professional tone and include relevant legal disclaimers when appropriate.
      ${context ? `Context: ${context}` : ''}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        response: completion.choices[0].message.content,
        usage: completion.usage,
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      return this.getMockChatResponse(message);
    }
  }

  async summarize(text: string): Promise<any> {
    if (!this.openai) {
      return this.getMockSummary(text);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document summarization expert. Provide concise, accurate summaries of legal texts, highlighting key points, obligations, and important terms.'
          },
          {
            role: 'user',
            content: `Please summarize the following legal text:\n\n${text}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return {
        summary: completion.choices[0].message.content,
        originalLength: text.length,
        summaryLength: completion.choices[0].message.content?.length || 0,
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('OpenAI summarization error:', error);
      return this.getMockSummary(text);
    }
  }

  async extractKeyTerms(text: string): Promise<any> {
    if (!this.openai) {
      return this.getMockKeyTerms();
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document analysis expert. Extract and categorize key terms, obligations, dates, parties, and important clauses from legal documents. Return the results in a structured JSON format.'
          },
          {
            role: 'user',
            content: `Extract key terms from this legal text:\n\n${text}`
          }
        ],
        max_tokens: 800,
        temperature: 0.2,
      });

      return {
        keyTerms: completion.choices[0].message.content,
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('OpenAI key terms extraction error:', error);
      return this.getMockKeyTerms();
    }
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general'): Promise<any> {
    if (!this.openai) {
      return this.getMockRiskAssessment(type);
    }

    try {
      const systemPrompts = {
        contract: 'You are a contract risk assessment specialist. Analyze contracts for potential risks, unfavorable terms, and compliance issues.',
        matter: 'You are a legal matter risk analyst. Assess litigation risks, potential outcomes, and strategic considerations.',
        general: 'You are a general legal risk consultant. Identify potential legal risks and compliance issues.'
      };

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompts[type] + ' Provide a detailed risk assessment with severity levels and recommendations.'
          },
          {
            role: 'user',
            content: `Assess the legal risks in the following content:\n\n${content}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      return {
        riskAssessment: completion.choices[0].message.content,
        type: type,
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('OpenAI risk assessment error:', error);
      return this.getMockRiskAssessment(type);
    }
  }

  async generateInsights(data: any, type: 'dashboard' | 'matter' | 'contract'): Promise<any> {
    if (!this.openai) {
      return this.getMockInsights(type);
    }

    try {
      const systemPrompts = {
        dashboard: 'You are a legal practice analytics expert. Generate actionable insights from law firm dashboard data.',
        matter: 'You are a legal matter strategist. Provide strategic insights and recommendations for legal matters.',
        contract: 'You are a contract optimization specialist. Generate insights for contract improvement and risk mitigation.'
      };

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompts[type] + ' Provide specific, actionable insights based on the provided data.'
          },
          {
            role: 'user',
            content: `Generate insights from this data:\n\n${JSON.stringify(data, null, 2)}`
          }
        ],
        max_tokens: 800,
        temperature: 0.4,
      });

      return {
        insights: completion.choices[0].message.content,
        type: type,
        model: 'gpt-4',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('OpenAI insights generation error:', error);
      return this.getMockInsights(type);
    }
  }

  // Mock responses when OpenAI is not available
  private getMockChatResponse(message: string) {
    const responses = {
      contract: 'I can help you analyze this contract. Based on the information provided, I recommend reviewing the termination clauses and liability limitations. Would you like me to examine any specific sections?',
      research: 'For legal research on this topic, I suggest looking into recent case law in your jurisdiction. Key precedents to consider include relevant court decisions and statutory updates in this area.',
      compliance: 'Regarding compliance matters, I recommend conducting a thorough review of current regulations and establishing proper documentation procedures to ensure ongoing compliance.',
      default: 'I understand you need legal assistance. As your AI legal assistant, I can help with contract analysis, legal research, compliance questions, and case strategy. What specific area would you like to explore?'
    };

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('contract')) return { response: responses.contract, model: 'mock', timestamp: new Date().toISOString() };
    if (lowerMessage.includes('research')) return { response: responses.research, model: 'mock', timestamp: new Date().toISOString() };
    if (lowerMessage.includes('compliance')) return { response: responses.compliance, model: 'mock', timestamp: new Date().toISOString() };
    
    return { response: responses.default, model: 'mock', timestamp: new Date().toISOString() };
  }

  private getMockSummary(text: string) {
    return {
      summary: 'This document contains important legal provisions including party obligations, termination conditions, and liability limitations. Key dates and renewal terms are specified throughout the document.',
      originalLength: text.length,
      summaryLength: 150,
      model: 'mock',
      timestamp: new Date().toISOString(),
    };
  }

  private getMockKeyTerms() {
    return {
      keyTerms: JSON.stringify({
        parties: ['Company ABC', 'Service Provider XYZ'],
        keyDates: ['2024-01-01', '2025-01-01'],
        obligations: ['Provide services', 'Make payments', 'Maintain confidentiality'],
        terms: ['Termination clause', 'Liability limitation', 'Governing law'],
        riskFactors: ['Unlimited liability', 'Automatic renewal', 'Broad termination rights']
      }),
      model: 'mock',
      timestamp: new Date().toISOString(),
    };
  }

  private getMockRiskAssessment(type: string) {
    const assessments = {
      contract: 'Risk Level: MEDIUM. Key concerns include broad termination clauses and limited liability protection. Recommend negotiating more balanced terms.',
      matter: 'Risk Level: HIGH. Complex litigation with significant financial exposure. Recommend early settlement discussions and comprehensive discovery strategy.',
      general: 'Risk Level: LOW. Standard business operations with minimal legal exposure. Maintain current compliance procedures.'
    };

    return {
      riskAssessment: assessments[type] || assessments.general,
      type: type,
      model: 'mock',
      timestamp: new Date().toISOString(),
    };
  }

  private getMockInsights(type: string) {
    const insights = {
      dashboard: 'Your practice shows strong performance with 85% client satisfaction. Consider focusing on contract automation to improve efficiency and reduce manual review time.',
      matter: 'This matter shows high complexity with multiple stakeholders. Recommend establishing clear communication protocols and regular status updates to all parties.',
      contract: 'This contract type shows recurring risk patterns. Consider creating standardized templates to address common issues and improve negotiation outcomes.'
    };

    return {
      insights: insights[type] || insights.dashboard,
      type: type,
      model: 'mock',
      timestamp: new Date().toISOString(),
    };
  }
}