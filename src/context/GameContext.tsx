import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { AudioSys } from '../lib/audio';
import { BackendService, CONFIG } from '../lib/backend';

export type HistoryItem = {
    time: string;
    hits: number;
    total: number;
    net: number;
};

export type GameState = {
    balance: number;
    bet: number;
    selected: number[];
    lastSelected: number[];
    lastDrawn: number[];
    isPlaying: boolean;
    isAutoPlaying: boolean;
    pickMode: 'random' | 'manual';
    sliderValue: number;
    history: HistoryItem[];
    isLoggedIn: boolean;
    gameQueue: any[];
    isFetchingBatch: boolean;
    isResultView: boolean;
    statusMsg: string;
    isStatusWarn: boolean;
    isStatusLoading: boolean;
    winAmount: number;
    showWinOverlay: boolean;
    showLoginModal: boolean;
};

type GameContextType = {
    state: GameState;
    setState: React.Dispatch<React.SetStateAction<GameState>>;
    toggleNumber: (num: number) => void;
    clearSelection: () => void;
    changeBet: (dir: number) => void;
    setBetAmount: (amount: number) => void;
    onSliderChange: (val: number) => void;
    toggleAutoPlay: () => void;
    manualPlay: () => void;
    login: () => void;
    deposit: () => void;
    closeWinOverlay: () => void;
    closeLoginModal: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<GameState>({
        balance: 0.00,
        bet: 5.00,
        selected: [],
        lastSelected: [],
        lastDrawn: [],
        isPlaying: false,
        isAutoPlaying: false,
        pickMode: 'random',
        sliderValue: 4,
        history: [],
        isLoggedIn: false,
        gameQueue: [],
        isFetchingBatch: false,
        isResultView: false,
        statusMsg: 'Pick 1-10 Numbers',
        isStatusWarn: false,
        isStatusLoading: false,
        winAmount: 0,
        showWinOverlay: false,
        showLoginModal: false,
    });

    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const updateState = (updates: Partial<GameState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const setStatus = (msg: string, isWarn = false, isLoading = false) => {
        updateState({ statusMsg: msg, isStatusWarn: isWarn, isStatusLoading: isLoading });
    };

    useEffect(() => {
        const init = async () => {
            const remoteConfig = await BackendService.fetchGameConfig();
            if (remoteConfig) {
                if (remoteConfig.paytables) Object.assign(CONFIG.paytables, remoteConfig.paytables);
                if (remoteConfig.betSteps) CONFIG.betSteps = remoteConfig.betSteps;
            }
            
            const status = await BackendService.getUserStatus();
            
            // Generate initial random selection
            const initialSelected: number[] = [];
            while(initialSelected.length < 4) {
                let r = Math.floor(Math.random() * CONFIG.totalNumbers) + 1;
                if(!initialSelected.includes(r)) initialSelected.push(r);
            }

            let initialBet = 5.00;
            if(!CONFIG.betSteps.includes(initialBet)) initialBet = CONFIG.betSteps[0];

            updateState({
                isLoggedIn: status.isLoggedIn,
                balance: status.isLoggedIn ? status.balance : 0,
                selected: initialSelected,
                pickMode: 'random',
                sliderValue: 4,
                bet: initialBet
            });
        };
        init();
    }, []);

    const toggleNumber = (num: number) => {
        const s = stateRef.current;
        if (s.isPlaying) return;
        AudioSys.click();
        updateState({ showWinOverlay: false });
        if (s.isAutoPlaying) stopAutoPlay();

        let newSelected = [...s.selected];

        const idx = newSelected.indexOf(num);
        if (idx > -1) {
            newSelected.splice(idx, 1);
        } else if (newSelected.length < 10) {
            newSelected.push(num);
        }

        updateState({
            pickMode: 'manual',
            sliderValue: 0,
            selected: newSelected
        });
    };

    const clearSelection = () => {
        const s = stateRef.current;
        if (s.isPlaying) return;
        AudioSys.click();
        updateState({ showWinOverlay: false });
        if (s.isAutoPlaying) stopAutoPlay();

        updateState({
            selected: [],
            pickMode: 'manual',
            sliderValue: 0,
            isResultView: false
        });
    };

    const changeBet = (dir: number) => {
        const s = stateRef.current;
        if (s.isPlaying) return;
        AudioSys.click();
        updateState({ showWinOverlay: false });
        
        const steps = CONFIG.betSteps;
        let newBet = s.bet;
        
        if (dir === 1) {
            const nextStep = steps.find(step => step > s.bet);
            if (nextStep !== undefined) newBet = nextStep;
        } else if (dir === -1) {
            const prevSteps = [...steps].reverse();
            const prevStep = prevSteps.find(step => step < s.bet);
            if (prevStep !== undefined) newBet = prevStep;
        }
        
        updateState({ bet: newBet });
    };

    const setBetAmount = (amount: number) => {
        const s = stateRef.current;
        if (s.isPlaying) return;
        updateState({ bet: amount });
    };

    const onSliderChange = (val: number) => {
        const s = stateRef.current;
        AudioSys.click();
        updateState({ showWinOverlay: false });
        if (s.isAutoPlaying) stopAutoPlay();

        if (val === 0) {
            updateState({ pickMode: 'manual', selected: [], sliderValue: 0 });
        } else {
            let newSelected: number[] = [];
            while(newSelected.length < val) {
                let r = Math.floor(Math.random() * CONFIG.totalNumbers) + 1;
                if(!newSelected.includes(r)) newSelected.push(r);
            }
            updateState({
                sliderValue: val,
                pickMode: 'random',
                selected: newSelected,
                isResultView: s.isResultView ? false : s.isResultView // clear result view if randomizing
            });
        }
    };

    const stopAutoPlay = () => {
        updateState({ isAutoPlaying: false });
    };

    const fetchBatch = async (count: number) => {
        const s = stateRef.current;
        if (s.isFetchingBatch) return;
        updateState({ isFetchingBatch: true });
        try {
            const nums = s.selected.length > 0 ? s.selected : s.lastSelected;
            const response = await BackendService.playBatch("user-pid", s.bet, nums, count, s.pickMode, s.sliderValue);
            updateState({ gameQueue: [...stateRef.current.gameQueue, ...response.results] });
        } catch(e) {
            console.error("Batch failed", e);
            stopAutoPlay();
            setStatus("Network Error", true);
        }
        updateState({ isFetchingBatch: false });
    };

    const processAutoPlayQueue = async () => {
        const s = stateRef.current;
        if (!s.isAutoPlaying) {
            updateState({ isPlaying: false });
            setStatus("Auto Play Stopped");
            return;
        }

        if (s.gameQueue.length <= 2 && !s.isFetchingBatch) {
            fetchBatch(10);
        }

        if (s.gameQueue.length === 0) {
            if (s.isFetchingBatch) {
                setStatus("Buffering...", false, true);
                setTimeout(processAutoPlayQueue, 500);
                return;
            } else {
                stopAutoPlay();
                return;
            }
        }

        const newQueue = [...s.gameQueue];
        const result = newQueue.shift();
        updateState({ gameQueue: newQueue });

        let currentSelected = s.selected;
        if (result.usedSelection) {
            currentSelected = [...result.usedSelection];
            updateState({ selected: currentSelected });
        }

        if (s.balance < s.bet) {
            stopAutoPlay();
            deposit();
            return;
        }

        updateState({
            showWinOverlay: false,
            isPlaying: true,
            balance: s.balance - s.bet,
            lastSelected: [...currentSelected],
            lastDrawn: [],
            isResultView: false
        });

        setStatus("Drawing...");

        const drawn = result.drawnNumbers;
        let hits = 0;
        
        let currentDrawn: number[] = [];
        for (let i = 0; i < CONFIG.drawSize; i++) {
            await new Promise(r => setTimeout(r, 40));
            const num = drawn[i];
            AudioSys.pop();
            currentDrawn.push(num);
            if (currentSelected.includes(num)) hits++;
            updateState({ lastDrawn: [...currentDrawn] });
        }
        
        const now = new Date();
        const ts = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const newHistory = [{ time: ts, hits: hits, total: currentSelected.length, net: result.netGain }, ...stateRef.current.history];
        
        updateState({
            balance: stateRef.current.balance + result.winAmount,
            history: newHistory,
            lastDrawn: [...drawn],
            isResultView: true,
            selected: []
        });

        if (result.winAmount > 0) {
            AudioSys.win();
            updateState({ winAmount: result.winAmount, showWinOverlay: true });
            setStatus(`WON $${result.winAmount.toFixed(2)}!`);
        } else {
            setStatus("No match");
        }

        const delay = result.winAmount > 0 ? 3000 : 1000;
        setTimeout(processAutoPlayQueue, delay);
    };

    const startAutoPlay = async () => {
        const s = stateRef.current;
        if (s.sliderValue === 0) {
            AudioSys.error();
            setStatus("⚠ Select Random Amount", true);
            return;
        }
        if (!s.isLoggedIn) {
            updateState({ showLoginModal: true });
            return;
        }

        let newSelected = s.selected;
        if (newSelected.length === 0) {
            newSelected = [];
            while(newSelected.length < s.sliderValue) {
                let r = Math.floor(Math.random() * CONFIG.totalNumbers) + 1;
                if(!newSelected.includes(r)) newSelected.push(r);
            }
        }

        updateState({
            pickMode: 'random',
            selected: newSelected,
            isAutoPlaying: true,
            gameQueue: [],
            lastDrawn: [],
            isResultView: false
        });

        setStatus("Loading Batch...", false, true);
        await fetchBatch(10);
        processAutoPlayQueue();
    };

    const toggleAutoPlay = () => {
        AudioSys.toggle();
        updateState({ showWinOverlay: false });
        if (stateRef.current.isAutoPlaying) stopAutoPlay();
        else startAutoPlay();
    };

    const playSingleRound = async () => {
        const s = stateRef.current;
        if (!s.isLoggedIn) {
            updateState({ showLoginModal: true });
            return;
        }
        if (s.balance < s.bet) {
            deposit();
            return;
        }

        let currentSelected = s.selected;
        if (currentSelected.length === 0 && s.lastSelected.length > 0) {
            currentSelected = [...s.lastSelected];
        }
        
        if (currentSelected.length === 0) {
            AudioSys.error();
            setStatus("⚠ Please select numbers first", true);
            return;
        }

        updateState({
            showWinOverlay: false,
            isPlaying: true,
            balance: s.balance - s.bet,
            lastSelected: [...currentSelected],
            lastDrawn: [],
            isResultView: false,
            selected: currentSelected
        });

        setStatus("Waiting for Blockchain...", false, true);

        try {
            const result = await BackendService.playRound("pid", s.bet, currentSelected);
            
            const drawn = result.drawnNumbers;
            setStatus("Drawing...");
            let hits = 0;
            
            let currentDrawn: number[] = [];
            for (let i = 0; i < CONFIG.drawSize; i++) {
                await new Promise(r => setTimeout(r, 50));
                const num = drawn[i];
                AudioSys.pop();
                currentDrawn.push(num);
                if (currentSelected.includes(num)) hits++;
                updateState({ lastDrawn: [...currentDrawn] });
            }
            
            const now = new Date();
            const ts = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const newHistory = [{ time: ts, hits: hits, total: currentSelected.length, net: result.netGain }, ...stateRef.current.history];

            updateState({
                balance: stateRef.current.balance + result.winAmount,
                history: newHistory,
                lastDrawn: [...drawn],
                isResultView: true,
                selected: []
            });

            if (result.winAmount > 0) {
                AudioSys.win();
                updateState({ winAmount: result.winAmount, showWinOverlay: true });
                setStatus(`WON $${result.winAmount.toFixed(2)}!`);
            } else {
                setStatus("No match");
            }

        } catch (err) {
            console.error(err);
            setStatus("Network Error", true);
            updateState({
                balance: stateRef.current.balance + s.bet,
                selected: currentSelected
            });
        }

        updateState({ isPlaying: false });
    };

    const manualPlay = () => {
        AudioSys.click();
        updateState({ showWinOverlay: false });
        if (stateRef.current.isAutoPlaying) stopAutoPlay();
        playSingleRound();
    };

    const login = async () => {
        const res = await BackendService.login();
        if (res.isLoggedIn) {
            updateState({
                isLoggedIn: true,
                balance: res.balance,
                showLoginModal: false
            });
        }
    };

    const deposit = async () => {
        alert("Insufficient Balance. Please deposit funds via your account dashboard.");
        await BackendService.deposit();
    };

    const closeWinOverlay = () => updateState({ showWinOverlay: false });
    const closeLoginModal = () => updateState({ showLoginModal: false });

    return (
        <GameContext.Provider value={{
            state, setState, toggleNumber, clearSelection, changeBet, setBetAmount, onSliderChange,
            toggleAutoPlay, manualPlay, login, deposit, closeWinOverlay, closeLoginModal
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
