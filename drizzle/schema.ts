import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with photographer-specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "photographer"]).default("user").notNull(),
  
  // Profile fields
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  
  // Photographer-specific fields
  isPhotographer: boolean("isPhotographer").default(false).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  hourlyRate: int("hourlyRate"),
  yearsExperience: int("yearsExperience"),
  
  // Social links
  instagram: varchar("instagram", { length: 255 }),
  website: varchar("website", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for photography services
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Portfolio items for photographers
 */
export const portfolioItems = mysqlTable("portfolio_items", {
  id: int("id").autoincrement().primaryKey(),
  photographerId: int("photographerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  categoryId: int("categoryId"),
  likes: int("likes").default(0).notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;

/**
 * Bookings/Agendamentos
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  photographerId: int("photographerId").notNull(),
  categoryId: int("categoryId"),
  
  // Booking details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  
  // Date and time
  bookingDate: timestamp("bookingDate").notNull(),
  duration: int("duration").notNull(), // in minutes
  
  // Status
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  
  // Pricing
  totalPrice: int("totalPrice"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Reviews/Avaliações
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  clientId: int("clientId").notNull(),
  photographerId: int("photographerId").notNull(),
  
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Messages/Chat
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  bookingId: int("bookingId"), // Optional: link to a booking
  
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Photographer availability slots
 */
export const availabilitySlots = mysqlTable("availability_slots", {
  id: int("id").autoincrement().primaryKey(),
  photographerId: int("photographerId").notNull(),
  
  // Day of week (0-6, Sunday-Saturday) or specific date
  dayOfWeek: int("dayOfWeek"), // 0-6
  specificDate: timestamp("specificDate"), // For specific date overrides
  
  startTime: varchar("startTime", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("endTime", { length: 5 }).notNull(), // "17:00"
  
  isAvailable: boolean("isAvailable").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = typeof availabilitySlots.$inferInsert;

/**
 * User follows (for social features)
 */
export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

/**
 * Portfolio item likes
 */
export const portfolioLikes = mysqlTable("portfolio_likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  portfolioItemId: int("portfolioItemId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioLike = typeof portfolioLikes.$inferSelect;
export type InsertPortfolioLike = typeof portfolioLikes.$inferInsert;
