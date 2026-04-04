export const AudioSys = {
    ctx: null as AudioContext | null,
    muted: false,
    init: function() { 
        if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); 
        if (this.ctx.state === 'suspended') this.ctx.resume(); 
    },
    toggleMute: function() { this.muted = !this.muted; return this.muted; },
    playTone: function(f: number, t: OscillatorType, d: number, v=0.1) { 
        if(this.muted) return; 
        if(!this.ctx) this.init(); 
        if(!this.ctx) return;
        const o=this.ctx.createOscillator(), g=this.ctx.createGain(); 
        o.type=t; 
        o.frequency.setValueAtTime(f, this.ctx.currentTime); 
        g.gain.setValueAtTime(v, this.ctx.currentTime); 
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime+d); 
        o.connect(g); 
        g.connect(this.ctx.destination); 
        o.start(); 
        o.stop(this.ctx.currentTime+d); 
    },
    click: function() { this.playTone(800,'sine',0.1,0.05); },
    toggle: function() { this.playTone(600,'triangle',0.1,0.05); },
    error: function() { this.playTone(150, 'sawtooth', 0.2, 0.1); this.playTone(100, 'sawtooth', 0.2, 0.1); },
    pop: function() { 
        if(this.muted)return; 
        if(!this.ctx)this.init(); 
        if(!this.ctx) return;
        const o=this.ctx.createOscillator(),g=this.ctx.createGain(); 
        o.frequency.setValueAtTime(200,this.ctx.currentTime); 
        o.frequency.exponentialRampToValueAtTime(600,this.ctx.currentTime+0.1); 
        g.gain.setValueAtTime(0.1,this.ctx.currentTime); 
        g.gain.linearRampToValueAtTime(0,this.ctx.currentTime+0.1); 
        o.connect(g); 
        g.connect(this.ctx.destination); 
        o.start(); 
        o.stop(this.ctx.currentTime+0.1); 
    },
    win: function() { 
        if(this.muted)return; 
        setTimeout(()=>this.playTone(523.25,'sine',0.4,0.1),0); 
        setTimeout(()=>this.playTone(659.25,'sine',0.4,0.1),100); 
        setTimeout(()=>this.playTone(783.99,'sine',0.8,0.1),200); 
    },
    slide: function() { this.playTone(400,'sine',0.05,0.02); }
};
