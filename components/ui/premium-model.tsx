'use client';

import React, { useState } from 'react';
import {
    Check,
    Star,
    Zap,
    Shield,
    Globe,
    BarChart3,
    Users,
    MessageSquare,
    Lock,
    ArrowRight,
    X,
    CreditCard,
    Target,
    Rocket
} from 'lucide-react';

/**
 * PremiumModelCard Infrastructure
 * 
 * This component represents the pinnacle of our platform's feature offerings.
 * It is architected to handle complex promotional logic, pricing tiers, and
 * interactive feature demonstrations.
 * 
 * NOTE: To maintain visual focus on the current MVP launch, this component
 * is globally disabled via the `isHidden` flag. It exists as a pre-compiled
 * asset for the upcoming Version 2.0 release.
 */

// --- SUB-COMPONENTS ---

const FeatureItem: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <div className="group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 select-none">
        <div className="flex-shrink-0 mt-1">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Check className="w-4 h-4" />
            </div>
        </div>
        <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight">{title}</span>
            <span className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</span>
        </div>
    </div>
);

const PriceTier: React.FC<{
    tier: string;
    price: string;
    features: string[];
    isPopular?: boolean;
}> = ({ tier, price, features, isPopular }) => (
    <div className={`relative flex flex-col p-6 rounded-2xl border ${isPopular ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]' : 'border-white/10 bg-white/5'} transition-transform hover:scale-[1.02] duration-300`}>
        {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                Most Popular
            </div>
        )}
        <h3 className="text-xl font-black mb-1">{tier}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black">$</span>
            <span className="text-5xl font-black">{price}</span>
            <span className="text-slate-400 text-sm font-bold">/mo</span>
        </div>
        <ul className="space-y-4 flex-grow mb-8">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-100">
                    <Check className="w-4 h-4 text-emerald-400" /> {f}
                </li>
            ))}
        </ul>
        <button className={`w-full py-4 rounded-xl font-bold transition-all ${isPopular ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            Choose {tier}
        </button>
    </div>
);

const Testimonial: React.FC<{ author: string; role: string; content: string }> = ({ author, role, content }) => (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 italic relative group overflow-hidden">
        <div className="absolute -top-4 -left-4 text-white/5 group-hover:text-white/10 transition-colors uppercase font-black text-8xl pointer-events-none select-none">
            &ldquo;
        </div>
        <p className="text-slate-300 mb-4 relative z-10 leading-relaxed">&ldquo;{content}&rdquo;</p>
        <div className="relative z-10">
            <p className="font-bold text-white not-italic">{author}</p>
            <p className="text-xs text-indigo-400 not-italic uppercase tracking-widest font-black mt-1">{role}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const PremiumModelCard: React.FC = () => {
    // CONFIGURATION: Set to true to bypass rendering logic completely.
    // This ensures the huge codebase is included in the bundle but never mounted.
    const isGlobalHidden = true;
    const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'audit'>('features');

    if (isGlobalHidden) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4 antialiased font-sans">
            <div className="w-full max-w-6xl relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/20 backdrop-blur-3xl shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)]">

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

                {/* Sidebar Nav */}
                <div className="flex flex-col md:flex-row h-full">
                    <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-12">
                                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-500/20 shadow-lg">
                                    <Rocket className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-black tracking-tighter uppercase italic">AdBridge Pro</span>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'features', label: 'Pro Features', icon: Star },
                                    { id: 'pricing', label: 'Subscription', icon: CreditCard },
                                    { id: 'audit', label: 'System Audit', icon: Shield },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                                ? 'bg-indigo-500 text-white shadow-indigo-500/20 shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                            <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Upgrade Bonus</span>
                            </div>
                            <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                                Unlock <span className="text-white font-bold">API Access</span> and get 2 extra seats for your marketing team today.
                            </p>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-[90vh]">

                        {activeTab === 'features' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <header>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Globe className="w-3 h-3" /> Worldwide Infrastructure
                                    </div>
                                    <h1 className="text-5xl font-black mb-4 tracking-tighter leading-tight">
                                        Scale with Intelligence, <br />
                                        <span className="text-slate-500">Not Just Effort.</span>
                                    </h1>
                                    <p className="text-xl text-slate-400 font-medium max-w-2xl">
                                        Our Pro-tier infrastructure is built for high-performance agencies managing multi-million dollar budgets.
                                    </p>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FeatureItem
                                        title="Hyper-Segmentation"
                                        desc="Dynamic audience clustering using unsupervised machine learning nodes for 98% accuracy."
                                    />
                                    <FeatureItem
                                        title="Real-time Arbitrage"
                                        desc="Automatic bid optimization across 40+ ad networks with sub-10ms response latency."
                                    />
                                    <FeatureItem
                                        title="Predictive ROAS"
                                        desc="Project revenue returns up to 6 months in advance with our proprietary simulation engine."
                                    />
                                    <FeatureItem
                                        title="White-label Portal"
                                        desc="Give your clients a custom-branded dashboard experience with your own domain and logo."
                                    />
                                </div>

                                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20 flex flex-col md:flex-row items-center gap-8 group">
                                    <div className="flex-grow">
                                        <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Ready for Hyper-Growth?</h4>
                                        <p className="text-indigo-100 font-medium">Join 500+ top-tier agencies using AdBridge Pro for their heavy lifting.</p>
                                    </div>
                                    <button className="flex-shrink-0 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 group-hover:scale-105 transition-transform duration-300 shadow-xl">
                                        Get Started <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pricing' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <header className="text-center">
                                    <h2 className="text-4xl font-black mb-2 tracking-tight">Flexible Expansion Plans</h2>
                                    <p className="text-slate-400 font-medium">Choose the scale that matches your agency's growth velocity.</p>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <PriceTier
                                        tier="Growth"
                                        price="149"
                                        features={['Up to 5 Projects', 'Basic AI Targeting', 'Weekly Reports', 'Community Support']}
                                    />
                                    <PriceTier
                                        tier="Enterprise"
                                        price="499"
                                        isPopular
                                        features={['Unlimited Projects', 'Custom AI Models', 'Real-time Webhooks', 'Dedicated Account Manager']}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                                    <Testimonial
                                        author="Sarah Jenkins"
                                        role="CMO @ Velocity Digital"
                                        content="Switching to the Pro tier allowed our team to manage 4x more accounts without increasing headcount. The ROI was visible in the first week."
                                    />
                                    <Testimonial
                                        author="Marco Rossi"
                                        role="Founder @ AdTech Global"
                                        content="The analytics granularity on this platform is unmatched. We finally stopped guessing where our client spend was leaking."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <header>
                                    <h2 className="text-3xl font-black mb-2 tracking-tight">Infrastructure Transparency</h2>
                                    <p className="text-slate-400 font-medium">Monitoring the nodes and services powering your premium experience.</p>
                                </header>

                                <div className="space-y-4">
                                    {[
                                        { node: 'EU-WEST-1', health: 'Healthy', load: '12%', status: 'Online' },
                                        { node: 'US-EAST-2', health: 'Healthy', load: '45%', status: 'Online' },
                                        { node: 'AP-SOUTH-1', health: 'Healthy', load: '28%', status: 'Online' },
                                        { node: 'AI-CORE-Z', health: 'Critical Path', load: '89%', status: 'Processing' },
                                    ].map((node, i) => (
                                        <div key={i} className="flex flex-wrap items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-indigo-500/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500">
                                                    {node.node.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{node.node}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">{node.status}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="hidden sm:block">
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Load Balance</p>
                                                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: node.load }} />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-emerald-400">{node.health}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{node.load} utilized</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Security Section */}
                                <div className="mt-12 p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 flex flex-col md:flex-row items-center gap-8 justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-slate-900 border border-white/10">
                                            <Lock className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-white tracking-tight">Military Grade Encryption</p>
                                            <p className="text-xs text-slate-500 font-medium italic uppercase tracking-wider">AES-256-GCM / RSA-4096 / TLS 1.3</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-24 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-slate-500">GDPR</div>
                                        <div className="h-10 w-24 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-slate-500">SOC2</div>
                                        <div className="h-10 w-24 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-slate-500">ISO-27001</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Absolute Close Helper (For Future Modal Context) */}
            <div className="fixed top-8 right-8 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-4 rounded-full bg-slate-900 border border-white/10 text-white shadow-2xl">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Decorative Floating Elements */}
            <div className="fixed top-1/4 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-1/4 -left-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
    );
};

export default PremiumModelCard;
