"use client";

import { useOptimistic, useTransition, useMemo } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { Todo } from "../types/todo";
import { addTodo as dbAddTodo, toggleTodo as dbToggleTodo, deleteTodo as dbDeleteTodo } from "../app/actions";

export default function HomeClient({ 
    initialTodos 
}: { 
    initialTodos: any[] 
}) {
    // Map initial todos to ensure Dates are handled correctly
    const formattedInitialTodos = useMemo(() => initialTodos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt).toISOString(),
        reminderDate: todo.reminderDate ? new Date(todo.reminderDate).toISOString() : null
    })), [initialTodos]);

    const [optimisticTodos, addOptimisticTodo] = useOptimistic(
        formattedInitialTodos,
        (state, { action, payload }: { action: 'add' | 'toggle' | 'delete', payload: any }) => {
            switch (action) {
                case 'add':
                    return [
                        {
                            id: 'temp-' + Date.now(),
                            text: payload.text,
                            completed: false,
                            createdAt: new Date().toISOString(),
                            reminderDate: payload.reminderDate ? payload.reminderDate.toISOString() : null,
                            userId: 'pending'
                        },
                        ...state
                    ];
                case 'toggle':
                    return state.map(todo => 
                        todo.id === payload.id ? { ...todo, completed: payload.completed } : todo
                    );
                case 'delete':
                    return state.filter(todo => todo.id !== payload.id);
                default:
                    return state;
            }
        }
    );

    const [isPending, startTransition] = useTransition();

    const addTodo = async (text: string, reminderDate?: Date) => {
        startTransition(async () => {
            addOptimisticTodo({ action: 'add', payload: { text, reminderDate } });
            try {
                await dbAddTodo(text, reminderDate);
            } catch (error) {
                console.error("Failed to add todo:", error);
            }
        });
    };

    const toggleTodo = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            addOptimisticTodo({ action: 'toggle', payload: { id, completed: !currentStatus } });
            try {
                await dbToggleTodo(id, !currentStatus);
            } catch (error) {
                console.error("Failed to toggle todo:", error);
            }
        });
    };

    const deleteTodo = async (id: string) => {
        startTransition(async () => {
            addOptimisticTodo({ action: 'delete', payload: { id } });
            try {
                await dbDeleteTodo(id);
            } catch (error) {
                console.error("Failed to delete todo:", error);
            }
        });
    };

    return (
        <div className={isPending ? "opacity-70 transition-opacity" : "transition-opacity"}>
            <TodoForm onAdd={addTodo} />

            <div className="mt-8">
                <div className="flex justify-between items-end mb-4 px-2">
                    <h2 className="text-xl font-bold text-white/90">Your List</h2>
                    <span className="text-sm text-white/40">
                        {optimisticTodos.filter(t => t.completed).length}/{optimisticTodos.length} Completed
                    </span>
                </div>
                <TodoList
                    todos={optimisticTodos}
                    onToggle={(id) => {
                        const todo = optimisticTodos.find(t => t.id === id);
                        if (todo) toggleTodo(id, todo.completed);
                    }}
                    onDelete={deleteTodo}
                />
            </div>
        </div>
    );
}
