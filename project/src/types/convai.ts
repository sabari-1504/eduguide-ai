// ConvAI Character and Chat Types
export interface ConvAICharacter {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  personality?: string;
  expertise?: string[];
  voice?: string;
  isActive?: boolean;
}

export interface ConvAIChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'character';
  characterId?: string;
  characterName?: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ConvAIConfig {
  apiKey: string;
  characters: ConvAICharacter[];
  defaultCharacterId?: string;
  enableAudio?: boolean;
  sessionId?: string;
}

export interface ConvAIResponse {
  text: string;
  characterId: string;
  characterName: string;
  isComplete: boolean;
}