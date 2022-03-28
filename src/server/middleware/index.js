import rateLimit from 'express-rate-limit';

/**
 * The limiter middleware
 */
 export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});