import { useGame } from '../context/GameContext';
import { cn } from '../lib/utils';

export function WinOverlay() {
    const { state, closeWinOverlay } = useGame();

    return (
        <div 
            className={cn(
                "fixed top-1/2 left-1/2 bg-[rgba(40,38,36,0.2)] border-2 border-[#ffd700] backdrop-blur-[4px] p-[20px] sm:p-[30px] rounded-[20px] text-center z-[999] pointer-events-none transition-transform duration-200 ease-out w-[90%] max-w-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center",
                state.showWinOverlay ? "transform -translate-x-1/2 -translate-y-1/2 scale-100" : "transform -translate-x-1/2 -translate-y-1/2 scale-0"
            )}
        >
            <h2 className="text-white m-0 uppercase tracking-[2px] text-[20px] sm:text-[24px]">You Won</h2>
            <div className="text-[clamp(32px,10vw,64px)] text-[#ffd700] font-[900] my-[10px] whitespace-nowrap leading-tight w-full overflow-hidden text-ellipsis">
                ${state.winAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[14.4px] text-[#888] mt-[5px]">
                Tap anywhere to close
            </div>
        </div>
    );
}
