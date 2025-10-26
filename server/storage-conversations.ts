import { eq } from 'drizzle-orm';
import { db } from './db';
import {
  conversationThreads,
  conversationMessages,
  companyContext,
  type ConversationThread,
  type InsertConversationThread,
  type ConversationMessage,
  type InsertConversationMessage,
  type CompanyContext,
  type InsertCompanyContext,
} from '@shared/schema';

export class ConversationStorage {
  // Conversation Threads
  async getThread(id: string): Promise<ConversationThread | undefined> {
    const result = await db.select().from(conversationThreads).where(eq(conversationThreads.id, id));
    return result[0];
  }

  async getThreadsByCompany(companyId: string): Promise<ConversationThread[]> {
    return await db.select().from(conversationThreads).where(eq(conversationThreads.companyId, companyId));
  }

  async createThread(thread: InsertConversationThread): Promise<ConversationThread> {
    const result = await db.insert(conversationThreads).values(thread).returning();
    return result[0];
  }

  async updateThread(id: string, updates: Partial<ConversationThread>): Promise<ConversationThread | undefined> {
    const result = await db.update(conversationThreads)
      .set({ ...updates, lastMessageAt: new Date() })
      .where(eq(conversationThreads.id, id))
      .returning();
    return result[0];
  }

  // Conversation Messages
  async getMessage(id: string): Promise<ConversationMessage | undefined> {
    const result = await db.select().from(conversationMessages).where(eq(conversationMessages.id, id));
    return result[0];
  }

  async getMessagesByThread(threadId: string): Promise<ConversationMessage[]> {
    return await db.select().from(conversationMessages)
      .where(eq(conversationMessages.threadId, threadId))
      .orderBy(conversationMessages.createdAt);
  }

  async createMessage(message: InsertConversationMessage): Promise<ConversationMessage> {
    const result = await db.insert(conversationMessages).values(message).returning();
    return result[0];
  }

  // Company Context
  async getCompanyContext(companyId: string): Promise<CompanyContext | undefined> {
    const result = await db.select().from(companyContext).where(eq(companyContext.companyId, companyId));
    return result[0];
  }

  async createCompanyContext(context: InsertCompanyContext): Promise<CompanyContext> {
    const result = await db.insert(companyContext).values(context).returning();
    return result[0];
  }

  async updateCompanyContext(companyId: string, updates: Partial<CompanyContext>): Promise<CompanyContext | undefined> {
    const result = await db.update(companyContext)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(companyContext.companyId, companyId))
      .returning();
    return result[0];
  }
}

export const conversationStorage = new ConversationStorage();
