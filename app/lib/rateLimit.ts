import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (
      value.resetTime < now &&
      (!value.blockedUntil || value.blockedUntil < now)
    ) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Get client IP from request headers
 */
export function getClientIp(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a generic identifier
  return "unknown";
}

/**
 * Rate limiter for login attempts
 * @param identifier - Usually an IP address
 * @param maxAttempts - Maximum attempts allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @param blockDurationMs - How long to block after max attempts (default: 15 minutes)
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  blockDurationMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Check if currently blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const blockedMinutes = Math.ceil((entry.blockedUntil - now) / 60000);
    console.log(
      `🚫 RATE LIMIT: IP ${identifier} is blocked for ${blockedMinutes} more minute(s)`
    );
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
    };
  }

  // If no entry or time window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs,
    };
  }

  // Increment counter
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > maxAttempts) {
    entry.blockedUntil = now + blockDurationMs;
    console.log(
      `⚠️  RATE LIMIT EXCEEDED: IP ${identifier} blocked for 15 minutes (${entry.count} attempts)`
    );
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for an identifier (useful after successful login)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
