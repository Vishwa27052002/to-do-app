import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addTodo, getTodos, toggleTodo, deleteTodo } from './actions'
import { db } from '../db'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue({
        get: vi.fn().mockReturnValue(null),
    }),
}))

vi.mock('../db', () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
    },
}))

describe('Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getTodos', () => {
        it('should return empty array if unauthorized', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any)
            const result = await getTodos()
            expect(result).toEqual([])
        })

        it('should return todos for authorized user', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ userId: 'user_123' } as any)
            const now = new Date();
            const mockTodos = [{ id: '1', text: 'Test Todo', createdAt: now, reminderDate: null }]
            vi.mocked(db.select().from(null as any).where(null as any).orderBy).mockResolvedValueOnce(mockTodos as any)

            const result = await getTodos()
            expect(result).toEqual(mockTodos)
            expect(db.select).toHaveBeenCalled()
        })
    })

    describe('addTodo', () => {
        it('should insert a new todo and revalidate path', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ userId: 'user_123' } as any)

            await addTodo('New Todo')

            expect(db.insert).toHaveBeenCalled()
            expect(revalidatePath).toHaveBeenCalledWith('/')
        })
    })

    describe('toggleTodo', () => {
        it('should update todo status and revalidate path', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ userId: 'user_123' } as any)

            await toggleTodo('1', true)

            expect(db.update).toHaveBeenCalled()
            expect(revalidatePath).toHaveBeenCalledWith('/')
        })
    })

    describe('deleteTodo', () => {
        it('should delete todo and revalidate path', async () => {
            vi.mocked(auth).mockResolvedValueOnce({ userId: 'user_123' } as any)

            await deleteTodo('1')

            expect(db.delete).toHaveBeenCalled()
            expect(revalidatePath).toHaveBeenCalledWith('/')
        })
    })
})
