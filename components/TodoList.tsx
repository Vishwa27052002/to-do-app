"use client";

import { Todo } from "../app/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-zinc-500 dark:text-zinc-400">
                <p className="text-lg">No tasks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mt-6">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
