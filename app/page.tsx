import { Suspense } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getTodos } from "./actions";
import HomeClient from "../components/HomeClient";
import { headers } from "next/headers";

export default async function Home({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const isE2E = params.e2e === 'true';

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

                {isE2E ? (
                    <HomeContent isE2E={true} />
                ) : (
                    <>
                        <SignedIn>
                            <HomeContent isE2E={false} />
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
                    </>
                )}
            </div>
        </main>
    );
}

async function HomeContent({ isE2E }: { isE2E: boolean }) {
    // We already have authentication logic inside getTodos (via getUserId)
    const initialTodos = await getTodos();

    return (
        <Suspense fallback={<div className="text-center py-10 text-white/40">Loading tasks...</div>}>
            <HomeClient initialTodos={initialTodos} />
        </Suspense>
    );
}
