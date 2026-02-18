"use client";

import { useState, useEffect } from "react";

import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { Todo } from "../types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  import ExpenseForm from "../components/ExpenseForm";
  import ExpenseList from "../components/ExpenseList";
  import { Expense } from "../types/expense";

  export default function Home() {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);

      const saved = localStorage.getItem("todos");
      if (saved) {
        setTodos(JSON.parse(saved));

        const saved = localStorage.getItem("expenses");
        if (saved) {
          setExpenses(JSON.parse(saved));

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


    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
}, [expenses, isMounted]);

if (!isMounted) {
  return null; // or a loading spinner
}

const addExpense = (newExpense: Omit<Expense, "id">) => {
  const expense: Expense = {
    ...newExpense,
    id: crypto.randomUUID(),
  };
  setExpenses([expense, ...expenses]);
};

const deleteExpense = (id: string) => {
  setExpenses(expenses.filter((e) => e.id !== id));
};


return (
  <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>


    <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 mb-3">
          Tasks
        </h1>
        <p className="text-white/60 text-lg">Stay organized, get things done.</p>
      </header>

      <TodoForm onAdd={addTodo} />

      <div className="mt-8">
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-xl font-bold text-white/90">Your List</h2>
          <span className="text-sm text-white/40">
            {todos.filter(t => t.completed).length}/{todos.length} Completed
          </span>
        </div>
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
              Expense Tracker
            </h1>
            <p className="text-white/60 text-lg">Manage your finances with style.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <ExpenseForm onAddExpense={addExpense} />
            </div>
            <div className="lg:col-span-3">
              <ExpenseList expenses={expenses} onDelete={deleteExpense} />
            </div>
          </div>
        </div>
      </main>
      );
}
