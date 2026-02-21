"use client";

import { useState } from 'react';

interface TodoFormProps {
    onAdd: (text: string, reminderDate?: Date) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
    const [text, setText] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text, reminderDate ? new Date(reminderDate) : undefined);
        setText('');
        setReminderDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                    >
                        Add
                    </button>
                </div>
                <div className="flex items-center gap-3 px-2">
                    <label htmlFor="reminder" className="text-sm text-white/60 font-medium">Set Reminder:</label>
                    <input
                        id="reminder"
                        type="datetime-local"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                    />
                </div>
            </div>
        </form>
    );
}
