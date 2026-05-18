/**
 * GW2 API rate-limit queue.
 *
 * ArenaNet's official API rate limit per IP:
 *   - 300 requests burst budget
 *   - Refills at 5 requests per second
 *
 * This queue paces outgoing requests to stay under those limits. It uses a
 * token-bucket algorithm: tokens regenerate continuously at 5/sec up to
 * the 300 cap, and each request consumes one token.
 *
 * Pure JS, no dependencies, works in browser and Tauri WebView identically.
 */

const TOKENS_PER_SECOND = 5;
const MAX_TOKENS = 300;

interface QueueItem {
  resolve: () => void;
  reject: (err: Error) => void;
}

export class RateLimitQueue {
  private tokens: number;
  private lastRefill: number;
  private queue: QueueItem[] = [];
  private processing = false;

  constructor() {
    this.tokens = MAX_TOKENS;
    this.lastRefill = Date.now();
  }

  /**
   * Acquire one token. Resolves when a token is available; rejects on
   * disposal. Callers should `await acquire()` immediately before making
   * an API request.
   */
  acquire(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
      this.process();
    });
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsedSeconds * TOKENS_PER_SECOND;
    if (tokensToAdd >= 1) {
      this.tokens = Math.min(MAX_TOKENS, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      this.refill();

      if (this.tokens >= 1) {
        this.tokens -= 1;
        const item = this.queue.shift();
        item?.resolve();
      } else {
        // Wait until next token would be available
        const waitMs = Math.ceil((1 / TOKENS_PER_SECOND) * 1000);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }

    this.processing = false;
  }

  /**
   * Current token count (useful for diagnostics / UI rate-limit indicators).
   */
  get availableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  /**
   * Reject all pending items. Used during cleanup or auth changes that
   * invalidate in-flight requests.
   */
  drain(reason = 'Queue drained'): void {
    const err = new Error(reason);
    for (const item of this.queue) item.reject(err);
    this.queue = [];
  }
}

/** Shared singleton instance for the app. */
export const gw2Queue = new RateLimitQueue();
