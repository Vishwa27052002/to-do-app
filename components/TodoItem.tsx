"use client";

import { useState } from "react";
import { Todo } from "../app/types";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void; // Added onEdit prop
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) { // Added onEdit to destructuring
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(todo.id, editText);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 mb-2 bg-white border rounded-lg shadow-sm border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-center gap-3 flex-1"> {/* Added flex-1 */}
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded border-zinc-300 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                />
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="flex-1 px-2 py-1 text-lg border rounded border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <div className="flex flex-col">
                        <span
                            className={`text-lg transition-all cursor-pointer ${ // Added cursor-pointer
                                todo.completed
                                    ? "text-zinc-400 line-through dark:text-zinc-500"
                                    : "text-zinc-800 dark:text-zinc-100"
                                }`}
                            onClick={() => setIsEditing(true)} // Added onClick to enable editing
                            title="Click to edit" // Added title for accessibility
                        >
                            {todo.text}
                        </span>
                        {todo.reminderDate && (
                            <span className="text-xs text-purple-500 font-medium">
                                Reminder: {new Date(todo.reminderDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div className="flex gap-1"> {/* Wrapped buttons in a div with gap */}
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Edit task"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={() => onDelete(todo.id)}
                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 rounded-full transition-colors dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="Delete task"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
