const slides = document.querySelectorAll('.slide');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas && confettiCanvas.getContext && confettiCanvas.getContext('2d');

function resizeCanvas(){
  if(!confettiCanvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  confettiCanvas.style.width = width + 'px';
  confettiCanvas.style.height = height + 'px';
  confettiCanvas.width = Math.floor(width * dpr);
  confettiCanvas.height = Math.floor(height * dpr);
  // draw in CSS pixels by scaling the context for the device pixel ratio
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let confettiParticles = [];
let confettiAnimating = false;

function random(min, max){ return Math.random() * (max - min) + min; }

function createConfettiParticle(){ const vw = window.innerWidth; const vh = window.innerHeight; return { x: random(0, vw), y: -10, size: random(6, 12), color: ['#ff6b6b','#ffd93d','#6bffa1','#6bb8ff','#d96bff'][Math.floor(random(0,5))], tilt: random(-10,10), tiltSpeed: random(0.1, 0.5), speed: random(2,6), rotation: random(0, 2*Math.PI) }; }

function renderConfetti(){ if(!ctx) return; ctx.clearRect(0,0,window.innerWidth, window.innerHeight); confettiParticles.forEach((p) => { p.x += Math.sin(p.rotation) * 2; p.y += p.speed; p.rotation += 0.05; p.tilt += p.tiltSpeed; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); ctx.restore(); }); confettiParticles = confettiParticles.filter(p => p.y < window.innerHeight + 100); if(confettiAnimating && confettiParticles.length < 200){ for(let i=0;i<5;i++) confettiParticles.push(createConfettiParticle()); } if(confettiAnimating) requestAnimationFrame(renderConfetti); else ctx.clearRect(0,0,window.innerWidth, window.innerHeight); }

function startConfetti(duration=4000){ if(!ctx) return; confettiAnimating = true; confettiParticles = []; for(let i=0;i<120;i++) confettiParticles.push(createConfettiParticle()); renderConfetti(); setTimeout(()=>{ confettiAnimating = false; }, duration); }

const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('active'); const h2 = entry.target.querySelector && entry.target.querySelector('h2'); if(h2 && h2.textContent && h2.textContent.includes('Merci pour 2025')){ startConfetti(7000); } } }); }, { threshold: 0.6 });

slides.forEach(slide => observer.observe(slide));
