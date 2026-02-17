"use client";

import { Todo } from '../types/todo';

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
        <ul className="space-y-3">
            {todos.map((todo) => (
                <li
                    key={todo.id}
                    className={`group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all ${todo.completed ? 'opacity-60' : ''
                        }`}
                >
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => onToggle(todo.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${todo.completed
                                    ? 'bg-purple-500 border-purple-500'
                                    : 'border-white/30 hover:border-purple-400'
                                }`}
                        >
                            {todo.completed && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                        <span
                            className={`text-lg transition-all ${todo.completed ? 'text-white/40 line-through' : 'text-white'
                                }`}
                        >
                            {todo.text}
                        </span>
                    </div>
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Delete task"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </li>
            ))}
        </ul>
    );
}
