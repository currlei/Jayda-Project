// ---------- Shared sound engine ----------
const SoundFX = (() => {
  let ctx = null;
  let muted = false;
  let lastPlayed = 0;

  function ensureCtx(){
    if(!window.AudioContext && !window.webkitAudioContext) return null;
    if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Unlock audio on first user interaction (mobile browsers require this)
  ['click','touchstart','keydown'].forEach(evt=>{
    window.addEventListener(evt, ()=>ensureCtx(), {once:true, passive:true});
  });

  // A small "sparkle" chime: 2-3 short detuned tones with quick exponential
  // decay, like the lamp sound, instead of a single flat sine ramp.
  // This is the same recipe that already sounds good for the lamp, scaled down.
  function sparkle(ac, now, {
    freqs = [880, 1320],
    gains = [0.1, 0.06],
    attack = 0.012,
    decay = 0.35,
    type = 'sine',
    detune = 6
  } = {}){
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, now);
      osc.detune.setValueAtTime((i % 2 === 0 ? 1 : -1) * detune, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gains[i] ?? gains[gains.length-1], now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });
  }

  // Minimum gap between any two non-lamp chimes, so quick repeated taps
  // (or rapid scrolling/clicking) can't pile up overlapping audio nodes.
  function throttled(){
    const nowMs = Date.now();
    if(nowMs - lastPlayed < 140) return false;
    lastPlayed = nowMs;
    return true;
  }

  return {
    // Magic lamp open — rich layered shimmer (used by the lamp reveal)
    lampOpen(){
      const ac = ensureCtx();
      if(!ac || muted) return;
      const now = ac.currentTime;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      const osc1 = ac.createOscillator();
      const osc2 = ac.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(720, now);
      osc1.frequency.linearRampToValueAtTime(520, now + 0.28);
      osc2.frequency.setValueAtTime(1080, now);
      osc2.frequency.linearRampToValueAtTime(760, now + 0.28);

      const oscGain = ac.createGain();
      oscGain.gain.setValueAtTime(0.16, now);
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.28);

      osc1.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(gain);
      gain.connect(ac.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);

      // a quick high sparkle layered on top, like glints of light off the lamp
      sparkle(ac, now + 0.05, {freqs:[1760, 2200, 2640], gains:[0.05, 0.035, 0.02], decay:0.5, detune:9});
    },
    // Soft chime for small UI taps (FAQ open/close, RSVP pill select) —
    // a quick two-tone sparkle rather than a flat single-frequency blip.
    softTap(){
      if(muted || !throttled()) return;
      const ac = ensureCtx();
      if(!ac) return;
      sparkle(ac, ac.currentTime, {freqs:[1040, 1560], gains:[0.07, 0.045], decay:0.28, detune:5});
    },
    // Warm rising chime — RSVP success, a small triumphant flourish
    sendChime(){
      if(muted) return;
      const ac = ensureCtx();
      if(!ac) return;
      const now = ac.currentTime;
      sparkle(ac, now, {freqs:[523, 659], gains:[0.12, 0.09], decay:0.4, type:'triangle', detune:4});
      sparkle(ac, now + 0.1, {freqs:[784, 1046, 1318], gains:[0.09, 0.06, 0.04], decay:0.55, detune:7});
    },
    setMuted(value){ muted = value; },
    isMuted(){ return muted; }
  };
})();


// ---------- About Jayda: click-to-load video (avoids loading the file until tapped) ----------
const aboutVideoBox = document.getElementById('aboutVideoBox');
const aboutVideoPlay = document.getElementById('aboutVideoPlay');
if(aboutVideoBox && aboutVideoPlay){
  aboutVideoPlay.addEventListener('click', ()=>{
    const src = aboutVideoBox.getAttribute('data-video-src');
    if(!src) return;
    const video = document.createElement('video');
    video.className = 'about-video';
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.src = src;
    video.addEventListener('error', ()=>{
      // file missing/broken — restore the tap-to-play button instead of a dead video box
      video.remove();
      aboutVideoBox.classList.remove('vp-has-video');
    });
    aboutVideoBox.classList.add('vp-has-video');
    aboutVideoBox.appendChild(video);
    video.play().catch(()=>{ /* ignore autoplay rejection, controls are visible */ });
  });
}

