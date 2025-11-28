import { AsyncLocalStorage } from 'node:async_hooks';
import prisma from '../prisma/client.js'

// The storage to hold the specific transaction client for a request chain
const txStorage = new AsyncLocalStorage();

/**
 * UnitOfWork manages a single transaction across multiple repositories.
 */
class UnitOfWork {
  constructor(db) {
    this.db = db;
  }

  /**
   * Execute runs a function within a transaction context.
   * If a transaction is already active in the current context,
   * it reuses that transaction (transaction flattening).
   * 
   * @param {Function} fn - The function to execute within the transaction
   * @returns {Promise} The result of the function execution
   */
  async execute(fn) {
    const existingTx = txStorage.getStore();

    // If we're already in a transaction, just run the function
    if (existingTx) {
      return fn();
    }

    // Start a new transaction
    try {
      return await this.db.$transaction(async (tx) => {
        // Run the function within the transaction context
        return txStorage.run(tx, fn);
      });
    } catch (error) {
      // Error handling is managed by Prisma's transaction
      throw error;
    }
  }

  /**
   * getClient returns the active transaction client if present,
   * otherwise returns the default database client.
   * 
   * @returns {Object} The database client (transaction or default)
   */
  get client() {
    const tx = txStorage.getStore();
    return tx || this.db;
  }
}

// Create and export a singleton instance
export const uow = new UnitOfWork(prisma);

// Export the class for potential custom instances
export { UnitOfWork };

/**
 * Helper function to get the current database client from context
 * This is useful for repositories that need access to the transaction
 * 
 * @returns {Object} The database client (transaction or default)
 */
export function getDBFromContext() {
  const tx = txStorage.getStore();
  return tx || prisma;
}

/**
 * Helper function to get the default database client
 * 
 * @returns {Object} The default Prisma client
 */
export function getDefaultDB() {
  return prisma;
}