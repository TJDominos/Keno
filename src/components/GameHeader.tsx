import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, ArrowUp } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AudioSys } from '../lib/audio';

export function GameHeader() {
    const { state } = useGame();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const historyPageSize = 20;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && 
                panelRef.current && !panelRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    const toggleHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        AudioSys.click();
        setIsOpen(!isOpen);
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
        setShowBackToTop(scrollTop > 100);

        if (scrollTop + clientHeight >= scrollHeight - 20) {
            if (state.history.length > historyPage * historyPageSize) {
                setHistoryPage(p => p + 1);
            }
        }
    };

    const scrollToTop = (e: React.MouseEvent) => {
        e.stopPropagation();
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const visibleHistory = state.history.slice(0, historyPage * historyPageSize);

    return (
        <div className="w-full max-w-[1024px] relative my-[15px] mb-[10px] px-[10px] z-[400] flex justify-center shrink-0">
            <div 
                ref={triggerRef}
                className="flex items-center justify-between gap-[12px] bg-[#15171a] p-[12px_20px] rounded-[16px] border border-[#2d3035] cursor-pointer w-full max-w-full transition-colors duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:bg-[#25282c] active:border-[#444]"
                onClick={toggleHistory}
            >
                <div className="flex items-center justify-center text-[#39ff14] opacity-80">
                    <Wallet size={24} />
                </div>
                <span className="text-[24px] font-bold text-[#39ff14] tracking-[1px] font-mono drop-shadow-[0_0_10px_rgba(57,255,20,0.2)] flex-1 text-center">
                    {state.isLoggedIn ? `$${state.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Login"}
                </span>
                <span className={`text-[12.8px] text-[#6e7681] transition-transform duration-300 ml-auto ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} />
                </span>
            </div>

            <div 
                ref={panelRef}
                className={`absolute top-full left-[10px] right-[10px] bg-[#15171a] border border-[#2d3035] rounded-[12px] shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-200 ease-in-out flex flex-col overflow-hidden mt-[5px] z-[600] ${isOpen ? 'max-h-[350px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
                <div 
                    ref={scrollRef}
                    className="overflow-y-auto max-h-[350px] w-full"
                    onScroll={handleScroll}
                >
                    {state.history.length === 0 ? (
                        <div className="p-[30px] text-center text-[#6e7681] italic text-[15.2px] flex items-center justify-center min-h-[80px]">
                            No games played yet
                        </div>
                    ) : (
                        visibleHistory.map((r, i) => (
                            <div key={i} className="grid grid-cols-[2fr_1fr_1fr] p-[12px] border-b border-[#2d3035] text-[14.4px] text-[#ccc]">
                                <div className="font-mono text-[#888]">{r.time}</div>
                                <div className="text-center">{r.hits}/{r.total}</div>
                                <div className={`text-right ${r.net >= 0 ? 'text-[#39ff14] font-semibold' : 'text-[#ff4444]'}`}>
                                    {r.net >= 0 ? '+' : ''}${r.net.toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {showBackToTop && (
                    <div 
                        className="absolute bottom-[15px] right-[15px] bg-[rgba(58,134,255,0.8)] text-white w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-[601] text-[19.2px]"
                        onClick={scrollToTop}
                    >
                        <ArrowUp size={16} />
                    </div>
                )}
            </div>
        </div>
    );
}
