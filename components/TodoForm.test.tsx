import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoForm from './TodoForm'

describe('TodoForm', () => {
    it('renders input with correct placeholder and button', () => {
        render(<TodoForm onAdd={() => { }} />)
        expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })

    it('calls onAdd with text and reminder when form is submitted', () => {
        const onAdd = vi.fn()
        render(<TodoForm onAdd={onAdd} />)

        const input = screen.getByPlaceholderText(/what needs to be done/i)
        const button = screen.getByRole('button', { name: /add/i })
        const reminderInput = screen.getByLabelText(/set reminder/i)

        fireEvent.change(input, { target: { value: 'Buy groceries' } })
        fireEvent.change(reminderInput, { target: { value: '2026-03-01T12:00' } })
        fireEvent.click(button)

        expect(onAdd).toHaveBeenCalledWith('Buy groceries', expect.any(Date))
        expect(input).toHaveValue('')
        expect(reminderInput).toHaveValue('')
    })

    it('disables add button when input is empty', () => {
        render(<TodoForm onAdd={() => { }} />)
        const button = screen.getByRole('button', { name: /add/i })
        expect(button).toBeDisabled()
    })

    it('calls onAdd without reminder if reminder is not set', () => {
        const onAdd = vi.fn()
        render(<TodoForm onAdd={onAdd} />)

        const input = screen.getByPlaceholderText(/what needs to be done/i)
        const button = screen.getByRole('button', { name: /add/i })

        fireEvent.change(input, { target: { value: 'Just a task' } })
        fireEvent.click(button)

        expect(onAdd).toHaveBeenCalledWith('Just a task', undefined)
    })
})
