import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIContext {
  userId: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
  goals: string[];
  memories: Array<{ type: string; content: string }>;
  sessionHistory: AIMessage[];
}

@Injectable()
export class AIOrchestrator {
  private readonly logger = new Logger(AIOrchestrator.name);
  private readonly openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get("OPENAI_API_KEY") });
  }

  // ── Build system prompt ──────────────────────────────────
  private buildSystemPrompt(ctx: AIContext): string {
    const mistakes = ctx.memories
      .filter((m) => m.type === "MISTAKE")
      .map((m) => `- ${m.content}`)
      .join("\n") || "None recorded yet";

    const preferences = ctx.memories
      .filter((m) => m.type === "PREFERENCE")
      .map((m) => m.content)
      .join(", ") || "Not specified";

    return `You are NeuroLingua — an advanced, adaptive AI language tutor.

STUDENT PROFILE:
• Native language: ${ctx.nativeLanguage}
• Learning: ${ctx.targetLanguage}
• CEFR Level: ${ctx.level}
• Goals: ${ctx.goals.join(", ")}

KNOWN MISTAKES TO ADDRESS:
${mistakes}

STUDENT PREFERENCES: ${preferences}

YOUR TEACHING RULES:
1. Always respond in ${ctx.targetLanguage} unless the student is confused
2. Gently correct mistakes — explain WHY, don't just fix
3. Adapt complexity to ${ctx.level} level
4. Use encouragement naturally (not excessively)
5. Reference their native language patterns when explaining difficult concepts
6. Keep responses concise and conversational
7. End with a question or prompt to keep the conversation flowing

You are NOT a chatbot. You are a living tutor that evolves with this specific student.`;
  }

  // ── Streaming chat ───────────────────────────────────────
  async streamChat(
    messages: AIMessage[],
    ctx: AIContext,
  ): Promise<ReadableStream> {
    const systemPrompt = this.buildSystemPrompt(ctx);

    const stream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20), // keep last 20 messages for context
      ],
    });

    return stream.toReadableStream();
  }

  // ── Single completion ────────────────────────────────────
  async complete(prompt: string, ctx: AIContext): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: 300,
      messages: [
        { role: "system", content: this.buildSystemPrompt(ctx) },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  }

  // ── Extract memories from conversation ───────────────────
  async extractMemories(userMessage: string, ctx: AIContext): Promise<
    Array<{ type: string; content: string; importance: number }>
  > {
    const prompt = `Analyze this message from a ${ctx.targetLanguage} learner (native: ${ctx.nativeLanguage}, level: ${ctx.level}):

"${userMessage}"

Extract any learnable insights as JSON array. Each item:
{ "type": "MISTAKE"|"PREFERENCE"|"FACT", "content": "brief description", "importance": 0.1-1.0 }

Only extract meaningful insights. Return [] if nothing notable. Return ONLY valid JSON.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 200,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(text);
      return Array.isArray(parsed.memories) ? parsed.memories : [];
    } catch (err) {
      this.logger.warn("Memory extraction failed", err);
      return [];
    }
  }

  // ── Score pronunciation ──────────────────────────────────
  async scorePronunciation(
    word: string,
    language: string,
    audioTranscription: string,
  ): Promise<{ score: number; feedback: string; nativeIPA: string; userIPA: string }> {
    const prompt = `A student is learning ${language} and attempted to say: "${word}"
Their pronunciation was transcribed as: "${audioTranscription}"

Rate pronunciation 0-100 and give feedback. Return JSON:
{ "score": number, "feedback": "2 sentence feedback", "nativeIPA": "correct IPA", "userIPA": "estimated user IPA" }`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? "{}";
    return JSON.parse(text);
  }
}
