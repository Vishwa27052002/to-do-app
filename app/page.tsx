"use client";

import { useState, useEffect, useTransition } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { getTodos, addTodo as dbAddTodo, toggleTodo as dbToggleTodo, deleteTodo as dbDeleteTodo } from "./actions";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      // Map database types to frontend if necessary (e.g., Dates to strings if components expect that)
      const formattedData = data.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }));
      setTodos(formattedData);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    startTransition(async () => {
      try {
        await dbAddTodo(text);
        await fetchTodos();
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    });
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await dbToggleTodo(id, !currentStatus);
        await fetchTodos();
      } catch (error) {
        console.error("Failed to toggle todo:", error);
      }
    });
  };

  const deleteTodo = async (id: string) => {
    startTransition(async () => {
      try {
        await dbDeleteTodo(id);
        await fetchTodos();
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    });
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
          <div className={isPending ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
            <TodoForm onAdd={addTodo} />

            <div className="mt-8">
              <div className="flex justify-between items-end mb-4 px-2">
                <h2 className="text-xl font-bold text-white/90">Your List</h2>
                <span className="text-sm text-white/40">
                  {todos.filter(t => t.completed).length}/{todos.length} Completed
                </span>
              </div>
              <TodoList
                todos={todos}
                onToggle={(id) => {
                  const todo = todos.find(t => t.id === id);
                  if (todo) toggleTodo(id, todo.completed);
                }}
                onDelete={deleteTodo}
              />
            </div>
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
