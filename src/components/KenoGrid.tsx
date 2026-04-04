import { useGame } from '../context/GameContext';
import { CONFIG } from '../lib/backend';
import { cn } from '../lib/utils';

export function KenoGrid() {
    const { state, toggleNumber } = useGame();

    const renderBalls = () => {
        const balls = [];
        for (let i = 1; i <= CONFIG.totalNumbers; i++) {
            // Base 3D stylish class
            let ballClass = "aspect-square rounded-[10px] sm:rounded-[24px] text-[#e0e0e0] font-bold cursor-pointer flex items-center justify-center text-[14px] sm:text-[32px] transition-all duration-100 relative border border-[#4a4846] bg-gradient-to-b from-[#3a3836] to-[#2a2826] hover:brightness-110 active:translate-y-[4px] shadow-[0_4px_0_#111,0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] active:shadow-[0_0px_0_#111,0_0px_0px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]";
            
            if (state.selected.includes(i)) {
                // Selected: Vibrant blue 3D
                ballClass = cn(ballClass, "bg-gradient-to-b from-[#3a86ff] to-[#0056b3] text-white border-[#88ccff] z-[100] shadow-[0_4px_0_#003d82,0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(58,134,255,0.6)] active:shadow-[0_0px_0_#003d82,0_0px_0px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3),0_0_15px_rgba(58,134,255,0.6)]");
            } else if (state.isResultView) {
                if (state.lastSelected.includes(i) && state.lastDrawn.includes(i)) {
                    // Hit (Win): Gold 3D
                    ballClass = cn(ballClass, "bg-gradient-to-b from-[#ffe259] to-[#ffa751] text-[#4a2e00] border-[#ffffff] font-[900] z-[10] shadow-[0_4px_0_#b37700,0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.5),0_0_15px_#ffd700] active:shadow-[0_0px_0_#b37700,0_0px_0px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.5),0_0_15px_#ffd700]");
                    if (state.statusMsg.includes("WON")) {
                        ballClass = cn(ballClass, "animate-[winPulse_1.5s_infinite]");
                    }
                } else if (state.lastSelected.includes(i) && !state.lastDrawn.includes(i)) {
                    // Miss: Red 3D
                    ballClass = cn(ballClass, "bg-gradient-to-b from-[#ff416c] to-[#ff4b2b] border-[#ff8888] text-white opacity-90 shadow-[0_4px_0_#800000,0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:shadow-[0_0px_0_#800000,0_0px_0px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]");
                } else if (state.lastDrawn.includes(i)) {
                    // Drawn (Not selected): High contrast white/silver 3D
                    ballClass = cn(ballClass, "bg-gradient-to-b from-[#f8fafc] to-[#cbd5e1] text-[#0f172a] border-[#ffffff] font-[900] z-[5] shadow-[0_4px_0_#94a3b8,0_5px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_10px_rgba(255,255,255,0.4)] active:shadow-[0_0px_0_#94a3b8,0_0px_0px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8),0_0_10px_rgba(255,255,255,0.4)]");
                }
            }

            balls.push(
                <div 
                    key={i} 
                    className={ballClass}
                    onClick={(e) => { e.stopPropagation(); toggleNumber(i); }}
                >
                    {i}
                </div>
            );
        }
        return balls;
    };

    return (
        <div className="bg-[#1e1c1a] p-[10px] sm:p-[20px] rounded-[20px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_4px_15px_rgba(0,0,0,0.3)] border border-[#3e3c3a] mb-[12px] flex justify-center">
            <div className="grid grid-cols-10 max-[480px]:grid-cols-8 gap-[6px] sm:gap-[12px] w-full max-w-[460px] sm:max-w-[920px]">
                {renderBalls()}
            </div>
        </div>
    );
}
