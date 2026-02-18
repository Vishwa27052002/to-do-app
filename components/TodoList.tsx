"use client";

import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className="text-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <p>No tasks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={() => { }} // Placeholder or implement edit if needed, preventing error for now
                />
            ))}
        </div>
    );
}