// ---------- Ambient embers ----------
const emberLayer = document.getElementById('emberLayer');
emberLayer.style.position='fixed'; emberLayer.style.inset='0'; emberLayer.style.zIndex='0'; emberLayer.style.pointerEvents='none';
for(let i=0;i<16;i++){
  const e = document.createElement('div');
  e.className='ember';
  const size = 2 + Math.random()*3;
  e.style.width = size+'px';
  e.style.height = size+'px';
  e.style.left = Math.random()*100+'%';
  e.style.top = (60+Math.random()*40)+'%';
  e.style.animationDuration = (10+Math.random()*14)+'s';
  e.style.animationDelay = (Math.random()*14)+'s';
  emberLayer.appendChild(e);
}

// ---------- Countdown ----------
// Counts down to the start of August 9, 2026 (midnight, Manila time) —
// the countdown hits zero right as Jayda's birthday begins, not at the
// party's start time later that day.
const partyDate = new Date('2026-08-09T00:00:00+08:00').getTime();
const cdDisplay = document.getElementById('countdownDisplay');
let lastSecond = null;

function renderCountdown(){
  const now = Date.now();
  const diff = partyDate - now;
  if(diff <= 0){
    cdDisplay.innerHTML = '<p class="cd-arrived">✨ It\'s Jayda\'s Birthday Celebration! ✨</p>';
    return;
  }
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff/(1000*60*60))%24);
  const m = Math.floor((diff/(1000*60))%60);
  const s = Math.floor((diff/1000)%60);
  const tickClass = 'tick';
  cdDisplay.innerHTML = `
    <div class="countdown-grid">
      <div class="cd-unit"><div class="cd-num">${d}</div><div class="cd-label">Days</div></div>
      <div class="cd-unit"><div class="cd-num">${String(h).padStart(2,'0')}</div><div class="cd-label">Hours</div></div>
      <div class="cd-unit"><div class="cd-num">${String(m).padStart(2,'0')}</div><div class="cd-label">Minutes</div></div>
      <div class="cd-unit"><div class="cd-num ${tickClass}">${String(s).padStart(2,'0')}</div><div class="cd-label">Seconds</div></div>
    </div>`;
}
renderCountdown();
setInterval(renderCountdown, 1000);

// ---------- Add to calendar (.ics) ----------
function buildICS(){
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    'DTSTART:20260809T050000Z',
    'DTEND:20260809T090000Z',
    "SUMMARY:Jayda Reisse's 7th Birthday",
    'LOCATION:Paragos, Bayambang, Pangasinan',
    'DESCRIPTION:A Whole New World awaits — join us to celebrate Jayda turning 7!',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
}
document.getElementById('addCalBtn').setAttribute('href', buildICS());

// ---------- Copy venue address ----------
const copyAddressBtn = document.getElementById('copyAddressBtn');
if(copyAddressBtn){
  const venueAddress = 'Paragos, Bayambang, Pangasinan';
  copyAddressBtn.addEventListener('click', async ()=>{
    const originalText = copyAddressBtn.textContent;
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(venueAddress);
      } else {
        // Fallback for older browsers without Clipboard API support
        const ta = document.createElement('textarea');
        ta.value = venueAddress;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      SoundFX.softTap();
      copyAddressBtn.textContent = 'Copied ✓';
    } catch(err){
      console.warn('Copy address failed:', err);
      copyAddressBtn.textContent = 'Copy failed';
    }
    setTimeout(()=>{ copyAddressBtn.textContent = originalText; }, 1800);
  });
}

// ---------- Lamp magic reveal ----------
const lampStage = document.getElementById('lampStage');
const lampButton = document.getElementById('lampButton');
const lampHint = document.getElementById('lampHint');
const inviteCard = document.getElementById('inviteCard');
const smokeWrap = document.getElementById('smokeWrap');
const sevenItems = document.getElementById('seven-items');

function spawnSmoke(){
  for(let i=0;i<7;i++){
    const blob = document.createElement('div');
    blob.className = 'smoke-blob';
    const size = 50 + Math.random()*70;
    blob.style.width = size+'px';
    blob.style.height = size+'px';
    blob.style.left = (-size/2 + (Math.random()*30-15))+'px';
    blob.style.top = (-size/2)+'px';
    const dx = (Math.random()*120-60);
    const dy = -(140 + Math.random()*120);
    const scale = 1.4 + Math.random()*1.4;
    blob.style.setProperty('--sx', dx+'px');
    blob.style.setProperty('--sy', dy+'px');
    blob.style.setProperty('--sscale', scale);
    blob.style.animationDuration = (1.3 + Math.random()*0.6)+'s';
    blob.style.animationDelay = (i*0.05)+'s';
    smokeWrap.appendChild(blob);
    setTimeout(()=>blob.remove(), 2200);
  }
}

