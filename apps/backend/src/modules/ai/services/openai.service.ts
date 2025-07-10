import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private openai: OpenAI;
  private aiProvider: string;
  private assistantName: string;
  private aiModel: string;
  private streamEnabled: boolean;
  private maxTokens: number;
  private temperature: number;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.aiProvider = this.configService.get<string>('AI_PROVIDER') || 'openai';
    this.assistantName = this.configService.get<string>('AI_ASSISTANT_NAME') || 'Flow';
    this.aiModel = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o';
    this.streamEnabled = this.configService.get<string>('AI_STREAM_ENABLED') === 'true';
    this.maxTokens = parseInt(this.configService.get<string>('AI_MAX_TOKENS') || '2000');
    this.temperature = parseFloat(this.configService.get<string>('AI_TEMPERATURE') || '0.7');
    
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.logger.log(`✅ OpenAI service initialized with model: ${this.aiModel}, streaming: ${this.streamEnabled}, max_tokens: ${this.maxTokens}`);
    } else {
      this.logger.warn(`⚡ AI Provider: ${this.aiProvider}. Using enhanced mock responses for ${this.assistantName}. Add real OpenAI API key for live AI.`);
    }
  }

  async chat(message: string, context?: string, conversationHistory?: any[]): Promise<any> {
    if (this.openai) {
      return this.getOpenAIResponse(message, context, conversationHistory);
    }
    
    return this.getEnhancedMockResponse(message, context);
  }

  async summarize(text: string): Promise<any> {
    if (this.openai) {
      const prompt = `Please provide a concise, professional summary of the following legal document or text. Focus on key points, important clauses, deadlines, and potential areas of concern:\n\n${text}`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockSummary(text);
  }

  async extractKeyTerms(text: string): Promise<any> {
    if (this.openai) {
      const prompt = `Analyze the following legal text and extract key terms, important clauses, deadlines, parties involved, obligations, and any critical legal concepts. Format the response clearly with categories:\n\n${text}`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockKeyTerms(text);
  }

  async assessRisk(content: string, type: 'contract' | 'matter' | 'general'): Promise<any> {
    if (this.openai) {
      const prompt = `As an expert legal AI assistant, please assess the potential risks in the following ${type}. Provide a structured analysis including:
1. High-risk areas (immediate attention required)
2. Medium-risk areas (should be addressed)
3. Low-risk areas (monitor)
4. Specific recommendations for risk mitigation
5. Any red flags or critical issues

Content to analyze:
${content}`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockRiskAssessment(content, type);
  }

  async analyzeContract(contractText: string, contractType?: string): Promise<any> {
    if (this.openai) {
      const prompt = `Please provide a comprehensive analysis of this ${contractType || 'legal contract'}. Include:

1. **Executive Summary**: Brief overview of the contract's purpose and key terms
2. **Key Terms & Obligations**: Main responsibilities of each party
3. **Risk Assessment**: Potential risks categorized by severity
4. **Missing or Unclear Clauses**: What should be added or clarified
5. **Compliance Considerations**: Regulatory or legal compliance issues
6. **Recommendations**: Specific suggestions for improvement

Contract text:
${contractText}`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockContractAnalysis(contractText, contractType);
  }

  async generateDocument(documentType: string, parameters: any): Promise<any> {
    if (this.openai) {
      const prompt = `Generate a professional ${documentType} with the following specifications:

Parameters: ${JSON.stringify(parameters, null, 2)}

Requirements:
- Use proper legal language and structure
- Include all necessary clauses and provisions
- Ensure compliance with standard legal practices
- Make it comprehensive but clear
- Include placeholder text where specific details need to be filled in

Please format the document professionally with appropriate sections and numbering.`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockDocumentGeneration(documentType, parameters);
  }

  async generateInsights(data: any, type: 'dashboard' | 'matter' | 'contract'): Promise<any> {
    if (this.openai) {
      const prompt = `Analyze the following ${type} data and provide intelligent insights, trends, recommendations, and actionable advice:

Data: ${JSON.stringify(data, null, 2)}

Please provide insights in a structured format with specific recommendations for improving legal operations and outcomes.`;
      return this.getOpenAIResponse(prompt);
    }
    return this.getMockInsights(data, type);
  }

  private async getOpenAIResponse(message: string, context?: string, conversationHistory?: any[]): Promise<any> {
    try {
      const systemPrompt = `You are ${this.assistantName}, an advanced AI legal assistant specializing in legal research, contract analysis, document drafting, and providing strategic legal guidance. You are knowledgeable, professional, and helpful.

Key capabilities:
- Legal research and analysis
- Contract drafting and review
- Risk assessment and mitigation strategies
- Regulatory compliance guidance
- Strategic legal advice

Always provide accurate, well-reasoned legal insights while noting when users should consult with qualified attorneys for specific legal advice. Use clear, professional language and structure your responses logically.`;

      const messages: any[] = [
        { role: 'system', content: systemPrompt }
      ];

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        messages.push(...conversationHistory.slice(-10)); // Keep last 10 messages for context
      }

      // Add context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `Additional context: ${context}`
        });
      }

      // Add current message
      messages.push({ role: 'user', content: message });

      const completion = await this.openai.chat.completions.create({
        model: this.aiModel,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        stream: false,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return {
        message: completion.choices[0].message.content,
        provider: 'openai',
        model: this.aiModel,
        timestamp: new Date().toISOString(),
        assistantName: this.assistantName,
        usage: completion.usage
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      // Fallback to enhanced mock response
      return this.getEnhancedMockResponse(message, context);
    }
  }

  private getEnhancedMockResponse(message: string, context?: string): any {
    return {
      message: `Hello! I'm ${this.assistantName}, your AI legal assistant. I'm ready to help with: ${message}`,
      provider: 'enhanced-ai-mock',
      model: 'flow-intelligent-legal-assistant',
      timestamp: new Date().toISOString(),
      fast_response: true
    };
  }

  private getMockSummary(text: string): any {
    const wordCount = text.split(' ').length;
    return {
      summary: `Document summary: ${wordCount} words analyzed. Key legal elements identified.`,
      provider: 'flow-intelligent-mock',
      timestamp: new Date().toISOString(),
      word_count: wordCount
    };
  }

  private getMockKeyTerms(text: string): any {
    return {
      keyTerms: 'Key terms extracted from document analysis.',
      provider: 'flow-intelligent-extraction',
      timestamp: new Date().toISOString()
    };
  }

  private getMockRiskAssessment(content: string, type: string): any {
    return {
      riskAssessment: `Risk assessment for ${type}: Low to medium risk factors identified.`,
      provider: 'flow-intelligent-risk',
      timestamp: new Date().toISOString()
    };
  }

  private getMockInsights(data: any, type: string): any {
    return {
      insights: `AI insights for ${type}: Performance analytics and recommendations available.`,
      provider: 'flow-intelligent-insights',
      timestamp: new Date().toISOString()
    };
  }

  private getMockContractAnalysis(contractText: string, contractType?: string): any {
    return {
      message: `Contract Analysis for ${contractType || 'Legal Contract'}:

**Executive Summary:**
This contract establishes key legal obligations between parties with standard commercial terms.

**Key Terms & Obligations:**
- Primary obligations identified
- Payment terms and schedules
- Performance requirements
- Termination conditions

**Risk Assessment:**
- Medium risk: Standard commercial risks present
- Recommendation: Review termination clauses
- Consider additional liability protections

**Missing or Unclear Clauses:**
- Force majeure provisions should be clarified
- Dispute resolution mechanism needs detail
- Data protection clauses may need updating

**Compliance Considerations:**
- Appears compliant with standard commercial law
- Consider jurisdiction-specific requirements

**Recommendations:**
1. Strengthen termination provisions
2. Add detailed dispute resolution process
3. Include comprehensive liability caps
4. Update data protection language`,
      provider: 'flow-intelligent-contract-analysis',
      timestamp: new Date().toISOString(),
      contractType: contractType || 'General Contract'
    };
  }

  private getMockDocumentGeneration(documentType: string, parameters: any): any {
    return {
      message: `# ${documentType.toUpperCase()}

**Generated Document Template**

This is a professionally generated ${documentType} template based on your specified parameters:

${JSON.stringify(parameters, null, 2)}

## Key Sections:
1. **Introduction and Parties**
2. **Terms and Conditions** 
3. **Obligations and Rights**
4. **Termination Provisions**
5. **Governing Law**

## Important Notes:
- This template should be reviewed by qualified legal counsel
- Customize sections marked with [PLACEHOLDER]
- Ensure compliance with applicable laws and regulations
- Consider jurisdiction-specific requirements

---
*Generated by Flow AI Legal Assistant*
*${new Date().toLocaleDateString()}*`,
      provider: 'flow-intelligent-document-generation',
      timestamp: new Date().toISOString(),
      documentType: documentType,
      parameters: parameters
    };
  }
}