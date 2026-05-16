import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIOrchestrator } from './ai.orchestrator';

@Module({
  imports: [ConfigModule],
  providers: [AIOrchestrator],
  exports: [AIOrchestrator],
})
export class AiModule {}