function spawnSparkles(){
  const stageRect = lampStage.getBoundingClientRect();
  for(let i=0;i<22;i++){
    const sp = document.createElement('div');
    sp.className = 'sparkle fire';
    const size = 4 + Math.random()*5;
    sp.style.width = size+'px';
    sp.style.height = size+'px';
    const angle = Math.random()*Math.PI*2;
    const dist = 70 + Math.random()*140;
    sp.style.setProperty('--dx', `${Math.cos(angle)*dist}px`);
    sp.style.setProperty('--dy', `${-Math.abs(Math.sin(angle))*dist - 40}px`);
    sp.style.left = (stageRect.width/2) + 'px';
    sp.style.top = (stageRect.height*0.55) + 'px';
    sp.style.animationDelay = (Math.random()*0.25)+'s';
    sp.style.position='absolute';
    lampStage.appendChild(sp);
    setTimeout(()=>sp.remove(), 1700);
  }
}

let opened = false;

function openInvite(){
  if(opened) return;
  opened = true;

  // 1. shake the lamp like it's being rubbed
  lampButton.classList.add('shaking');
  lampButton.setAttribute('aria-expanded','true');
  SoundFX.lampOpen();

  setTimeout(()=>{
    // 2. burst of smoke + sparkles + glow change
    lampStage.classList.add('opened');
    lampHint.style.display = 'none';
    spawnSmoke();
    spawnSparkles();

    // 3. invitation unrolls out of the smoke (if present)
    setTimeout(()=>{
      // a second smaller sparkle burst as the card lands
      spawnSparkles();

      // reveal the invitation (in its own section) and scroll to it
      if(inviteCard){
        inviteCard.classList.add('show');
        setTimeout(()=>{
          inviteCard.scrollIntoView({behavior:'smooth', block:'center'});
        }, 220);
      }
    }, 550);
  }, 600);
}
lampButton.addEventListener('click', openInvite);
lampButton.addEventListener('keydown', (e)=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openInvite(); }
});

