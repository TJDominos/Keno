import { useGame } from '../context/GameContext';

export function LoginModal() {
    const { state, login, closeLoginModal } = useGame();

    if (!state.showLoginModal) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[2000] flex items-center justify-center">
            <div className="bg-[#2f2d2b] border border-[#4a4846] p-[25px] rounded-[15px] text-center w-[85%] max-w-[320px]">
                <div className="text-[19.2px] text-white mb-[10px] font-bold">Authentication Required</div>
                <div className="text-[#ccc] mb-[20px] text-[15.2px] break-all">Please sign in to play Randseed Keno.</div>
                <button 
                    className="bg-[#3a86ff] text-white p-[10px_20px] rounded-[8px] w-full mb-[10px] border-none font-semibold cursor-pointer active:scale-95 transition-transform"
                    onClick={login}
                >
                    Sign In
                </button>
                <button 
                    className="bg-transparent border border-[#555] text-[#aaa] p-[10px_20px] rounded-[8px] w-full font-semibold cursor-pointer active:scale-95 transition-transform"
                    onClick={closeLoginModal}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
