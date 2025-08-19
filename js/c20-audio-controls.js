// Generic audio controls wiring for Cambridge 20 pages (sections 1..4)
(function(){
  function byId(id){ return document.getElementById(id); }
  function formatTime(sec){ sec = Math.max(0, Math.floor(sec || 0)); const m = Math.floor(sec/60).toString().padStart(2,'0'); const s = (sec%60).toString().padStart(2,'0'); return `${m} / ${s}`.replace(' / ', ' / '); }

  function wireSection(n){
    const audio = byId(`section${n}-player`);
    if (!audio) return false;
    const btn = byId(`section${n}-play`);
    const prog = byId(`section${n}-progress`);
    const time = byId(`section${n}-time`);
    const speed = byId(`section${n}-speed`);

    if (btn){
      btn.addEventListener('click', function(){
        if (audio.paused) { audio.play().catch(()=>{}); btn.setAttribute('aria-pressed','true'); btn.innerHTML = '<i class="fas fa-pause"></i>'; }
        else { audio.pause(); btn.setAttribute('aria-pressed','false'); btn.innerHTML = '<i class="fas fa-play"></i>'; }
      });
    }
    if (prog){
      prog.addEventListener('input', function(){
        if (audio.duration && !Number.isNaN(audio.duration)){
          audio.currentTime = (audio.duration * Number(prog.value))/100;
        }
      });
    }
    if (speed){
      speed.addEventListener('change', function(){
        const v = parseFloat(speed.value || '1');
        if (!Number.isNaN(v)) audio.playbackRate = v;
      });
    }
    audio.addEventListener('timeupdate', function(){
      try{
        if (prog && audio.duration){ prog.value = String((audio.currentTime / audio.duration) * 100); }
        if (time){ time.textContent = `${new Date(audio.currentTime*1000).toISOString().substr(14,5)} / ${new Date((audio.duration||0)*1000).toISOString().substr(14,5)}`; }
      }catch(_){ }
    });
    audio.addEventListener('ended', function(){
      if (btn){ btn.setAttribute('aria-pressed','false'); btn.innerHTML = '<i class="fas fa-play"></i>'; }
    });
    return true;
  }

  function wireTabs(){
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.addEventListener('click', function(){
        const sectionNum = this.dataset.section;
        document.querySelectorAll('.section-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        this.classList.add('active'); this.setAttribute('aria-selected','true');
        // toggle audio containers
        for (let i=1;i<=4;i++){
          const cont = byId(`section${i}-player-container`) || byId(`audio-section-${i}`);
          if (cont) cont.style.display = (String(i) === String(sectionNum)) ? 'block' : 'none';
        }
        // toggle question containers
        for (let i=1;i<=4;i++){
          const qc = byId(`section${i}-content`);
          if (qc) qc.style.display = (String(i) === String(sectionNum)) ? 'block' : 'none';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    let any = false;
    for (let i=1;i<=4;i++) any = wireSection(i) || any;
    if (any) wireTabs();
  });
})();

