import { Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export function Controls() {
    const { state, changeBet, setBetAmount, onSliderChange, clearSelection, toggleAutoPlay, manualPlay } = useGame();

    const [betInput, setBetInput] = useState(state.bet.toString());

    useEffect(() => {
        setBetInput(state.bet.toString());
    }, [state.bet]);

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        val = val.replace(/\D/g, ''); // Only digits
        val = val.replace(/^0+/, ''); // Strip leading zeros
        
        setBetInput(val);
        
        if (val !== '') {
            const num = parseInt(val, 10);
            if (!isNaN(num)) {
                setBetAmount(num);
            }
        }
    };

    const handleBetBlur = () => {
        if (betInput === '' || parseInt(betInput, 10) < 1) {
            setBetInput('1');
            setBetAmount(1);
        } else {
            setBetInput(state.bet.toString());
        }
    };

    return (
        <div className="flex flex-col gap-[8px] mt-[10px] pb-[60px]">
            <div className={cn(
                "flex items-center justify-between bg-[#2f2d2b] p-[5px_15px] rounded-[10px] border h-[50px] transition-all duration-200",
                state.isStatusWarn ? "border-[#ffaa00] shadow-[0_0_10px_rgba(255,170,0,0.3)]" : "border-[#3e3c3a]"
            )}>
                <span className="text-[12.8px] text-[#888] font-semibold uppercase tracking-[0.5px] mr-[10px]">Random</span>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={state.sliderValue}
                    onChange={(e) => onSliderChange(Number(e.target.value))}
                    className={cn(
                        "flex-1 h-full bg-transparent appearance-none cursor-pointer",
                        "[&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-[4px] [&::-webkit-slider-runnable-track]:bg-[#444] [&::-webkit-slider-runnable-track]:rounded-[2px]",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[26px] [&::-webkit-slider-thumb]:w-[26px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:mt-[-11px] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white",
                        state.sliderValue === 0 
                            ? "[&::-webkit-slider-thumb]:bg-[#666] [&::-webkit-slider-thumb]:border-[#888]" 
                            : "[&::-webkit-slider-thumb]:bg-[#3a86ff] [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(58,134,255,0.8)]"
                    )}
                />
                <div className="bg-[#3a3836] w-[40px] h-[32px] rounded-[6px] flex items-center justify-center border border-[#4a4846] ml-[10px]">
                    {state.sliderValue === 0 ? (
                        <span className="text-[#888] text-[12.8px] tracking-[1px]">OFF</span>
                    ) : (
                        <span className="font-bold text-[19.2px] text-[#3a86ff]">{state.sliderValue}</span>
                    )}
                </div>
            </div>

            <div className="flex gap-[6px] items-stretch h-[52px]">
                <div className="flex gap-[2px] bg-[#3a3836] rounded-[10px] p-[2px] shrink-0">
                    <button 
                        className="bg-[#4a4846] text-white w-[28px] sm:w-[35px] rounded-[8px] text-[19.2px] border-none font-semibold cursor-pointer active:scale-95 active:brightness-90 transition-transform disabled:opacity-50"
                        onClick={() => changeBet(-1)}
                        disabled={state.isPlaying}
                    >
                        -
                    </button>
                    <div className="relative flex items-center justify-center w-[60px] sm:w-[80px] bg-transparent">
                        <span className="absolute left-[8px] sm:left-[10px] text-[#ddd] text-[15.2px] font-semibold pointer-events-none">$</span>
                        <input 
                            type="text"
                            value={betInput}
                            onChange={handleBetChange}
                            onBlur={handleBetBlur}
                            disabled={state.isPlaying}
                            className="bg-transparent text-[#ddd] w-full text-[15.2px] border-none font-semibold text-center outline-none pl-[8px] sm:pl-[10px]"
                        />
                    </div>
                    <button 
                        className="bg-[#4a4846] text-white w-[28px] sm:w-[35px] rounded-[8px] text-[19.2px] border-none font-semibold cursor-pointer active:scale-95 active:brightness-90 transition-transform disabled:opacity-50"
                        onClick={() => changeBet(1)}
                        disabled={state.isPlaying}
                    >
                        +
                    </button>
                </div>
                
                <button 
                    className="flex-[1.8] text-white text-[22.4px] font-bold tracking-[1px] rounded-[10px] border-none cursor-pointer shadow-[0_4px_10px_rgba(57,255,20,0.2)] transition-all duration-300 active:scale-95 active:brightness-90 disabled:bg-[#444] disabled:cursor-not-allowed disabled:text-[#888] disabled:shadow-none disabled:opacity-70"
                    style={{ background: state.isPlaying ? '#444' : 'linear-gradient(135deg, #39ff14, #008f09)', textShadow: state.isPlaying ? 'none' : '0 1px 2px rgba(0,0,0,0.3)' }}
                    onClick={manualPlay}
                    disabled={state.isPlaying}
                >
                    PLAY
                </button>
                
                <button 
                    className={cn(
                        "flex-[1.2] text-[15.2px] leading-[1.1] rounded-[10px] border cursor-pointer font-semibold active:scale-95 active:brightness-90 transition-transform",
                        state.isAutoPlaying 
                            ? "bg-[#ff4444] border-[#ff8888] text-white" 
                            : "bg-[#3a3836] text-white border-[#4a4846]"
                    )}
                    onClick={toggleAutoPlay}
                >
                    {state.isAutoPlaying ? "Stop" : "Random Auto"}
                </button>
                
                <button 
                    className="bg-[#3a3836] text-white w-[38px] sm:w-[45px] shrink-0 text-[19.2px] rounded-[10px] border-none cursor-pointer flex items-center justify-center active:scale-95 active:brightness-90 transition-transform"
                    onClick={clearSelection}
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
}
