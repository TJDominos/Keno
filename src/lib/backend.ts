export const CONFIG = {
    totalNumbers: 40,
    drawSize: 10,
    betSteps: [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100], 
    paytables: { 
        1: {1:3.5}, 2: {2:16}, 3: {2:0.5, 3:75}, 4: {3:8, 4:240}, 
        5: {3:3, 4:45, 5:430}, 6: {4:9, 5:330, 6:680}, 
        7: {4:5, 5:80, 6:380, 7:770}, 8: {4:3.5, 5:17, 6:250, 7:550, 8:850}, 
        9: {4:3, 5:8, 6:40, 7:450, 8:750, 9:950}, 10: {4:2.5, 5:6, 6:10, 7:50, 8:450, 9:750, 10:1000} 
    } as Record<number, Record<number, number>>
};

export const BackendService = {
    simulateNetworkDelay: () => new Promise(resolve => setTimeout(resolve, 3500)), 

    fetchGameConfig: async () => { 
        return {
            paytables: CONFIG.paytables,
            betSteps: [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100] 
        }; 
    },

    getUserStatus: async () => {
        return { isLoggedIn: false, pid: null, balance: 0 };
    },

    login: async () => {
        await new Promise(r => setTimeout(r, 1000));
        return { isLoggedIn: true, pid: "user-123", balance: 1000.00 };
    },

    deposit: async () => {
        console.log("Triggering external deposit flow...");
        return { success: true }; 
    },

    playBatch: async (pid: string, betAmount: number, selectedNumbers: number[], batchSize = 10, pickMode = 'manual', randomCount = 0) => {
        console.log(`[Backend] Batch Request: Size=${batchSize}, Mode=${pickMode}`);
        await BackendService.simulateNetworkDelay(); 
        
        const batchResults = [];
        for(let i=0; i<batchSize; i++) {
            let currentSelection = [...selectedNumbers];
            if (pickMode === 'random' && batchSize > 1) {
                currentSelection = [];
                while(currentSelection.length < randomCount) {
                    let r = Math.floor(Math.random() * CONFIG.totalNumbers) + 1;
                    if(!currentSelection.includes(r)) currentSelection.push(r);
                }
            }

            const drawn: number[] = [];
            while(drawn.length < CONFIG.drawSize) { 
                let r = Math.floor(Math.random() * CONFIG.totalNumbers) + 1; 
                if(!drawn.includes(r)) drawn.push(r); 
            }
            
            let hits = 0;
            drawn.forEach(d => { if(currentSelection.includes(d)) hits++; });

            const paytable = CONFIG.paytables[currentSelection.length] || {};
            const multiplier = paytable[hits] || 0;
            const winAmount = betAmount * multiplier;
            const netGain = winAmount - betAmount;

            batchResults.push({
                success: true,
                drawnNumbers: drawn,
                usedSelection: currentSelection,
                hits: hits,
                winAmount: winAmount,
                netGain: netGain
            });
        }
        return { results: batchResults };
    },

    playRound: async (pid: string, betAmount: number, selectedNumbers: number[]) => {
        const res = await BackendService.playBatch(pid, betAmount, selectedNumbers, 1, 'manual');
        return res.results[0];
    }
};