// ---------- Seven Symbolic Items accordion ----------
// Each of the 7 categories expands independently, same interaction
// pattern as the FAQ accordion below, so guests only scroll through
// the one group they're looking for instead of all 49 names at once.
document.querySelectorAll('.item-acc-row').forEach(row=>{
  const head = row.querySelector('.item-acc-head');
  const body = row.querySelector('.item-acc-body');
  head.addEventListener('click', ()=>{
    SoundFX.softTap();
    const isOpen = row.classList.contains('open');
    if(isOpen){
      row.classList.remove('open');
      head.setAttribute('aria-expanded', 'false');
      body.style.maxHeight = null;
    } else {
      row.classList.add('open');
      head.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', ()=>{
    SoundFX.softTap();
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other=>{
      if(other!==item){
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    if(isOpen){
      item.classList.remove('open');
      a.style.maxHeight = null;
    } else {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ---------- RSVP radio pills ----------
document.querySelectorAll('#attendGroup .radio-pill').forEach(pill=>{
  pill.addEventListener('click', ()=>{
    SoundFX.softTap();
    document.querySelectorAll('#attendGroup .radio-pill').forEach(p=>p.classList.remove('selected'));
    pill.classList.add('selected');
    pill.querySelector('input').checked = true;

    // Hide "Number of Guests" when someone can't make it — that
    // question doesn't make sense if they're not coming.
    const guestCountRow = document.getElementById('guestCountRow');
    if(guestCountRow){
      guestCountRow.style.display = (pill.dataset.value === 'no') ? 'none' : '';
    }
  });
});

// ---------- RSVP submit ----------
// Paste the Web app URL from your Google Apps Script deployment here.
// See google-apps-script.gs for full setup instructions.
const RSVP_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwDnX2Lk_v8gDt8tXxcEg6EL3rpdqZPsx_NzA9rk6Y4snsc7ihgro6BILo7lryqKT3o/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpError = document.getElementById('rsvpError');

rsvpForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const formData = new FormData(rsvpForm);
  const payload = {
    guestName: formData.get('guestName') || '',
    attending: formData.get('attending') || '',
    guestCount: formData.get('guestCount') || '',
    guestNote: formData.get('guestNote') || ''
  };

  const submitBtn = rsvpForm.querySelector('.submit-btn');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
  if(rsvpError) rsvpError.style.display = 'none';

  const endpointReady = RSVP_ENDPOINT_URL && RSVP_ENDPOINT_URL.indexOf('PASTE_YOUR_WEB_APP_URL_HERE') === -1;

  if(!endpointReady){
    // No endpoint configured yet — still show success locally so the
    // form remains usable while you finish the Google Sheet setup,
    // but flag it clearly in the console for whoever's developing this.
    console.warn('RSVP_ENDPOINT_URL is not set — this response was NOT saved anywhere. See google-apps-script.gs for setup.');
    SoundFX.sendChime();
    rsvpForm.style.display = 'none';
    rsvpSuccess.style.display = 'block';
    return;
  }

  fetch(RSVP_ENDPOINT_URL, {
    method: 'POST',
    // Apps Script web apps don't support custom content-type preflight well
    // from the browser, so text/plain avoids a CORS preflight failure
    // while Apps Script still parses the JSON body fine on its end.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
    .then(()=>{
      SoundFX.sendChime();
      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
    })
    .catch((err)=>{
      console.error('RSVP submission failed:', err);
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Send My RSVP'; }
      if(rsvpError) rsvpError.style.display = 'block';
    });
});

// ---------- Section nav active state ----------
const navLinks = document.querySelectorAll('.section-nav a');
const sections = Array.from(navLinks).map(l=>document.getElementById(l.dataset.target));
function updateNav(){
  let current = sections[0];
  const scrollPos = window.scrollY + window.innerHeight/3;
  sections.forEach(sec=>{
    if(sec && sec.offsetTop <= scrollPos) current = sec;
  });
  navLinks.forEach(l=>{
    l.classList.toggle('active', l.dataset.target === current.id);
  });
}
// Batch scroll-driven work into one rAF callback per frame instead of
// running on every raw scroll event (which can fire dozens of times
// per second during a fast scroll/flick, especially on phones).
let navScrollTicking = false;
window.addEventListener('scroll', ()=>{
  if(navScrollTicking) return;
  navScrollTicking = true;
  requestAnimationFrame(()=>{
    updateNav();
    navScrollTicking = false;
  });
}, {passive:true});
updateNav();

// Mobile header toggle + header offset handling
const navToggleBtn = document.getElementById('navToggle');
const siteHeader = document.querySelector('.site-header');
const navBackdrop = document.getElementById('navBackdrop');
function updateHeaderOffset(){
  const h = siteHeader ? siteHeader.offsetHeight : 0;
  document.documentElement.style.setProperty('--site-header-offset', h + 'px');
  document.body.style.paddingTop = h + 'px';
}
function closeMobileNav(){
  if(siteHeader) siteHeader.classList.remove('open');
}
if(navToggleBtn && siteHeader){
  navToggleBtn.addEventListener('click', ()=>{
    siteHeader.classList.toggle('open');
    // header height may change when opening mobile nav, update after transition
    setTimeout(updateHeaderOffset, 240);
  });
  window.addEventListener('resize', updateHeaderOffset);
  window.addEventListener('load', updateHeaderOffset);
  // initial set
  updateHeaderOffset();

  // Tapping any link in the mobile dropdown closes it automatically,
  // so it doesn't stay open floating over the page after navigating.
  document.querySelectorAll('.site-nav a').forEach(link=>{
    link.addEventListener('click', closeMobileNav);
  });
  // Tapping the dimmed backdrop also closes it, same as tapping outside
  // any standard mobile menu.
  if(navBackdrop){
    navBackdrop.addEventListener('click', closeMobileNav);
  }
  // Catch-all: clicking ANYWHERE outside the open menu closes it — this
  // covers spots the backdrop doesn't reach, like empty header space
  // next to the hamburger button (the header sits above the backdrop
  // in z-index, so clicks there wouldn't otherwise hit the backdrop).
  document.addEventListener('click', (e)=>{
    if(!siteHeader.classList.contains('open')) return;
    const clickedInsideMenu = e.target.closest('.site-nav');
    const clickedToggleBtn = e.target.closest('#navToggle');
    if(!clickedInsideMenu && !clickedToggleBtn){
      closeMobileNav();
    }
  });
}

// ---------- Scroll reveal (IntersectionObserver) ----------
const revealEls = document.querySelectorAll('.reveal, .tl-item');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>io.observe(el));

// stagger children timing inside reveal-stagger containers
document.querySelectorAll('.reveal-stagger').forEach(container=>{
  const children = container.querySelectorAll('.stagger-child');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        children.forEach((child,i)=>{
          setTimeout(()=>child.classList.add('visible'), i*90);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.1});
  obs.observe(container);
});

// Editable names removed — seven items are now static invitation text