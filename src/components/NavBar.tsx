import { LogOut, Volume2, VolumeX, Bell } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AudioSys } from '../lib/audio';
import { useState } from 'react';

export function NavBar() {
    const [isMuted, setIsMuted] = useState(AudioSys.muted);

    const handleExit = () => {
        if(window.confirm("Return to lobby?")) alert("Navigating to Lobby...");
    };

    const toggleMute = () => {
        const muted = AudioSys.toggleMute();
        setIsMuted(muted);
    };

    return (
        <div className="w-full h-[60px] bg-[#3a3836] flex justify-center px-[20px] sticky top-0 z-[500] shrink-0">
            <div className="w-full max-w-[1280px] flex justify-between items-center h-full">
                <div className="flex items-center flex-1">
                    <button className="bg-transparent border-none text-[#f0f0f0] cursor-pointer p-[8px] flex items-center justify-center hover:opacity-80 transition-opacity" onClick={handleExit}>
                        <LogOut size={24} className="scale-x-[-1]" />
                    </button>
                </div>
                <div className="flex-[2] text-center text-[18px] font-medium text-[#f0f0f0]">
                    Randseed Keno
                </div>
                <div className="flex items-center gap-[16px] flex-1 justify-end">
                    <button className="bg-transparent border-none text-[#f0f0f0] cursor-pointer p-[8px] flex items-center justify-center hover:opacity-80 transition-opacity" onClick={toggleMute}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button className="bg-transparent border-none text-[#f0f0f0] cursor-pointer p-[8px] flex items-center justify-center hover:opacity-80 transition-opacity" onClick={() => alert('Notifications')}>
                        <Bell size={20} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}

