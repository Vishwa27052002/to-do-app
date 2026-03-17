import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => ({ userId: 'user_123' })),
}))

// Mock Drizzle/DB if needed globally, but better done per test
