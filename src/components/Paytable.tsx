import { useGame } from '../context/GameContext';
import { CONFIG } from '../lib/backend';
import { cn } from '../lib/utils';

export function Paytable() {
    const { state } = useGame();

    const renderPills = () => {
        const s = state.selected.length > 0 ? state.selected.length : (state.pickMode === 'random' ? state.sliderValue : (state.lastSelected.length || 1));
        const t = CONFIG.paytables[s];
        let wh = -1;
        
        if ((!state.isPlaying || state.isResultView) && state.history.length > 0 && state.history[0].total === s) {
            wh = state.history[0].hits;
        }

        if (!t) return null;

        return Object.keys(t).sort((a, b) => Number(a) - Number(b)).map(h => {
            const m = t[Number(h)];
            const isActive = parseInt(h) === wh;
            
            return (
                <div key={h} className="flex flex-col items-center justify-center bg-transparent p-[2px_5px] rounded-[6px] min-w-[45px]">
                    <span className={cn("text-[16px] font-semibold mb-[4px]", isActive ? "text-[#39ff14]" : "text-white")}>
                        {m}x
                    </span>
                    <div className={cn(
                        "w-[28px] h-[28px] rounded-full flex items-center justify-center text-[16px] font-bold transition-all duration-200 border",
                        isActive 
                            ? "bg-[#39ff14] text-black border-white shadow-[0_0_6px_#39ff14] scale-110" 
                            : "bg-[#3a3836] text-[#888] border-[#4a4846]"
                    )}>
                        {h}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="bg-[#2f2d2b] p-[8px_8px] rounded-[12px] border border-[#3e3c3a] mb-[8px] flex flex-col justify-center min-h-[50px]">
            <div className={cn(
                "text-center text-[20.8px] font-bold mb-[8px] min-h-[1.2em] transition-colors duration-200",
                state.isStatusLoading ? "text-[#88ccff] animate-[pulseText_1s_infinite]" : "text-white",
                state.isStatusWarn ? "text-[#ffaa00] animate-[shake_0.4s]" : ""
            )}>
                {state.statusMsg}
            </div>
            <div className="flex flex-wrap justify-center gap-[8px]">
                {renderPills()}
            </div>
        </div>
    );
}
