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
const partyDate = new Date('2026-08-09T17:00:00+08:00').getTime();
const cdDisplay = document.getElementById('countdownDisplay');
let lastSecond = null;

function renderCountdown(){
  const now = Date.now();
  const diff = partyDate - now;
  if(diff <= 0){
    cdDisplay.innerHTML = '<p class="cd-arrived">✨ The Celebration Has Begun! ✨</p>';
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
    'DTSTART:20260809T090000Z',
    'DTEND:20260809T130000Z',
    "SUMMARY:Jayda Reisse's 7th Birthday",
    'LOCATION:Paragos, Bayambang, Pangasinan',
    'DESCRIPTION:A Whole New World awaits — join us to celebrate Jayda turning 7!',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
}
document.getElementById('addCalBtn').setAttribute('href', buildICS());

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
let lampAudioCtx = null;
function playLampSound(){
  if(!window.AudioContext && !window.webkitAudioContext) return;
  if(!lampAudioCtx){
    lampAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if(lampAudioCtx.state === 'suspended'){
    lampAudioCtx.resume();
  }
  const now = lampAudioCtx.currentTime;
  const gain = lampAudioCtx.createGain();
  gain.gain.setValueAtTime(0.02, now);
  gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  const osc1 = lampAudioCtx.createOscillator();
  const osc2 = lampAudioCtx.createOscillator();
  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(720, now);
  osc1.frequency.linearRampToValueAtTime(520, now + 0.28);
  osc2.frequency.setValueAtTime(1080, now);
  osc2.frequency.linearRampToValueAtTime(760, now + 0.28);

  const oscGain = lampAudioCtx.createGain();
  oscGain.gain.setValueAtTime(0.16, now);
  oscGain.gain.linearRampToValueAtTime(0.08, now + 0.28);

  osc1.connect(oscGain);
  osc2.connect(oscGain);
  oscGain.connect(gain);
  gain.connect(lampAudioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.7);
  osc2.stop(now + 0.7);
}

function openInvite(){
  if(opened) return;
  opened = true;

  // 1. shake the lamp like it's being rubbed
  lampButton.classList.add('shaking');
  lampButton.setAttribute('aria-expanded','true');
  playLampSound();

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

const itemToggleBtn = document.getElementById('itemToggleBtn');
const itemList = document.getElementById('itemList');
if(itemToggleBtn && itemList){
  itemToggleBtn.addEventListener('click', ()=>{
    const expanded = itemList.classList.toggle('expanded');
    itemList.classList.toggle('collapsed', !expanded);
    itemToggleBtn.setAttribute('aria-expanded', expanded);
    itemToggleBtn.textContent = expanded ? 'Hide items' : 'Show items';
  });
}

// Ensure the items list is visible on desktop-sized viewports
function ensureItemListDesktop(){
  try{
    const isDesktop = window.innerWidth >= 781;
    if(isDesktop){
      itemList.classList.add('expanded');
      itemList.classList.remove('collapsed');
      if(itemToggleBtn){ itemToggleBtn.setAttribute('aria-expanded', 'true'); itemToggleBtn.style.display = 'none'; }
    } else {
      // restore toggle visibility on small screens
      if(itemToggleBtn){ itemToggleBtn.style.display = ''; itemToggleBtn.setAttribute('aria-expanded', itemList.classList.contains('expanded') ? 'true' : 'false'); }
    }
  }catch(e){console.warn('ensureItemListDesktop error', e)}
}
window.addEventListener('resize', ensureItemListDesktop);
window.addEventListener('DOMContentLoaded', ensureItemListDesktop);
ensureItemListDesktop();

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', ()=>{
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
    document.querySelectorAll('#attendGroup .radio-pill').forEach(p=>p.classList.remove('selected'));
    pill.classList.add('selected');
    pill.querySelector('input').checked = true;
  });
});

// ---------- RSVP submit ----------
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
rsvpForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  rsvpForm.style.display = 'none';
  rsvpSuccess.style.display = 'block';
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
window.addEventListener('scroll', updateNav, {passive:true});
updateNav();

// Mobile header toggle + header offset handling
const navToggleBtn = document.getElementById('navToggle');
const siteHeader = document.querySelector('.site-header');
function updateHeaderOffset(){
  const h = siteHeader ? siteHeader.offsetHeight : 0;
  document.documentElement.style.setProperty('--site-header-offset', h + 'px');
  document.body.style.paddingTop = h + 'px';
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
