import { eq, and, or, desc, sql, inArray, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  categories, InsertCategory,
  portfolioItems, InsertPortfolioItem,
  bookings, InsertBooking,
  reviews, InsertReview,
  messages, InsertMessage,
  availabilitySlots, InsertAvailabilitySlot,
  follows, InsertFollow,
  portfolioLikes, InsertPortfolioLike
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "bio", "avatarUrl", "location", "phone", "specialty", "instagram", "website"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function getPhotographers(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users)
    .where(eq(users.isPhotographer, true))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(users.createdAt));
}

export async function searchPhotographers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users)
    .where(and(
      eq(users.isPhotographer, true),
      or(
        like(users.name, `%${query}%`),
        like(users.specialty, `%${query}%`),
        like(users.location, `%${query}%`)
      )
    ))
    .limit(limit);
}

// ============ CATEGORY QUERIES ============

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories);
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) return;
  await db.insert(categories).values(data);
}

// ============ PORTFOLIO QUERIES ============

export async function getPortfolioByPhotographer(photographerId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems)
    .where(eq(portfolioItems.photographerId, photographerId))
    .limit(limit)
    .orderBy(desc(portfolioItems.createdAt));
}

export async function createPortfolioItem(data: InsertPortfolioItem) {
  const db = await getDb();
  if (!db) return;
  await db.insert(portfolioItems).values(data);
}

export async function getPortfolioFeed(limit = 30, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(portfolioItems.createdAt));
}

export async function getPortfolioItem(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function incrementPortfolioViews(itemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(portfolioItems)
    .set({ views: sql`${portfolioItems.views} + 1` })
    .where(eq(portfolioItems.id, itemId));
}

// ============ BOOKING QUERIES ============

export async function createBooking(data: InsertBooking) {
  const db = await getDb();
  if (!db) return;
  await db.insert(bookings).values(data);
}

export async function getBookingsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings)
    .where(eq(bookings.clientId, clientId))
    .orderBy(desc(bookings.bookingDate));
}

export async function getBookingsByPhotographer(photographerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings)
    .where(eq(bookings.photographerId, photographerId))
    .orderBy(desc(bookings.bookingDate));
}

export async function updateBookingStatus(bookingId: number, status: "pending" | "confirmed" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) return;
  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
}

// ============ REVIEW QUERIES ============

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reviews).values(data);
}

export async function getReviewsByPhotographer(photographerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews)
    .where(eq(reviews.photographerId, photographerId))
    .orderBy(desc(reviews.createdAt));
}

export async function getPhotographerAverageRating(photographerId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({
    avg: sql<number>`AVG(${reviews.rating})`
  }).from(reviews).where(eq(reviews.photographerId, photographerId));
  return result[0]?.avg || 0;
}

// ============ MESSAGE QUERIES ============

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return;
  await db.insert(messages).values(data);
}

export async function getConversation(userId1: number, userId2: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages)
    .where(or(
      and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
      and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
    ))
    .limit(limit)
    .orderBy(desc(messages.createdAt));
}

export async function markMessagesAsRead(senderId: number, receiverId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(messages)
    .set({ isRead: true })
    .where(and(
      eq(messages.senderId, senderId),
      eq(messages.receiverId, receiverId),
      eq(messages.isRead, false)
    ));
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Buscar todas as mensagens do usuário
  const allMessages = await db.select().from(messages)
    .where(or(
      eq(messages.senderId, userId),
      eq(messages.receiverId, userId)
    ))
    .orderBy(desc(messages.createdAt));
  
  // Agrupar por conversa (outro usuário)
  const conversationsMap = new Map<number, {
    otherUserId: number;
    lastMessage: typeof allMessages[0];
    unreadCount: number;
  }>();
  
  for (const msg of allMessages) {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, {
        otherUserId,
        lastMessage: msg,
        unreadCount: 0,
      });
    }
    // Contar mensagens não lidas
    if (msg.receiverId === userId && !msg.isRead) {
      const conv = conversationsMap.get(otherUserId)!;
      conv.unreadCount++;
    }
  }
  
  // Buscar dados dos usuários
  const otherUserIds = Array.from(conversationsMap.keys());
  const usersData = otherUserIds.length > 0 
    ? await db.select().from(users).where(inArray(users.id, otherUserIds))
    : [];
  
  const usersMap = new Map(usersData.map(u => [u.id, u]));
  
  return Array.from(conversationsMap.values()).map(conv => ({
    ...conv,
    otherUser: usersMap.get(conv.otherUserId) || null,
  }));
}

// ============ AVAILABILITY QUERIES ============

export async function setAvailability(data: InsertAvailabilitySlot) {
  const db = await getDb();
  if (!db) return;
  await db.insert(availabilitySlots).values(data);
}

export async function getPhotographerAvailability(photographerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(availabilitySlots)
    .where(eq(availabilitySlots.photographerId, photographerId));
}

// ============ FOLLOW QUERIES ============

export async function followUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(follows).values({ followerId, followingId });
}

export async function unfollowUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(follows).where(and(
    eq(follows.followerId, followerId),
    eq(follows.followingId, followingId)
  ));
}

export async function getFollowersCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(follows).where(eq(follows.followingId, userId));
  return result[0]?.count || 0;
}

export async function getFollowingCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(follows).where(eq(follows.followerId, userId));
  return result[0]?.count || 0;
}

export async function isFollowing(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(follows)
    .where(and(
      eq(follows.followerId, followerId),
      eq(follows.followingId, followingId)
    ))
    .limit(1);
  return result.length > 0;
}

// ============ LIKE QUERIES ============

export async function likePortfolioItem(userId: number, portfolioItemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(portfolioLikes).values({ userId, portfolioItemId });
  await db.update(portfolioItems)
    .set({ likes: sql`${portfolioItems.likes} + 1` })
    .where(eq(portfolioItems.id, portfolioItemId));
}

export async function unlikePortfolioItem(userId: number, portfolioItemId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(portfolioLikes).where(and(
    eq(portfolioLikes.userId, userId),
    eq(portfolioLikes.portfolioItemId, portfolioItemId)
  ));
  await db.update(portfolioItems)
    .set({ likes: sql`${portfolioItems.likes} - 1` })
    .where(eq(portfolioItems.id, portfolioItemId));
}

export async function hasLikedPortfolioItem(userId: number, portfolioItemId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(portfolioLikes)
    .where(and(
      eq(portfolioLikes.userId, userId),
      eq(portfolioLikes.portfolioItemId, portfolioItemId)
    ))
    .limit(1);
  return result.length > 0;
}
