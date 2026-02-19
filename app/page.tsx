"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { Todo } from "../types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-[calc(100-64px)] bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 mb-3">
            Tasks
          </h1>
          <p className="text-white/60 text-lg">Stay organized, get things done.</p>
        </header>

        <SignedIn>
          <TodoForm onAdd={addTodo} />

          <div className="mt-8">
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-xl font-bold text-white/90">Your List</h2>
              <span className="text-sm text-white/40">
                {todos.filter(t => t.completed).length}/{todos.length} Completed
              </span>
            </div>
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Welcome to Tasks</h2>
            <p className="text-white/60 mb-8">Please sign in to manage your to-do list and sync across devices.</p>
            <SignInButton mode="modal">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer">
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
