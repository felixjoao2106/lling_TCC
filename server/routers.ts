import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ USER/PROFILE ============
  user: router({
    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const user = await db.getUserById(input.userId);
        if (!user) return null;
        
        const [followers, following] = await Promise.all([
          db.getFollowersCount(input.userId),
          db.getFollowingCount(input.userId),
        ]);
        
        return { ...user, followers, following };
      }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        phone: z.string().optional(),
        specialty: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
        hourlyRate: z.number().optional(),
        yearsExperience: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    becomePhotographer: protectedProcedure
      .input(z.object({
        specialty: z.string(),
        hourlyRate: z.number(),
        yearsExperience: z.number().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, {
          isPhotographer: true,
          specialty: input.specialty,
          hourlyRate: input.hourlyRate,
          yearsExperience: input.yearsExperience,
          bio: input.bio,
        });
        return { success: true };
      }),

    uploadAvatar: protectedProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.mimeType.split("/")[1] || "jpg";
        const key = `avatars/${ctx.user.id}-${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        await db.updateUserProfile(ctx.user.id, { avatarUrl: url });
        return { url };
      }),
  }),

  // ============ PHOTOGRAPHERS ============
  photographers: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getPhotographers(input.limit, input.offset);
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        return db.searchPhotographers(input.query, input.limit);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const photographer = await db.getUserById(input.id);
        if (!photographer || !photographer.isPhotographer) return null;
        
        const [followers, following, rating, portfolio, reviews] = await Promise.all([
          db.getFollowersCount(input.id),
          db.getFollowingCount(input.id),
          db.getPhotographerAverageRating(input.id),
          db.getPortfolioByPhotographer(input.id, 12),
          db.getReviewsByPhotographer(input.id),
        ]);
        
        return { ...photographer, followers, following, rating, portfolio, reviews };
      }),
  }),

  // ============ PORTFOLIO ============
  portfolio: router({
    feed: publicProcedure
      .input(z.object({
        limit: z.number().default(30),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getPortfolioFeed(input.limit, input.offset);
      }),

    getByPhotographer: publicProcedure
      .input(z.object({
        photographerId: z.number(),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        return db.getPortfolioByPhotographer(input.photographerId, input.limit);
      }),

    getItem: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const item = await db.getPortfolioItem(input.id);
        if (item) {
          await db.incrementPortfolioViews(input.id);
        }
        return item;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        base64: z.string(),
        mimeType: z.string(),
        categoryId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.mimeType.split("/")[1] || "jpg";
        const key = `portfolio/${ctx.user.id}/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        
        await db.createPortfolioItem({
          photographerId: ctx.user.id,
          title: input.title,
          description: input.description,
          imageUrl: url,
          categoryId: input.categoryId,
        });
        
        return { success: true, url };
      }),

    like: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const hasLiked = await db.hasLikedPortfolioItem(ctx.user.id, input.itemId);
        if (hasLiked) {
          await db.unlikePortfolioItem(ctx.user.id, input.itemId);
          return { liked: false };
        } else {
          await db.likePortfolioItem(ctx.user.id, input.itemId);
          return { liked: true };
        }
      }),

    hasLiked: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.hasLikedPortfolioItem(ctx.user.id, input.itemId);
      }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    list: publicProcedure.query(async () => {
      return db.getAllCategories();
    }),
  }),

  // ============ BOOKINGS ============
  bookings: router({
    create: protectedProcedure
      .input(z.object({
        photographerId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        bookingDate: z.string(), // ISO date string
        duration: z.number(), // minutes
        categoryId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const photographer = await db.getUserById(input.photographerId);
        const totalPrice = photographer?.hourlyRate 
          ? Math.round((input.duration / 60) * photographer.hourlyRate)
          : undefined;
        
        await db.createBooking({
          clientId: ctx.user.id,
          photographerId: input.photographerId,
          title: input.title,
          description: input.description,
          location: input.location,
          bookingDate: new Date(input.bookingDate),
          duration: input.duration,
          categoryId: input.categoryId,
          totalPrice,
        });
        
        return { success: true };
      }),

    myBookings: protectedProcedure.query(async ({ ctx }) => {
      return db.getBookingsByClient(ctx.user.id);
    }),

    photographerBookings: protectedProcedure.query(async ({ ctx }) => {
      return db.getBookingsByPhotographer(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateBookingStatus(input.bookingId, input.status);
        return { success: true };
      }),
  }),

  // ============ REVIEWS ============
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        photographerId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReview({
          bookingId: input.bookingId,
          clientId: ctx.user.id,
          photographerId: input.photographerId,
          rating: input.rating,
          comment: input.comment,
        });
        return { success: true };
      }),

    getByPhotographer: publicProcedure
      .input(z.object({ photographerId: z.number() }))
      .query(async ({ input }) => {
        return db.getReviewsByPhotographer(input.photographerId);
      }),
  }),

  // ============ MESSAGES ============
  messages: router({
    send: protectedProcedure
      .input(z.object({
        receiverId: z.number(),
        content: z.string(),
        bookingId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createMessage({
          senderId: ctx.user.id,
          receiverId: input.receiverId,
          content: input.content,
          bookingId: input.bookingId,
        });
        return { success: true };
      }),

    getConversation: protectedProcedure
      .input(z.object({
        otherUserId: z.number(),
        limit: z.number().default(50),
      }))
      .query(async ({ ctx, input }) => {
        await db.markMessagesAsRead(input.otherUserId, ctx.user.id);
        return db.getConversation(ctx.user.id, input.otherUserId, input.limit);
      }),

    myConversations: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserConversations(ctx.user.id);
    }),
  }),

  // ============ FOLLOWS ============
  follows: router({
    toggle: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isCurrentlyFollowing = await db.isFollowing(ctx.user.id, input.userId);
        if (isCurrentlyFollowing) {
          await db.unfollowUser(ctx.user.id, input.userId);
          return { following: false };
        } else {
          await db.followUser(ctx.user.id, input.userId);
          return { following: true };
        }
      }),

    isFollowing: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.isFollowing(ctx.user.id, input.userId);
      }),
  }),

  // ============ AVAILABILITY ============
  availability: router({
    set: protectedProcedure
      .input(z.object({
        dayOfWeek: z.number().min(0).max(6).optional(),
        specificDate: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),
        isAvailable: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.setAvailability({
          photographerId: ctx.user.id,
          dayOfWeek: input.dayOfWeek,
          specificDate: input.specificDate ? new Date(input.specificDate) : undefined,
          startTime: input.startTime,
          endTime: input.endTime,
          isAvailable: input.isAvailable,
        });
        return { success: true };
      }),

    getByPhotographer: publicProcedure
      .input(z.object({ photographerId: z.number() }))
      .query(async ({ input }) => {
        return db.getPhotographerAvailability(input.photographerId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
