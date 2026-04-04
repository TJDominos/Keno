/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameProvider } from './context/GameContext';
import { NavBar } from './components/NavBar';
import { GameHeader } from './components/GameHeader';
import { KenoGrid } from './components/KenoGrid';
import { Paytable } from './components/Paytable';
import { Controls } from './components/Controls';
import { WinOverlay } from './components/WinOverlay';
import { LoginModal } from './components/LoginModal';
import { AudioSys } from './lib/audio';
import { useEffect } from 'react';

function GameLayout() {
    useEffect(() => {
        const handleFirstClick = () => {
            AudioSys.init();
            document.body.removeEventListener('click', handleFirstClick);
        };
        document.body.addEventListener('click', handleFirstClick);
        return () => document.body.removeEventListener('click', handleFirstClick);
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
            <NavBar />
            <GameHeader />
            <div className="flex flex-col w-full max-w-[1024px] px-[10px]">
                <KenoGrid />
                <Paytable />
                <Controls />
            </div>
            <WinOverlay />
            <LoginModal />
        </div>
    );
}

export default function App() {
    return (
        <GameProvider>
            <GameLayout />
        </GameProvider>
    );
}
