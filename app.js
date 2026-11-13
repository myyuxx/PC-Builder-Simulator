import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const $=id=>document.getElementById(id);

// ==========================================
// 1. สร้าง Procedural Textures & ป้ายชื่อ 3D (Canvas Sprites)
// ==========================================
function createPCBTexture() {
 const canvas = document.createElement('canvas');
 canvas.width = 512; canvas.height = 512;
 const ctx = canvas.getContext('2d');
 ctx.fillStyle = '#0f382e';
 ctx.fillRect(0, 0, 512, 512);
 // เส้นวงจรสีเขียวมรกตและลายทองแดงสดใส
 ctx.strokeStyle = '#1de9b6';
 ctx.lineWidth = 2;
 for (let i = 0; i < 65; i++) {
  ctx.beginPath();
  let x = Math.random() * 512, y = Math.random() * 512;
  ctx.moveTo(x, y);
  for (let j = 0; j < 4; j++) {
   if (Math.random() > 0.5) x += (Math.random() - 0.5) * 110;
   else y += (Math.random() - 0.5) * 110;
   ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
 }
 const tex = new THREE.CanvasTexture(canvas);
 tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
 return tex;
}

function createGamingBoardTexture() {
 const canvas = document.createElement('canvas');
 canvas.width = 512; canvas.height = 512;
 const ctx = canvas.getContext('2d');
 ctx.fillStyle = '#182232';
 ctx.fillRect(0, 0, 512, 512);
 // ลายกราฟิกเกมมิ่งสีฟ้า-แดงบนเมนบอร์ด
 ctx.strokeStyle = '#00e5ff';
 ctx.lineWidth = 3;
 ctx.beginPath(); ctx.moveTo(20, 480); ctx.lineTo(180, 320); ctx.lineTo(480, 320); ctx.stroke();
 ctx.strokeStyle = '#ff4081';
 ctx.lineWidth = 2.5;
 ctx.beginPath(); ctx.moveTo(40, 495); ctx.lineTo(190, 345); ctx.lineTo(490, 345); ctx.stroke();
 // จุดบัดกรีสีทอง
 for (let i = 0; i < 90; i++) {
  ctx.fillStyle = i % 2 === 0 ? '#ffd740' : '#00e5ff';
  ctx.fillRect(Math.random() * 500, Math.random() * 500, 3, 3);
 }
 return new THREE.CanvasTexture(canvas);
}

function createFanTexture(accentColor = '#00e5ff') {
 const canvas = document.createElement('canvas');
 canvas.width = 256; canvas.height = 256;
 const ctx = canvas.getContext('2d');
 ctx.fillStyle = '#1b2636';
 ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.fill();
 // วงแหวนไฟ LED รอบพัดลม
 ctx.strokeStyle = accentColor;
 ctx.lineWidth = 8;
 ctx.beginPath(); ctx.arc(128, 128, 112, 0, Math.PI * 2); ctx.stroke();

 ctx.fillStyle = '#3c526e';
 for (let i = 0; i < 9; i++) {
  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate((i * Math.PI * 2) / 9);
  ctx.beginPath();
  ctx.ellipse(0, -62, 18, 46, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
 }
 ctx.fillStyle = accentColor;
 ctx.beginPath(); ctx.arc(128, 128, 30, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = '#0d1926';
 ctx.beginPath(); ctx.arc(128, 128, 20, 0, Math.PI * 2); ctx.fill();
 return new THREE.CanvasTexture(canvas);
}

function createHeatsinkTexture() {
 const canvas = document.createElement('canvas');
 canvas.width = 128; canvas.height = 128;
 const ctx = canvas.getContext('2d');
 ctx.fillStyle = '#cfd8dc';
 ctx.fillRect(0, 0, 128, 128);
 ctx.fillStyle = '#455a64';
 for (let y = 0; y < 128; y += 6) ctx.fillRect(0, y, 128, 3);
 const tex = new THREE.CanvasTexture(canvas);
 tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
 return tex;
}

// ฟังก์ชันสร้างป้ายชื่อ 3D ลอยเหนืออุปกรณ์ (ชัดเจน อ่านง่าย สีสันสดใส)
function createFloatingLabel(title, subtitle, borderColor = '#00e5ff') {
 const canvas = document.createElement('canvas');
 canvas.width = 512; canvas.height = 140;
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = 'rgba(10, 24, 42, 0.88)';
 ctx.beginPath();
 ctx.roundRect(8, 8, 496, 124, 18);
 ctx.fill();

 ctx.strokeStyle = borderColor;
 ctx.lineWidth = 6;
 ctx.stroke();

 ctx.fillStyle = '#ffffff';
 ctx.font = 'bold 28px Segoe UI, Tahoma, sans-serif';
 ctx.textAlign = 'center';
 ctx.fillText(title, 256, 58);

 ctx.fillStyle = borderColor;
 ctx.font = 'bold 22px Segoe UI, Tahoma, sans-serif';
 ctx.fillText(subtitle, 256, 102);

 const tex = new THREE.CanvasTexture(canvas);
 const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
 const sprite = new THREE.Sprite(mat);
 sprite.scale.set(1.15, 0.32, 1);
 return sprite;
}

const pcbTex = createPCBTexture();
const boardTex = createGamingBoardTexture();
const fanTexCyan = createFanTexture('#00e5ff');
const fanTexOrange = createFanTexture('#ff9100');
const heatsinkTex = createHeatsinkTexture();

// ==========================================
// 2. ระบบเสียงเอฟเฟกต์สังเคราะห์
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);
const backgroundMusic = $('backgroundMusic');
backgroundMusic.volume = 0.25;

function startMysteryMusic() {
 if (audioCtx.state === 'suspended') audioCtx.resume();
 const playRequest = backgroundMusic.play();
 if (playRequest) {
  playRequest.catch(error => {
   const reason = error instanceof Error ? error.message : String(error);
   notify(`เล่นเพลงระหว่างเล่นไม่สำเร็จ: ${reason}`, 'error');
  });
 }
}

function stopMysteryMusic() {
 backgroundMusic.pause();
 backgroundMusic.currentTime = 0;
}

function playSFX(type) {
 if (audioCtx.state === 'suspended') audioCtx.resume();
 if (type === 'celebrate') {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const startTime = audioCtx.currentTime;
  notes.forEach((frequency, index) => {
   const tone = audioCtx.createOscillator();
   const gain = audioCtx.createGain();
   const startAt = startTime + index * 0.14;
   tone.type = 'triangle';
   tone.frequency.setValueAtTime(frequency, startAt);
   tone.connect(gain);
   gain.connect(masterGain);
   gain.gain.setValueAtTime(0.0001, startAt);
   gain.gain.linearRampToValueAtTime(0.18, startAt + 0.025);
   gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.45);
   tone.start(startAt);
   tone.stop(startAt + 0.46);
  });
  return;
 }

 const osc = audioCtx.createOscillator();
 const gain = audioCtx.createGain();
 osc.connect(gain);
 gain.connect(masterGain);
 const now = audioCtx.currentTime;

 if (type === 'click') {
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(650, now);
  osc.frequency.exponentialRampToValueAtTime(1300, now + 0.08);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
  osc.start(now); osc.stop(now + 0.09);
 } else if (type === 'screw') {
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(190, now);
  osc.frequency.linearRampToValueAtTime(340, now + 0.15);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
  osc.start(now); osc.stop(now + 0.16);
 } else if (type === 'error') {
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.setValueAtTime(110, now + 0.12);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  osc.start(now); osc.stop(now + 0.25);
 } else if (type === 'beep') {
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1050, now);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
  osc.start(now); osc.stop(now + 0.22);
 }
}

// ==========================================
// 3. ตั้งค่าฉาก 3D และระบบแสงสตูดิโอสีสันสดใส
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b2b40);
scene.fog = new THREE.Fog(0x1b2b40, 22, 55);

const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2.45, 4.55);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.55;
$('game').appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x5c7694, 2.5);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xe3f2fd, 0.95);
scene.add(ambientLight);

const frontStudioLight = new THREE.DirectionalLight(0xffffff, 3.0);
frontStudioLight.position.set(2, 9, 8);
frontStudioLight.castShadow = true;
frontStudioLight.shadow.mapSize.set(2048, 2048);
scene.add(frontStudioLight);

const sideFillLight = new THREE.DirectionalLight(0x80d8ff, 1.8);
sideFillLight.position.set(-7, 5, 4);
scene.add(sideFillLight);

const caseWorkLight = new THREE.PointLight(0xffffff, 18, 12);
caseWorkLight.position.set(0, 2.9, 0.8);
scene.add(caseWorkLight);

const benchSpotlight = new THREE.PointLight(0xfffde7, 16, 12);
benchSpotlight.position.set(0, 3.2, 1.8);
scene.add(benchSpotlight);

const headLamp = new THREE.PointLight(0xffffff, 8, 8);
camera.add(headLamp);

let lightMode = 2;
function toggleStudioLight() {
 lightMode = (lightMode + 1) % 3;
 const btn = $('btnLight');
 if (lightMode === 2) {
  scene.background.setHex(0x1b2b40);
  scene.fog.color.setHex(0x1b2b40);
  renderer.toneMappingExposure = 1.55;
  hemiLight.intensity = 2.5;
  frontStudioLight.intensity = 3.0;
  caseWorkLight.intensity = 18;
  benchSpotlight.intensity = 16;
  btn.innerText = '[F] แสง: สตูดิโอสว่างใส';
  btn.classList.add('active');
 } else if (lightMode === 1) {
  scene.background.setHex(0x121d2b);
  scene.fog.color.setHex(0x121d2b);
  renderer.toneMappingExposure = 1.25;
  hemiLight.intensity = 1.6;
  frontStudioLight.intensity = 2.0;
  caseWorkLight.intensity = 10;
  benchSpotlight.intensity = 10;
  btn.innerText = '[F] แสง: ปกติ';
  btn.classList.remove('active');
 } else {
  scene.background.setHex(0x080d17);
  scene.fog.color.setHex(0x080d17);
  renderer.toneMappingExposure = 1.15;
  hemiLight.intensity = 0.7;
  frontStudioLight.intensity = 0.9;
  caseWorkLight.intensity = 3;
  benchSpotlight.intensity = 5;
  btn.innerText = '[F] แสง: โชว์ไฟ ARGB';
  btn.classList.remove('active');
 }
}

let partLabelsVisible = false;
function togglePartLabels() {
 partLabelsVisible = !partLabelsVisible;
 benchItems.forEach(({ label }) => { label.visible = partLabelsVisible; });
 const button = $('btnLabels');
 button.innerText = partLabelsVisible ? '🏷️ ซ่อนป้ายชื่อ' : '🏷️ แสดงป้ายชื่อ';
 button.setAttribute('aria-pressed', String(partLabelsVisible));
}

const mats = {
 floor: new THREE.MeshStandardMaterial({ color: 0x263547, roughness: 0.75 }),
 table: new THREE.MeshStandardMaterial({ color: 0x3b4b5e, roughness: 0.45, metalness: 0.15 }),
 caseDark: new THREE.MeshStandardMaterial({ color: 0x222c3a, roughness: 0.35, metalness: 0.6 }),
 metal: new THREE.MeshStandardMaterial({ color: 0xdce4ec, roughness: 0.22, metalness: 0.88 }),
 copper: new THREE.MeshStandardMaterial({ color: 0xff8a50, roughness: 0.25, metalness: 0.85 }),
 gold: new THREE.MeshStandardMaterial({ color: 0xffd740, roughness: 0.2, metalness: 0.95 }),
 pcbGreen: new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.4, metalness: 0.2 }),
 gamingBoard: new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.4, metalness: 0.25 }),
 heatsink: new THREE.MeshStandardMaterial({ map: heatsinkTex, roughness: 0.3, metalness: 0.85 }),
 fanCyan: new THREE.MeshStandardMaterial({ map: fanTexCyan, roughness: 0.35, metalness: 0.2 }),
 fanOrange: new THREE.MeshStandardMaterial({ map: fanTexOrange, roughness: 0.35, metalness: 0.2 }),
 rgbGlow: new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00e5ff, emissiveIntensity: 1.8 }),
 pasteMat: new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.2, metalness: 0.7 }),
 cableBlack: new THREE.MeshStandardMaterial({ color: 0x2b3440, roughness: 0.65, metalness: 0.1 }),
 cableAccent: new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x006064, emissiveIntensity: 0.5, roughness: 0.4 })
};

function box(parent, w, h, d, mat, x, y, z) {
 const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
 o.position.set(x, y, z);
 o.castShadow = true;
 o.receiveShadow = true;
 parent.add(o);
 return o;
}

// ห้องและโต๊ะปฏิบัติการกว้างขวาง
box(scene, 35, 0.2, 35, mats.floor, 0, -0.1, 0);
box(scene, 13, 0.25, 6.2, mats.table, 0, 1.0, 0.2);
for (const x of [-5.8, 5.8]) {
 for (const z of [-2.4, 2.8]) box(scene, 0.24, 1.0, 0.24, mats.metal, x, 0.5, z);
}
// แผ่นรองประกอบสีน้ำเงินเข้มตัดขอบนีออน
box(scene, 5.4, 0.03, 3.0, new THREE.MeshStandardMaterial({ color: 0x10375c, roughness: 0.65 }), 0, 1.14, -0.5);
// แผ่นรองวางอะไหล่สีสดใสตรงหน้าโต๊ะ (Parts Organizer Mat)
box(scene, 9.6, 0.03, 2.1, new THREE.MeshStandardMaterial({ color: 0x152c47, roughness: 0.6 }), 0, 1.14, 2.0);

const monitorCanvas = document.createElement('canvas');
monitorCanvas.width = 1024;
monitorCanvas.height = 640;
const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
monitorTexture.colorSpace = THREE.SRGBColorSpace;
const monitorScreen = new THREE.Mesh(
 new THREE.PlaneGeometry(2.5, 1.48),
 new THREE.MeshBasicMaterial({ map: monitorTexture, toneMapped: false })
);
const monitor = new THREE.Group();
monitor.position.set(4.2, 1.085, -0.65);
scene.add(monitor);
box(monitor, 0.9, 0.08, 0.55, mats.caseDark, 0, 0.08, 0.04);
box(monitor, 0.2, 0.82, 0.16, mats.metal, 0, 0.52, 0);
box(monitor, 2.72, 1.7, 0.15, mats.caseDark, 0, 1.76, 0);
monitorScreen.position.set(0, 1.76, 0.081);
monitor.add(monitorScreen);

function renderMonitor(title, lines, accent = '#00e5ff') {
 const context = monitorCanvas.getContext('2d');
 context.fillStyle = '#071523';
 context.fillRect(0, 0, monitorCanvas.width, monitorCanvas.height);
 context.fillStyle = accent;
 context.fillRect(0, 0, monitorCanvas.width, 14);
 context.fillStyle = '#102b43';
 context.fillRect(0, 14, monitorCanvas.width, 98);
 context.fillStyle = '#ffffff';
 context.font = 'bold 42px Segoe UI, sans-serif';
 context.fillText(title, 48, 78, 920);
 context.font = '28px Segoe UI, sans-serif';
 lines.slice(0, 5).forEach((line, index) => {
  context.fillStyle = index === 0 ? accent : '#c4d9e8';
  context.fillText(line, 56, 184 + index * 76, 910);
 });
 context.fillStyle = accent;
 context.fillRect(56, 574, 912, 4);
 context.fillStyle = '#8299ab';
 context.font = '18px Segoe UI, sans-serif';
 context.fillText('PC BUILDER TECH ACADEMY  •  SYSTEM CONSOLE', 56, 612);
 monitorTexture.needsUpdate = true;
}

function renderWindowsDesktop() {
 const context = monitorCanvas.getContext('2d');
 const { width, height } = monitorCanvas;
 const wallpaper = context.createLinearGradient(0, 0, width, height);
 wallpaper.addColorStop(0, '#071b46');
 wallpaper.addColorStop(0.55, '#075aa6');
 wallpaper.addColorStop(1, '#071b46');
 context.fillStyle = wallpaper;
 context.fillRect(0, 0, width, height);

 const glow = context.createRadialGradient(660, 300, 30, 660, 300, 520);
 glow.addColorStop(0, 'rgba(0, 190, 255, 0.9)');
 glow.addColorStop(0.55, 'rgba(25, 105, 230, 0.48)');
 glow.addColorStop(1, 'rgba(10, 35, 100, 0)');
 context.fillStyle = glow;
 context.fillRect(0, 0, width, height);

 function roundedRect(x, y, w, h, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
  context.fill();
 }

 context.font = '20px Segoe UI, sans-serif';
 context.fillStyle = '#ffffff';
 context.fillText('▣', 42, 70);
 context.font = '14px Segoe UI, sans-serif';
 context.fillText('พีซีเครื่องนี้', 34, 96);
 context.font = '20px Segoe UI, sans-serif';
 context.fillText('♻', 42, 145);
 context.font = '14px Segoe UI, sans-serif';
 context.fillText('ถังรีไซเคิล', 34, 171);

 roundedRect(270, 64, 484, 508, 18, 'rgba(16, 29, 48, 0.94)');
 context.fillStyle = '#ffffff';
 context.font = 'bold 25px Segoe UI, sans-serif';
 context.fillText('เริ่มต้น', 300, 105);
 context.font = '15px Segoe UI, sans-serif';
 context.fillStyle = '#c9d8e8';
 context.fillText('ทั้งหมด  ›', 660, 104);
 roundedRect(298, 121, 428, 38, 9, 'rgba(255,255,255,0.12)');
 context.fillStyle = '#d7e5f4';
 context.font = '15px Segoe UI, sans-serif';
 context.fillText('⌕  ค้นหาแอป การตั้งค่า และเอกสาร', 314, 146);

 context.fillStyle = '#ffffff';
 context.font = 'bold 17px Segoe UI, sans-serif';
 context.fillText('ปักหมุด', 300, 192);
 const pinnedApps = [
  ['E', '#1685d1', 'เบราว์เซอร์'],
  ['▣', '#2878c7', 'ไฟล์'],
  ['⚙', '#607d9b', 'การตั้งค่า'],
  ['✉', '#1688aa', 'จดหมาย'],
  ['▦', '#a654c7', 'รูปถ่าย'],
  ['▶', '#d54848', 'สื่อ'],
  ['N', '#148b73', 'บันทึกย่อ'],
  ['▣', '#d38b23', 'Store']
 ];
 pinnedApps.forEach(([icon, color, label], index) => {
  const column = index % 4;
  const row = Math.floor(index / 4);
  const x = 312 + column * 101;
  const y = 210 + row * 77;
  roundedRect(x + 17, y, 42, 42, 10, color);
  context.fillStyle = '#ffffff';
  context.font = 'bold 22px Segoe UI, sans-serif';
  context.textAlign = 'center';
  context.fillText(icon, x + 38, y + 29);
  context.font = '12px Segoe UI, sans-serif';
  context.fillText(label, x + 38, y + 59);
 });
 context.textAlign = 'left';

 context.fillStyle = '#ffffff';
 context.font = 'bold 17px Segoe UI, sans-serif';
 context.fillText('แนะนำ', 300, 384);
 context.font = '13px Segoe UI, sans-serif';
 context.fillStyle = '#d5e0eb';
 context.fillText('แอปและไฟล์ที่ใช้ล่าสุดจะแสดงที่นี่', 300, 411);
 context.fillText('เริ่มใช้งาน Windows ได้เลย', 300, 440);

 context.fillStyle = '#ffffff';
 context.font = '14px Segoe UI, sans-serif';
 context.fillText('●  ผู้ใช้', 302, 551);
 context.textAlign = 'right';
 context.fillText('⏻', 716, 551);
 context.textAlign = 'left';

 roundedRect(0, 585, width, 55, 0, 'rgba(13, 26, 43, 0.8)');
 roundedRect(376, 593, 42, 38, 8, 'rgba(255,255,255,0.08)');
 context.fillStyle = '#60a5fa';
 context.fillRect(387, 603, 8, 8);
 context.fillRect(398, 603, 8, 8);
 context.fillRect(387, 614, 8, 8);
 context.fillRect(398, 614, 8, 8);
 roundedRect(427, 593, 152, 38, 18, 'rgba(255,255,255,0.1)');
 context.fillStyle = '#e0e8f0';
 context.font = '13px Segoe UI, sans-serif';
 context.fillText('⌕  ค้นหา', 443, 617);
 ['▣', 'E', '▧'].forEach((icon, index) => {
  const x = 598 + index * 48;
  roundedRect(x, 596, 34, 32, 8, ['#2878c7', '#1685d1', '#a654c7'][index]);
  context.fillStyle = '#ffffff';
  context.font = 'bold 18px Segoe UI, sans-serif';
  context.textAlign = 'center';
  context.fillText(icon, x + 17, 618);
 });
 context.textAlign = 'right';
 context.font = '12px Segoe UI, sans-serif';
 context.fillStyle = '#ffffff';
 context.fillText('◖  ◉  ▴', 990, 608);
 const now = new Date();
 context.fillText(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }), 990, 624);
 context.textAlign = 'left';
 monitorTexture.needsUpdate = true;
}

renderMonitor('SYSTEM READY', ['Press POWER to begin diagnostics', 'POST • 3DMark • Windows Setup'], '#00e5ff');

// ==========================================
// 4. โครงสร้างเคส PC และเมนบอร์ดเกมมิ่งรายละเอียดสูง
// ==========================================
const pc = new THREE.Group();
pc.position.set(0, 1.16, -0.65);
scene.add(pc);
const playerRadius = 0.35;
const caseCollisionBounds = {
 minX: pc.position.x - 2.3 - playerRadius,
 maxX: pc.position.x + 2.3 + playerRadius,
 minZ: pc.position.z - 1.3 - playerRadius,
 maxZ: pc.position.z + 1.3 + playerRadius
};
const monitorCollisionBounds = {
 minX: monitor.position.x - 1.36 - playerRadius,
 maxX: monitor.position.x + 1.36 + playerRadius,
 minZ: monitor.position.z - 0.075 - playerRadius,
 maxZ: monitor.position.z + 0.315 + playerRadius
};

box(pc, 4.6, 0.25, 2.6, mats.caseDark, 0, 0.12, 0);
box(pc, 4.6, 3.8, 0.15, mats.caseDark, 0, 2.0, -1.25);
box(pc, 4.6, 0.18, 2.6, mats.caseDark, 0, 3.9, 0);
box(pc, 0.18, 3.8, 2.6, mats.caseDark, -2.25, 2.0, 0);
box(pc, 0.18, 3.8, 2.6, mats.caseDark, 2.25, 2.0, 0);
// Keep the PSU bay clear so the slot and installed unit remain visible.
box(pc, 4.4, 0.12, 2.4, mats.caseDark, 0, 1.12, 0);

// แถบไฟ ARGB บนเพดานเคส
const rgbStripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00e5ff, emissiveIntensity: 2.2 });
box(pc, 4.0, 0.06, 0.12, rgbStripMat, 0, 3.78, 0.6);

const board = new THREE.Group();
board.position.set(-0.35, 2.35, -1.12);
pc.add(board);

// แผ่น PCB เกมมิ่ง + ซิงก์ VRM สีทูโทน + คอนเดนเซอร์
box(board, 3.1, 2.6, 0.08, mats.gamingBoard, 0, 0, 0);
box(board, 0.45, 1.4, 0.35, mats.metal, -1.25, 0.4, 0.18);
box(board, 0.08, 1.2, 0.37, new THREE.MeshStandardMaterial({ color: 0xff1744, emissive: 0xd50000, emissiveIntensity: 0.8 }), -1.15, 0.4, 0.18);
box(board, 1.2, 0.35, 0.3, mats.metal, -0.45, 1.05, 0.15);
box(board, 0.7, 0.65, 0.14, mats.metal, 0.75, -0.75, 0.08);
box(board, 0.16, 0.75, 0.18, mats.metal, 1.38, 0.35, 0.12);
box(board, 0.38, 0.16, 0.18, mats.metal, -1.15, 1.15, 0.12);

// คอนเดนเซอร์สีทองรอบ CPU
for (let i = 0; i < 6; i++) {
 const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 12), mats.gold);
 cap.rotation.x = Math.PI / 2;
 cap.position.set(-0.92, 0.05 + i * 0.15, 0.08);
 board.add(cap);
}

const slotObjects = {};
function makeSlot(id, parent, x, y, z, w, h, d, color = 0x2c526b) {
 const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.45, emissive: 0x000000 });
 const o = box(parent, w, h, d, mat, x, y, z);
 o.userData.slot = id;
 slotObjects[id] = o;
 return o;
}

makeSlot('cpu', board, -0.45, 0.42, 0.09, 0.82, 0.86, 0.08, 0x546e7a);
const cpuLever = box(board, 0.04, 0.85, 0.04, mats.metal, -0.01, 0.42, 0.12);
cpuLever.rotation.x = -0.6;

const coolerMat = new THREE.MeshStandardMaterial({
 color: 0x00b8d4, roughness: 0.4, metalness: 0.4,
 transparent: true, opacity: 0.25, depthWrite: false
});
const coolerSlot = box(board, 1.06, 1.06, 0.08, coolerMat, -0.45, 0.42, 0.14);
coolerSlot.userData.slot = 'cooler';
slotObjects['cooler'] = coolerSlot;

makeSlot('ram', board, 0.55, 0.42, 0.09, 0.52, 1.35, 0.12, 0x37474f);
for (let i = 0; i < 4; i++) {
 box(board, 0.05, 1.32, 0.14, i % 2 === 0 ? mats.metal : mats.caseDark, 0.36 + i * 0.12, 0.42, 0.09);
}

makeSlot('ssd', board, -0.35, -0.22, 0.07, 1.05, 0.28, 0.06, 0x006064);
makeSlot('gpu', board, -0.25, -0.68, 0.1, 1.85, 0.16, 0.16, 0x37474f);
box(board, 1.88, 0.18, 0.15, mats.metal, -0.25, -0.68, 0.09);
makeSlot('psu', pc, -1.35, 0.65, -0.2, 1.55, 0.78, 1.4, 0x263238);

const fanMeshes = [];
function addCaseFan(x, y, z, rotY = 0) {
 const g = new THREE.Group();
 g.position.set(x, y, z);
 g.rotation.y = rotY;
 box(g, 1.05, 1.05, 0.18, mats.caseDark, 0, 0, 0);
 const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.19, 32), mats.fanCyan);
 blade.rotation.x = Math.PI / 2;
 g.add(blade);
 fanMeshes.push(blade);
 pc.add(g);
}
addCaseFan(-2.12, 2.9, -0.2, Math.PI / 2);
addCaseFan(2.12, 2.8, -0.2, Math.PI / 2);
addCaseFan(2.12, 1.65, -0.2, Math.PI / 2);

// ==========================================
// 5. ฐานข้อมูลฮาร์ดแวร์ (กำหนดสีประจำรุ่นให้ดูออกง่ายชัดเจน!)
// ==========================================
const buildPlatforms = {
 'intel-ddr4': { name: 'Intel LGA1700 · DDR4', socket: 'LGA1700', ramType: 'DDR4' },
 'amd-ddr4': { name: 'AMD AM4 · DDR4', socket: 'AM4', ramType: 'DDR4' },
 'intel-ddr5': { name: 'Intel LGA1700 · DDR5', socket: 'LGA1700', ramType: 'DDR5' },
 'legacy-ddr4': { name: 'Intel LGA1151 · DDR4', socket: 'LGA1151', ramType: 'DDR4' }
};
let selectedBuildPlatformId = 'intel-ddr4';

function getPartCompatibility(item) {
 const platform = buildPlatforms[selectedBuildPlatformId];
 if (item.socket && item.socket !== platform.socket) {
  return {
   compatible: false,
   reason: `อุปกรณ์รองรับ Socket ${item.socket} แต่เครื่องนี้ใช้ Socket ${platform.socket}`
  };
 }
 if (item.ramType && item.ramType !== platform.ramType) {
  return {
   compatible: false,
   reason: `แรมเป็น ${item.ramType} แต่เมนบอร์ดเครื่องนี้รองรับ ${platform.ramType}`
  };
 }
 return { compatible: true, reason: `รองรับสเปก ${platform.name}` };
}

const hardwareCatalog = [
 {
  id: 'cpu_i5', slot: 'cpu', name: 'Intel Core i5-12400F', shortLabel: 'CPU i5-12400F',
  tagColor: '#00e5ff', pedestalColor: 0x00b0ff,
  socket: 'LGA1700', wattage: 65, price: 4290, perf: 75,
  specs: 'Socket LGA1700 | 6C/12T | 4.4 GHz | TDP 65W'
 },
 {
  id: 'cpu_ryzen', slot: 'cpu', name: 'AMD Ryzen 5 5600X (Socket AM4)', shortLabel: 'CPU Ryzen 5 (AM4)',
  tagColor: '#ff9100', pedestalColor: 0xff6d00,
  socket: 'AM4', wattage: 65, price: 4590, perf: 76,
  specs: 'Socket AM4 (มีขา Pin ทองด้านล่าง) | 6C/12T | TDP 65W'
 },
 {
  id: 'cpu_i5_8400', slot: 'cpu', name: 'Intel Core i5-8400 (Socket LGA1151)', shortLabel: 'CPU i5-8400 (1151)',
  tagColor: '#b388ff', pedestalColor: 0x7e57c2,
  socket: 'LGA1151', wattage: 65, price: 2490, perf: 58,
  specs: 'Socket LGA1151 | 6C/6T | 4.0 GHz | TDP 65W'
 },
 {
  id: 'cooler_tower', slot: 'cooler', name: 'ID-COOLING SE-214-XT RGB', shortLabel: 'Tower Cooler RGB',
  tagColor: '#00e5ff', pedestalColor: 0x00b8d4,
  socket: 'LGA1700', wattage: 5, price: 690, cooling: 45,
  specs: 'Tower Air Cooler | 4 Copper Heatpipes | พัดลม ARGB | LGA1700'
 },
 {
  id: 'cooler_am4', slot: 'cooler', name: 'AMD Wraith Stealth (Socket AM4)', shortLabel: 'AMD Stock Cooler AM4',
  tagColor: '#ff9100', pedestalColor: 0xff9100,
  socket: 'AM4', wattage: 5, price: 390, cooling: 28,
  specs: 'Stock Cooler | ฐานยึดมาตรฐาน AMD AM4'
 },
 {
  id: 'cooler_old', slot: 'cooler', name: 'Stock Cooler เก่า (Socket 1151)', shortLabel: 'Stock Cooler 1151',
  tagColor: '#ff9100', pedestalColor: 0xff9100,
  socket: 'LGA1151', wattage: 5, price: 250, cooling: 15,
  specs: 'ขายึดเฉพาะ Socket LGA1151'
 },
 {
  id: 'ram_ddr4', slot: 'ram', name: 'Corsair Vengeance RGB 16GB DDR4', shortLabel: 'RAM 16GB DDR4',
  tagColor: '#00e676', pedestalColor: 0x00c853,
  ramType: 'DDR4', wattage: 6, price: 1450, perf: 20,
  specs: 'DDR4 Dual Channel (8GBx2) | 3200 MT/s | ไฟ ARGB'
 },
 {
  id: 'ram_ddr5', slot: 'ram', name: 'Kingston Fury Beast 16GB DDR5', shortLabel: 'RAM 16GB DDR5',
  tagColor: '#ff4081', pedestalColor: 0xf50057,
  ramType: 'DDR5', wattage: 8, price: 2390, perf: 30,
  specs: 'DDR5 Memory | ตำแหน่งร่องบาก (Notch) ไม่ตรงกับ DDR4'
 },
 {
  id: 'ssd_nvme', slot: 'ssd', name: 'WD Black SN770 1TB M.2 NVMe', shortLabel: 'SSD M.2 1TB NVMe',
  tagColor: '#ea80fc', pedestalColor: 0xaa00ff,
  interface: 'M.2', wattage: 5, price: 2490, perf: 25,
  specs: 'M.2 2280 | PCIe Gen4 x4 NVMe | ความเร็ว 5,150 MB/s'
 },
 {
  id: 'gpu_rtx3060', slot: 'gpu', name: 'NVIDIA GeForce RTX 3060 12GB', shortLabel: 'RTX 3060 12GB',
  tagColor: '#69f0ae', pedestalColor: 0x00e676,
  interface: 'PCIe x16', wattage: 170, price: 8900, perf: 85,
  specs: 'PCIe 4.0 x16 | 12GB GDDR6 | TDP 170W'
 },
 {
  id: 'gpu_rtx4090', slot: 'gpu', name: 'NVIDIA GeForce RTX 4090 24GB', shortLabel: 'RTX 4090 24GB',
  tagColor: '#ffd740', pedestalColor: 0xffab00,
  interface: 'PCIe x16', wattage: 450, price: 62900, perf: 195,
  specs: 'PCIe 4.0 x16 | 24GB GDDR6X | TDP 450W (ต้องการ PSU 750W+)'
 },
 {
  id: 'psu_450w', slot: 'psu', name: 'Generic PSU 450W (กำลังไฟต่ำ)', shortLabel: 'PSU 450W',
  tagColor: '#ff8a80', pedestalColor: 0xd50000,
  maxWatt: 450, wattage: 0, price: 890,
  specs: '450W Non-Modular | จ่ายไฟได้สูงสุด 450W'
 },
 {
  id: 'psu_850w', slot: 'psu', name: 'Corsair RM850e 850W 80+ Gold', shortLabel: 'PSU 850W Gold',
  tagColor: '#ffd740', pedestalColor: 0xffd600,
  maxWatt: 850, wattage: 0, price: 4190,
  specs: '850W Full Modular | 80 PLUS Gold | สายถักสีสดใส'
 }
];

// ==========================================
// 6. สร้างโมเดล 3D ที่มีสีสันโดดเด่นและรายละเอียดชัดเจน
// ==========================================
function createDetailedMesh(item) {
 const g = new THREE.Group();
 if (item.slot === 'cpu') {
  const pcbMat = item.socket === 'LGA1700'
   ? mats.pcbGreen
   : new THREE.MeshStandardMaterial({ color: 0x1b5e20, map: pcbTex, roughness: 0.4 });
  box(g, 0.72, 0.76, 0.04, pcbMat, 0, 0, 0);
  box(g, 0.56, 0.62, 0.05, mats.metal, 0, 0, 0.035);
  const accentColor = item.socket === 'LGA1700'
   ? 0x00b0ff
   : item.socket === 'AM4' ? 0xff6d00 : 0x7e57c2;
  const glowColor = item.socket === 'LGA1700'
   ? 0x004d40
   : item.socket === 'AM4' ? 0xbf360c : 0x4527a0;
  const brandStripe = new THREE.MeshStandardMaterial({
   color: accentColor,
   emissive: glowColor,
   emissiveIntensity: 0.4
  });
  box(g, 0.44, 0.14, 0.015, brandStripe, 0, 0.16, 0.062);
  if (item.socket === 'AM4') {
   box(g, 0.64, 0.64, 0.03, mats.gold, 0, 0, -0.025);
  }
 }
 if (item.slot === 'cooler') {
  if (item.id === 'cooler_tower') {
   box(g, 0.95, 0.85, 0.55, mats.heatsink, 0, 0, 0.35);
   // ฝาครอบบนฮีตซิงก์สีดำตัดขอบนีออน
   box(g, 0.97, 0.87, 0.05, mats.caseDark, 0, 0, 0.64);
   for (const x of [-0.25, -0.08, 0.08, 0.25]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.94, 12), mats.copper);
    pipe.position.set(x, 0, 0.35);
    g.add(pipe);
   }
   box(g, 0.95, 0.95, 0.16, mats.caseDark, 0, 0, 0.72);
   const fBlade = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.17, 24), mats.fanCyan);
   fBlade.rotation.x = Math.PI / 2;
   fBlade.position.set(0, 0, 0.72);
   g.add(fBlade);
  } else {
   const hs = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24), mats.heatsink);
   hs.rotation.x = Math.PI / 2; hs.position.set(0, 0, 0.2); g.add(hs);
   const fBlade = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24), mats.fanOrange);
   fBlade.rotation.x = Math.PI / 2; fBlade.position.set(0, 0, 0.4); g.add(fBlade);
  }
 }
 if (item.slot === 'ram') {
  for (let i = 0; i < 2; i++) {
   const xOff = -0.08 + i * 0.24;
   const shroudMat = item.ramType === 'DDR4'
    ? new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 })
    : new THREE.MeshStandardMaterial({ color: 0x4a148c, roughness: 0.3, metalness: 0.7 });
   box(g, 0.075, 1.32, 0.34, shroudMat, xOff, 0, 0.12);
   const barColor = item.ramType === 'DDR5'
    ? new THREE.MeshStandardMaterial({ color: 0xff4081, emissive: 0xff1744, emissiveIntensity: 1.8 })
    : new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00c853, emissiveIntensity: 1.8 });
   box(g, 0.08, 1.3, 0.06, barColor, xOff, 0, 0.3);
   box(g, 0.03, 1.26, 0.06, mats.gold, xOff, 0, -0.05);
  }
 }
 if (item.slot === 'ssd') {
  box(g, 0.98, 0.24, 0.03, mats.pcbBlack, 0, 0, 0);
  // สติกเกอร์สีม่วง-ส้ม WD Black / NVMe
  box(g, 0.65, 0.2, 0.015, new THREE.MeshStandardMaterial({ color: 0x6a1b9a, emissive: 0x4a148c, emissiveIntensity: 0.4 }), 0.08, 0, 0.02);
  box(g, 0.22, 0.2, 0.02, mats.gold, -0.34, 0, 0.02);
 }
 if (item.slot === 'gpu') {
  const isBig = item.id === 'gpu_rtx4090';
  const len = isBig ? 2.45 : 1.95;
  const thick = isBig ? 0.52 : 0.38;
  const fans = isBig ? 3 : 2;
  const bodyMat = isBig
   ? new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.25, metalness: 0.8 })
   : new THREE.MeshStandardMaterial({ color: 0x1c2836, roughness: 0.3, metalness: 0.7 });
  box(g, len, thick, 1.05, bodyMat, 0.2, -0.1, 0.52);
  box(g, len, 0.04, 1.05, mats.metal, 0.2, thick / 2 - 0.08, 0.52);
  // แถบไฟ GeForce RTX สีเขียว/ทองด้านข้างการ์ดจอ
  const accentMat = isBig
   ? new THREE.MeshStandardMaterial({ color: 0xffd740, emissive: 0xffab00, emissiveIntensity: 1.6 })
   : new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00c853, emissiveIntensity: 1.6 });
  box(g, len * 0.85, 0.06, 0.04, accentMat, 0.2, -0.05, 1.05);

  for (let i = 0; i < fans; i++) {
   const xPos = (0.2 - len / 2 + 0.45) + i * ((len - 0.9) / Math.max(1, fans - 1));
   const f = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24), isBig ? mats.fanOrange : mats.fanCyan);
   f.position.set(xPos, -thick / 2 - 0.1, 0.52);
   g.add(f);
  }
 }
 if (item.slot === 'psu') {
  box(g, 1.5, 0.75, 1.35, mats.caseDark, 0, 0, 0);
  // ฉลากข้าง PSU สีเหลืองทอง (80+ Gold) หรือสีแดง (450W)
  const labelMat = item.maxWatt >= 850
   ? new THREE.MeshStandardMaterial({ color: 0xffd740, emissive: 0xffab00, emissiveIntensity: 0.4 })
   : new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xd50000, emissiveIntensity: 0.4 });
  box(g, 1.1, 0.42, 0.02, labelMat, 0, 0, 0.68);
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 24), mats.metal);
  grille.position.set(0, 0.38, 0); g.add(grille);
  const portColor = item.maxWatt >= 850 ? mats.gold : mats.metal;
  for (let r = 0; r < 2; r++) {
   for (let c = 0; c < 4; c++) {
    box(g, 0.05, 0.16, 0.18, portColor, 0.76, -0.12 + r * 0.24, -0.35 + c * 0.24);
   }
  }
 }
 return g;
}

const pasteBlob = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.025, 20), mats.pasteMat);
pasteBlob.rotation.x = Math.PI / 2;
pasteBlob.position.set(-0.45, 0.42, 0.18);
pasteBlob.visible = false;
board.add(pasteBlob);

const screwMeshes = {};
function makeScrew(id, parent, x, y, z) {
 const s = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.045, 16), mats.gold);
 s.rotation.x = Math.PI / 2;
 s.position.set(x, y, z);
 s.visible = false;
 parent.add(s);
 screwMeshes[id] = s;
}
makeScrew('ssd', board, 0.14, -0.22, 0.12);
makeScrew('gpu', board, -1.25, -0.68, 0.22);
makeScrew('psu', pc, -2.0, 0.85, 0.5);

const cableGroup = new THREE.Group();
pc.add(cableGroup);
function buildCables() {
 cableGroup.clear();
 const addTube = (pts, radius, mat) => {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), mat);
  cableGroup.add(mesh);
 };
 addTube([[-1.2, 0.8, -0.7], [1.35, 1.2, -0.9], [1.35, 2.7, -0.85], [1.03, 2.7, -0.95]], 0.065, mats.cableBlack);
 addTube([[-1.2, 0.82, -0.7], [1.38, 1.22, -0.88], [1.38, 2.72, -0.83], [1.03, 2.72, -0.93]], 0.028, mats.cableAccent);
 addTube([[-1.5, 0.8, -0.9], [-1.75, 2.5, -1.0], [-1.5, 3.5, -0.95]], 0.045, mats.cableBlack);
 addTube([[-1.1, 0.85, -0.4], [-0.4, 1.15, -0.2], [-0.2, 1.65, -0.35]], 0.045, mats.cableAccent);
}
cableGroup.visible = false;

// ==========================================
// 7. แท่นโชว์อะไหล่เรืองแสงบนโต๊ะ + ป้ายชื่อ 3D (เด่นชัดมองออกทันที!)
// ==========================================
const benchGroup = new THREE.Group();
scene.add(benchGroup);
const benchItems = []; // เก็บข้อมูลเพื่อทำอนิเมชันลอยหมุนโชว์

hardwareCatalog.forEach((item, idx) => {
 const row = Math.floor(idx / 6);
 const col = idx % 6;
 const px = -3.6 + col * 1.44;
 const pz = 1.48 + row * 1.05;

 // 1) ฐานแท่นวางอะไหล่สีเข้มขอบเรืองแสงตามสีหมวดหมู่
 const pedestal = new THREE.Group();
 pedestal.position.set(px, 1.17, pz);
 box(pedestal, 1.18, 0.04, 0.82, mats.caseDark, 0, 0, 0);
 const rimMat = new THREE.MeshStandardMaterial({
  color: item.pedestalColor,
  emissive: item.pedestalColor,
  emissiveIntensity: 0.9
 });
 box(pedestal, 1.22, 0.02, 0.86, rimMat, 0, -0.01, 0);
 scene.add(pedestal);

 // 2) ตัวโมเดล 3D ของอุปกรณ์ (ขยายใหญ่ขึ้นและยกเอียง 35 องศาให้เห็นหน้าตาชัดๆ)
 const m = createDetailedMesh(item);
 m.position.set(px, 1.42, pz);
 m.scale.set(0.52, 0.52, 0.52);
 m.rotation.x = -Math.PI / 3;
 m.userData.itemId = item.id;
 benchGroup.add(m);

 // 3) ป้ายชื่อ 3D ลอยเหนืออุปกรณ์ (บอกชื่อรุ่นและราคา)
 const label = createFloatingLabel(
  item.shortLabel,
  `${item.price.toLocaleString()} ฿`,
  item.tagColor
 );
 label.position.set(px, 1.82, pz);
 label.visible = false;
 scene.add(label);

 benchItems.push({
  id: item.id,
  mesh: m,
  label: label,
  baseY: 1.42,
  phase: idx * 0.7
 });
});

// ==========================================
// 8. สถานะของเกม & อนิเมชัน
// ==========================================
const installedSlots = {};
const installedMeshes = {};
const animations = [];

const assemblyState = {
 thermalPaste: false,
 screwed: { ssd: false, gpu: false, psu: false },
 cablesConnected: false
};

let selectedId = null;
let heldItem = null;
let activeTool = null;
let score = 0;
let windowsInstallComplete = false;
let repairChallengeComplete = false;
let windowsCurrentStep = 0;
let windowsAnswers = [];
let windowsAnswerSelections = [];
let running = false;
let isZoomed = false;
let yaw = 0, pitch = -0.18;
const keys = {};
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

const heldGroup = new THREE.Group();
camera.add(heldGroup);
scene.add(camera);

const slotNames = {
 cpu: 'CPU',
 cooler: 'CPU Cooler',
 ram: 'RAM',
 ssd: 'SSD (M.2)',
 gpu: 'GPU (PCIe x16)',
 psu: 'PSU (Power Supply)'
};

function syncBuildPlatformSelectors() {
 $('platformSelect').value = selectedBuildPlatformId;
 $('settingsPlatformSelect').value = selectedBuildPlatformId;
}

function renderPlatformStatus() {
 const platform = buildPlatforms[selectedBuildPlatformId];
 const status = `เครื่อง ${platform.name} · Socket ${platform.socket} · RAM ${platform.ramType}`;
 $('platformStatus').innerText = status;
 $('settingsPlatformStatus').innerText = status;
}

function selectBuildPlatform(platformId) {
 if (!buildPlatforms[platformId]) {
  syncBuildPlatformSelectors();
  notify('ไม่พบสเปกเครื่องที่เลือก', 'error');
  return;
 }
 if (platformId === selectedBuildPlatformId) return;

 const hasProgress = running || score > 0 || Object.keys(installedSlots).length > 0;
 if (hasProgress && !window.confirm('การเปลี่ยนสเปกเครื่องจะเริ่มประกอบใหม่และล้างความคืบหน้าปัจจุบัน ต้องการดำเนินการต่อหรือไม่?')) {
  syncBuildPlatformSelectors();
  return;
 }

 selectedBuildPlatformId = platformId;
 syncBuildPlatformSelectors();
 if (hasProgress) resetGame(true);
 else renderInventory();
 const platform = buildPlatforms[selectedBuildPlatformId];
 renderMonitor('PC CONFIGURATION', [`Socket: ${platform.socket}`, `Memory: ${platform.ramType}`, 'เลือกอะไหล่ให้ตรงกับสเปกเครื่อง'], '#00e5ff');
 if (running) notify(`เปลี่ยนเป็นเครื่อง ${platform.name} แล้ว เริ่มประกอบใหม่ได้เลย`, 'success');
}

let messageTimer;
function notify(text, type = 'normal') {
 const el = $('message');
 clearTimeout(messageTimer);
 el.innerText = text;
 el.className = type;
 el.hidden = false;
 messageTimer = setTimeout(() => {
  el.hidden = true;
 }, 4500);
}

function updateScoreAndBudget() {
 let totalCost = 0;
 Object.values(installedSlots).forEach(it => totalCost += it.price);
 const budgetColor = totalCost > 24000 ? '#ff5252' : '#64ffda';
 $('score').innerHTML = `คะแนน: ${score} | งบที่ใช้: <span style="color:${budgetColor}">${totalCost.toLocaleString()} / 24,000 ฿</span>`;
}

function clearToolButtons() {
 ['btnPaste', 'btnScrew', 'btnCable'].forEach(id => $(id).classList.remove('active'));
}

function getRaycastTargetSlots() {
 return Object.values(slotObjects).filter(obj => {
  const s = obj.userData.slot;
  if (s === 'cooler') {
   return (heldItem && heldItem.slot === 'cooler') || !!installedSlots.cooler;
  }
  return true;
 });
}

function equipTool(tool) {
 heldItem = null;
 selectedId = null;
 activeTool = tool;
 clearToolButtons();
 heldGroup.clear();

 if (tool === 'paste') {
  $('btnPaste').classList.add('active');
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 16), mats.metal);
  tube.rotation.x = Math.PI / 3;
  tube.position.set(0.35, -0.25, -0.75);
  heldGroup.add(tube);
  $('details').innerHTML = `
   <b style="color:#ffd740">หลอดซิลิโคนระบายความร้อน (Thermal Paste)</b>
   <p style="font-size:12px">เล็งไปที่ <b>กระดอง CPU ที่ติดตั้งแล้ว</b> และกด <b>[E]</b> เพื่อหยดซิลิโคนก่อนติดตั้งพัดลมระบายความร้อน</p>
  `;
  notify('ถือหลอดซิลิโคนแล้ว — เล็งที่ CPU บนเมนบอร์ดแล้วกด [E]');
 } else if (tool === 'screwdriver') {
  $('btnScrew').classList.add('active');
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 12), mats.metal);
  shaft.rotation.x = Math.PI / 2.5;
  shaft.position.set(0.35, -0.25, -0.75);
  heldGroup.add(shaft);
  $('details').innerHTML = `
   <b style="color:#ffd740">ไขควงแม่เหล็ก (Magnetic Screwdriver)</b>
   <p style="font-size:12px">เล็งไปที่ <b>SSD, GPU หรือ PSU</b> ที่วางลงช่องแล้ว และกด <b>[E]</b> เพื่อขันน็อตยึดให้แน่น</p>
  `;
  notify('ถือไขควงแล้ว — เล็งที่ SSD, GPU หรือ PSU ที่ติดตั้งแล้วกด [E] เพื่อขันน็อต');
 } else if (tool === 'cables') {
  $('btnCable').classList.add('active');
  $('details').innerHTML = `
   <b style="color:#ffd740">ชุดสายไฟ Modular PSU Cables</b>
   <p style="font-size:12px">เล็งไปที่ <b>ตัวเครื่อง PC หรือ PSU</b> แล้วกด <b>[E]</b> เพื่อเดินสายไฟ 24-Pin, CPU 8-Pin และ PCIe ให้ครบวงจร</p>
  `;
  notify('ถือชุดสายไฟแล้ว — เล็งที่เคส PC หรือ PSU แล้วกด [E] เพื่อเชื่อมต่อสายไฟ');
 }
 renderInventory();
}
function useActiveTool() {
 raycaster.setFromCamera(center, camera);
 const hits = raycaster.intersectObjects(getRaycastTargetSlots(), false);

 if (activeTool === 'paste') {
  if (!installedSlots.cpu) {
   playSFX('error');
   notify('❌ ต้องติดตั้ง CPU ลงใน Socket ก่อนจึงจะทาซิลิโคนได้!', 'error');
   return;
  }
  if (installedSlots.cooler) {
   playSFX('error');
   notify('⚠️ คุณติดตั้ง Cooler ทับไปแล้ว! กด [R] ถอด Cooler ออกก่อนถ้าลืมทาซิลิโคน', 'error');
   return;
  }
  if (hits.length && (hits[0].object.userData.slot === 'cpu' || hits[0].object.userData.slot === 'cooler')) {
   assemblyState.thermalPaste = true;
   pasteBlob.visible = true;
   playSFX('click');
   score += 50;
   notify('✅ หยดซิลิโคนระบายความร้อนบน CPU เรียบร้อย! (+50 คะแนน) ขั้นต่อไปติดตั้ง CPU Cooler ได้', 'success');
   renderProgress();
   updateScoreAndBudget();
  } else {
   notify('กรุณาเล็งเป้าไปที่ตัว CPU บนเมนบอร์ดแล้วกด [E]');
  }
 } else if (activeTool === 'screwdriver') {
  if (!hits.length) {
   notify('กรุณาเล็งไขควงไปที่ SSD, GPU หรือ PSU ที่ติดตั้งอยู่');
   return;
  }
  const s = hits[0].object.userData.slot;
  if (!['ssd', 'gpu', 'psu'].includes(s)) {
   notify('ชิ้นส่วนนี้ใช้ระบบสลักล็อก (ไม่ต้องใช้ไขควงขันน็อต)');
   return;
  }
  if (!installedSlots[s]) {
   playSFX('error');
   notify(`❌ ยังไม่ได้วาง ${s.toUpperCase()} ลงในช่อง`, 'error');
   return;
  }
  if (assemblyState.screwed[s]) {
   notify(`ขันน็อตยึด ${s.toUpperCase()} แน่นเรียบร้อยแล้ว`);
   return;
  }
  assemblyState.screwed[s] = true;
  screwMeshes[s].visible = true;
  playSFX('screw');
  score += 50;
  notify(`🔩 ขันน็อตยึด ${s.toUpperCase()} แน่นหนาเรียบร้อย! (+50 คะแนน)`, 'success');
  renderProgress();
  updateScoreAndBudget();
 } else if (activeTool === 'cables') {
  if (!installedSlots.psu) {
   playSFX('error');
   notify('❌ ต้องติดตั้ง Power Supply (PSU) ก่อนจึงจะเดินสายไฟได้!', 'error');
   return;
  }
  if (assemblyState.cablesConnected) {
   notify('เชื่อมต่อสายไฟทั้งระบบครบเรียบร้อยแล้ว');
   return;
  }
  assemblyState.cablesConnected = true;
  buildCables();
  cableGroup.visible = true;
  playSFX('click');
  score += 100;
  notify('🔌 เดินสายไฟ 24-Pin ATX, CPU 8-Pin และ PCIe 8-Pin สำเร็จ! (+100 คะแนน)', 'success');
  renderProgress();
  updateScoreAndBudget();
 }
}

function renderInventory() {
 const inv = $('inventory');
 inv.innerHTML = '';
 renderPlatformStatus();
 ['cpu', 'cooler', 'ram', 'ssd', 'gpu', 'psu'].forEach(cat => {
  const title = document.createElement('div');
  title.className = 'cat-title';
  title.innerText = slotNames[cat];
  inv.appendChild(title);

  hardwareCatalog.filter(x => x.slot === cat).forEach(item => {
   const isInstalled = installedSlots[cat]?.id === item.id;
   const compatibility = getPartCompatibility(item);
   const div = document.createElement('div');
   div.className = 'part' +
    (selectedId === item.id ? ' active' : '') +
    (isInstalled ? ' installed' : '') +
    (!compatibility.compatible ? ' incompatible' : '');
   div.style.borderLeftColor = compatibility.compatible ? item.tagColor : '#ff9100';
   div.innerHTML = `
    <b>${item.name}</b>
    <small>${item.price.toLocaleString()} ฿ ${isInstalled ? '• [ติดตั้งแล้ว]' : ''}</small>
    ${compatibility.compatible ? '' : '<small>⚠ ไม่รองรับสเปกเครื่องนี้</small>'}
   `;
   div.onclick = () => selectItem(item.id);
   inv.appendChild(div);
  });
 });
 renderProgress();
 updateScoreAndBudget();
}

function selectItem(id) {
 activeTool = null;
 clearToolButtons();
 selectedId = id;
 const item = hardwareCatalog.find(x => x.id === id);
 const compatibility = getPartCompatibility(item);
 $('details').innerHTML = `
  <b style="color:${item.tagColor};font-size:15px">${item.name}</b>
  <div style="margin:6px 0">
   <span class="spec-badge">${slotNames[item.slot]}</span>
   <span class="spec-badge">${item.wattage > 0 ? 'กินไฟ ' + item.wattage + 'W' : 'จ่ายไฟ ' + item.maxWatt + 'W'}</span>
   <span class="spec-badge">${item.price.toLocaleString()} ฿</span>
  </div>
  <p style="font-size:12px;color:#d6ebfa">${item.specs}</p>
  <p class="${compatibility.compatible ? 'good' : 'warn'}">${compatibility.reason}</p>
  <button id="btnPick" style="width:100%;margin-top:6px">ถืออุปกรณ์นี้</button>
 `;
 $('btnPick').onclick = () => pickItem(id);
 renderInventory();
}

function pickItem(id) {
 activeTool = null;
 clearToolButtons();
 const item = hardwareCatalog.find(x => x.id === id);
 heldItem = item;
 selectedId = id;
 heldGroup.clear();
 const preview = createDetailedMesh(item);
 preview.scale.set(0.32, 0.32, 0.32);
 preview.position.set(0.45, -0.35, -1.0);
 preview.rotation.set(0.2, -0.5, 0);
 heldGroup.add(preview);
 notify(`กำลังถือ: ${item.name} — เล็งไปที่ช่อง ${slotNames[item.slot]} แล้วกด [E]`);
 renderInventory();
}

function dropHeldItem() {
 if (!heldItem && !activeTool && !selectedId) {
  notify('ไม่มีอุปกรณ์หรือเครื่องมือที่กำลังถืออยู่');
  return;
 }

 const action = heldItem ? 'วาง' : 'ยกเลิก';
 const droppedName = heldItem?.name || (activeTool ? 'เครื่องมือที่ถืออยู่' : 'รายการที่เลือก');
 heldItem = null;
 activeTool = null;
 selectedId = null;
 heldGroup.clear();
 clearToolButtons();
 $('details').innerHTML = 'เลือกอุปกรณ์หรือเครื่องมือเพื่อดูสเปคและวิธีใช้งาน';
 renderInventory();
 notify(`${action} ${droppedName} แล้ว สามารถเลือกอุปกรณ์ชิ้นใหม่ได้`, 'success');
}

function renderProgress() {
 const prog = $('progress');
 const platform = buildPlatforms[selectedBuildPlatformId];
 const itemLine = (label, ok, sub = '') =>
  `<p style="margin:3px 0;font-size:12px">${label}: <span class="${ok ? 'good' : 'bad'}">${ok ? '✔ เรียบร้อย' : '✖ ยังไม่ทำ'}</span> <span class="tag">${sub}</span></p>`;

 prog.innerHTML = `
  ${itemLine(`1. CPU (${platform.socket})`, !!installedSlots.cpu)}
  ${itemLine('2. ทาซิลิโคน (Paste)', assemblyState.thermalPaste, '[กด 1]')}
  ${itemLine('3. CPU Cooler', !!installedSlots.cooler)}
  ${itemLine(`4. RAM (${platform.ramType})`, !!installedSlots.ram)}
  ${itemLine('5. SSD + ขันน็อต', !!installedSlots.ssd && assemblyState.screwed.ssd, installedSlots.ssd && !assemblyState.screwed.ssd ? '(รอขันน็อต [2])' : '')}
  ${itemLine('6. GPU + ขันน็อต', !!installedSlots.gpu && assemblyState.screwed.gpu, installedSlots.gpu && !assemblyState.screwed.gpu ? '(รอขันน็อต [2])' : '')}
  ${itemLine('7. PSU + ขันน็อต', !!installedSlots.psu && assemblyState.screwed.psu, installedSlots.psu && !assemblyState.screwed.psu ? '(รอขันน็อต [2])' : '')}
  ${itemLine('8. เดินสายไฟ PSU', assemblyState.cablesConnected, '[กด 3]')}
  ${itemLine('9. ติดตั้ง Windows', windowsInstallComplete)}
  ${itemLine('โบนัสท้าทาย: ซ่อมเครื่องปริศนา', repairChallengeComplete, '[ไม่บังคับ]')}
 `;
}

function setBenchItemVisibility(id, visible) {
 const entry = benchItems.find(x => x.id === id);
 if (entry) {
  entry.mesh.visible = visible;
  entry.label.visible = visible;
 }
}

function attemptInstall() {
 if (activeTool) {
  useActiveTool();
  return;
 }
 if (!heldItem) {
  notify('กรุณาเลือกอุปกรณ์จากคลังด้านซ้าย หรือเล็งอะไหล่บนแท่นวางแล้วกด [E]', 'error');
  return;
 }

 raycaster.setFromCamera(center, camera);
 const hits = raycaster.intersectObjects(getRaycastTargetSlots(), false);

 if (!hits.length) {
  notify('กรุณาเล็งเป้าไปที่ช่องติดตั้งบนเมนบอร์ดหรือเคสก่อนกด [E]', 'error');
  return;
 }

 const targetSlot = hits[0].object.userData.slot;

 if (targetSlot !== heldItem.slot) {
  playSFX('error');
  score = Math.max(0, score - 20);
  updateScoreAndBudget();
  notify(`❌ ใส่ผิดช่อง! คุณกำลังเอา ${heldItem.slot.toUpperCase()} ไปใส่ช่อง ${targetSlot.toUpperCase()}`, 'error');
  return;
 }

 const compatibility = getPartCompatibility(heldItem);
 if (!compatibility.compatible) {
  playSFX('error');
  score = Math.max(0, score - 30);
  updateScoreAndBudget();
  notify(`⚠️ ใส่ไม่ได้! ${compatibility.reason}`, 'error');
  return;
 }

 if (heldItem.slot === 'cooler' && !installedSlots.cpu) {
  playSFX('error');
  notify('❌ ลำดับผิดพลาด! ต้องติดตั้ง CPU ก่อน จึงจะวาง Cooler ได้', 'error');
  return;
 }

 let forgotPasteWarning = false;
 if (heldItem.slot === 'cooler' && !assemblyState.thermalPaste) {
  forgotPasteWarning = true;
 }

 if (installedMeshes[targetSlot]) {
  const prevItem = installedSlots[targetSlot];
  setBenchItemVisibility(prevItem.id, true);
  const parent = targetSlot === 'psu' ? pc : board;
  parent.remove(installedMeshes[targetSlot]);
 }

 const mesh = createDetailedMesh(heldItem);
 const slotObj = slotObjects[targetSlot];
 const targetPos = slotObj.position.clone();

 if (targetSlot === 'cpu') {
  targetPos.z += 0.05;
  cpuLever.rotation.x = 0;
 }
 if (targetSlot === 'cooler') targetPos.z += 0.06;
 if (targetSlot === 'ram') targetPos.z += 0.08;
 if (targetSlot === 'ssd') targetPos.z += 0.04;
 if (targetSlot === 'gpu') targetPos.z += 0.1;

 mesh.position.copy(targetPos);
 if (targetSlot !== 'psu') mesh.position.z += 0.55;

 const parentContainer = targetSlot === 'psu' ? pc : board;
 parentContainer.add(mesh);
 animations.push({ mesh, startPos: mesh.position.clone(), targetPos, progress: 0 });

 playSFX('click');
 installedSlots[targetSlot] = heldItem;
 installedMeshes[targetSlot] = mesh;
 setBenchItemVisibility(heldItem.id, false);

 const installedName = heldItem.name;
 heldItem = null;
 heldGroup.clear();
 score += 100;

 if (forgotPasteWarning) {
  notify(`⚠️ ติดตั้ง ${installedName} แล้ว แต่คุณลืมทาซิลิโคน! ระวัง CPU ร้อนเกินกำหนด (กด R ถอดออกเพื่อทาใหม่ได้)`, 'warn');
 } else if (['ssd', 'gpu', 'psu'].includes(targetSlot)) {
  notify(`✅ วาง ${installedName} ลงสล็อตแล้ว! อย่าลืมกด [2] หยิบไขควงมาขันน็อตยึด`, 'success');
 } else if (targetSlot === 'cpu') {
  notify(`✅ ติดตั้ง ${installedName} และล็อกคันโยกแล้ว! ขั้นต่อไปกด [1] เพื่อทาซิลิโคน`, 'success');
 } else {
  notify(`✅ ติดตั้ง ${installedName} สำเร็จ! (+100 คะแนน)`, 'success');
 }
 renderInventory();
}

function removePart() {
 raycaster.setFromCamera(center, camera);
 const hits = raycaster.intersectObjects(getRaycastTargetSlots(), false);
 if (!hits.length) return;
 const targetSlot = hits[0].object.userData.slot;
 if (!installedSlots[targetSlot]) return;

 if (targetSlot === 'cpu' && installedSlots.cooler) {
  playSFX('error');
  notify('⚠️ กรุณาถอด CPU Cooler ออกก่อนจึงจะถอด CPU ได้', 'error');
  return;
 }

 const removedItem = installedSlots[targetSlot];
 const parentContainer = targetSlot === 'psu' ? pc : board;
 parentContainer.remove(installedMeshes[targetSlot]);
 delete installedMeshes[targetSlot];
 delete installedSlots[targetSlot];

 if (targetSlot === 'cpu') {
  cpuLever.rotation.x = -0.6;
  assemblyState.thermalPaste = false;
  pasteBlob.visible = false;
 }
 if (['ssd', 'gpu', 'psu'].includes(targetSlot)) {
  assemblyState.screwed[targetSlot] = false;
  screwMeshes[targetSlot].visible = false;
 }

 playSFX('click');
 setBenchItemVisibility(removedItem.id, true);
 notify(`ถอด ${removedItem.name} ออกจากเครื่องแล้ว`);
 renderInventory();
}

const windowsGuideSteps = [
 {
  title: 'ควรเตรียม USB ติดตั้ง Windows อย่างไรให้ปลอดภัย?',
  description: 'เลือกวิธีสร้างสื่อสำหรับติดตั้ง Windows ที่เหมาะสมที่สุด',
  tip: 'ก่อนสร้างสื่อ ให้สำรองไฟล์ในแฟลชไดรฟ์ เพราะข้อมูลเดิมอาจถูกลบ',
  explanation: 'ดาวน์โหลดเครื่องมือสร้างสื่อจากเว็บไซต์ทางการของ Microsoft และใช้แฟลชไดรฟ์ว่างอย่างน้อย 8 GB',
  answers: [
   'คัดลอกไฟล์ติดตั้งจากเว็บไซต์ใดก็ได้ลง USB ขนาดเท่าไรก็ได้',
   'ดาวน์โหลดตัวติดตั้งจากเว็บไซต์ทางการของ Microsoft และใช้ USB ว่างอย่างน้อย 8 GB',
   'ใช้ USB ที่มีไฟล์สำคัญอยู่ได้เลย เพราะการสร้างสื่อจะไม่เปลี่ยนแปลงข้อมูล'
  ],
  correctAnswer: 1
 },
 {
  title: 'จะเริ่มติดตั้ง Windows จากแฟลชไดรฟ์ได้อย่างไร?',
  description: 'หลังเสียบ USB ติดตั้งและเปิดเครื่อง ควรทำอะไรต่อ?',
  tip: 'ชื่อปุ่มเปิด Boot Menu แตกต่างกันไปตามผู้ผลิตเมนบอร์ดหรือเครื่อง',
  explanation: 'เลือก USB ใน Boot Menu หรือกำหนดอุปกรณ์บูตใน UEFI/BIOS เพื่อเริ่ม Windows Setup',
  answers: [
   'เปิดเครื่องซ้ำไปเรื่อย ๆ โดยไม่ต้องเลือกอุปกรณ์บูต',
   'ฟอร์แมต SSD จากระบบปฏิบัติการเดิมก่อนเสียบ USB',
   'เปิด Boot Menu หรือ UEFI/BIOS แล้วเลือกบูตจาก USB ติดตั้ง'
  ],
  correctAnswer: 2
 },
 {
  title: 'เมื่อหน้าต่าง Windows Setup ปรากฏ ควรทำอย่างไร?',
  description: 'เลือกขั้นตอนที่ถูกต้องก่อนเริ่มกระบวนการติดตั้ง',
  tip: 'ตรวจสอบภาษาและรูปแบบแป้นพิมพ์ให้ตรงกับการใช้งาน',
  explanation: 'เลือกภาษา เวลา และแป้นพิมพ์ จากนั้นเริ่มติดตั้งและเลือกรุ่นที่ตรงกับสิทธิ์การใช้งานของคุณ',
  answers: [
   'เลือกทุกรุ่นของ Windows เพื่อให้ติดตั้งได้เร็วขึ้น',
   'เลือกภาษา เวลา และแป้นพิมพ์ แล้วเริ่มติดตั้งด้วยรุ่น Windows ที่มีสิทธิ์ใช้งาน',
   'ปิดเครื่องทันทีเมื่อเห็นหน้าต่าง Setup'
  ],
  correctAnswer: 1
 },
 {
  title: 'ก่อนเลือกหรือลบพาร์ทิชันบนไดรฟ์ ควรตรวจสอบอะไร?',
  description: 'เลือกแนวทางที่ช่วยป้องกันการลบข้อมูลผิดไดรฟ์',
  tip: 'การลบหรือจัดรูปแบบพาร์ทิชันอาจทำให้ข้อมูลในไดรฟ์สูญหาย',
  explanation: 'ตรวจสอบชื่อและความจุของ SSD เป้าหมาย สำรองข้อมูล และยืนยันให้แน่ใจก่อนลบหรือจัดรูปแบบพาร์ทิชัน',
  answers: [
   'ตรวจสอบไดรฟ์และความจุให้ตรงกับเป้าหมาย พร้อมสำรองข้อมูลก่อนยืนยัน',
   'ลบทุกพาร์ทิชันที่แสดงโดยไม่ต้องตรวจสอบ',
   'เลือกไดรฟ์แรกเสมอ เพราะ Windows จะเลือกไดรฟ์ที่ถูกต้องให้อัตโนมัติ'
  ],
  correctAnswer: 0
 },
 {
  title: 'ระหว่างติดตั้งและรีสตาร์ตเครื่อง ควรทำอย่างไร?',
  description: 'ตัวติดตั้งกำลังคัดลอกไฟล์และอาจรีสตาร์ตหลายครั้ง',
  tip: 'หลังรีสตาร์ตครั้งแรก ให้บูตจาก SSD แทน USB เพื่อไม่ให้กลับไปเริ่มติดตั้งซ้ำ',
  explanation: 'รอให้ติดตั้งเสร็จโดยไม่ปิดเครื่อง และเมื่อรีสตาร์ตครั้งแรกให้ถอด USB หรือเลือกบูตจาก SSD',
  answers: [
   'ปิดเครื่องทันทีที่หน้าจอดับระหว่างรีสตาร์ต',
   'ปล่อยให้เครื่องบูตจาก USB ต่อไปทุกครั้ง แม้จะเริ่ม Setup ใหม่',
   'รอจนเสร็จ อย่าปิดเครื่อง และหลังรีสตาร์ตครั้งแรกให้บูตจาก SSD'
  ],
  correctAnswer: 2
 },
 {
  title: 'หลังติดตั้งเสร็จ ควรตั้งค่าอะไรบ้างในครั้งแรก?',
  description: 'เลือกสิ่งที่ควรตรวจสอบก่อนเริ่มใช้งาน Windows',
  tip: 'อ่านตัวเลือกความเป็นส่วนตัวและบัญชีให้รอบคอบก่อนยืนยัน',
  explanation: 'ตั้งค่าภูมิภาค แป้นพิมพ์ เครือข่าย และบัญชีผู้ใช้ พร้อมตรวจสอบตัวเลือกความเป็นส่วนตัว',
  answers: [
   'ปิดการตั้งค่าทั้งหมดโดยไม่ตรวจสอบ แล้วใช้รหัสผ่านเดียวกับทุกบัญชี',
   'ตั้งค่าภูมิภาค แป้นพิมพ์ เครือข่าย บัญชีผู้ใช้ และตรวจสอบความเป็นส่วนตัว',
   'ถอด SSD ออกก่อนตั้งค่าบัญชีผู้ใช้'
  ],
  correctAnswer: 1
 },
 {
  title: 'หลังเข้าสู่เดสก์ท็อปแล้ว ควรทำอะไรต่อ?',
  description: 'เลือกขั้นตอนที่ช่วยให้ระบบพร้อมใช้งานและอัปเดต',
  tip: 'ใช้แหล่งดาวน์โหลดที่เชื่อถือได้และตรวจสอบสิทธิ์การใช้งาน Windows',
  explanation: 'ติดตั้งไดรเวอร์จากผู้ผลิตที่เชื่อถือได้ เรียก Windows Update และเปิดใช้งานด้วยสิทธิ์การใช้งานที่ถูกต้อง',
  answers: [
   'ปิด Windows Update และดาวน์โหลดไดรเวอร์จากเว็บที่ไม่รู้จัก',
   'ลบไดรเวอร์ทั้งหมดเพื่อให้ระบบทำงานได้เร็วขึ้น',
   'ติดตั้งไดรเวอร์ที่จำเป็น เรียก Windows Update และตรวจสอบการเปิดใช้งาน'
  ],
  correctAnswer: 2
 }
];

function answerWindowsQuestion(answerIndex) {
 const step = windowsGuideSteps[windowsCurrentStep];
 if (windowsAnswers[windowsCurrentStep]) return;

 windowsAnswerSelections[windowsCurrentStep] = answerIndex;
 if (answerIndex === step.correctAnswer) {
  windowsAnswers[windowsCurrentStep] = true;
 }
 renderWindowsGuide();
}

function renderWindowsGuide() {
 const step = windowsGuideSteps[windowsCurrentStep];
 const isCorrect = Boolean(windowsAnswers[windowsCurrentStep]);
 const selection = windowsAnswerSelections[windowsCurrentStep];
 $('windowsStepCount').innerText = `ข้อ ${windowsCurrentStep + 1} / ${windowsGuideSteps.length}`;
 $('windowsStepTitle').innerText = step.title;
 $('windowsStepDescription').innerText = step.description;
 $('windowsStepTip').innerText = step.tip;
 $('windowsProgress').style.width = `${(windowsAnswers.filter(Boolean).length / windowsGuideSteps.length) * 100}%`;
 const answers = $('windowsAnswers');
 answers.replaceChildren();
 step.answers.forEach((answer, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'windows-answer';
  button.innerText = `${String.fromCharCode(65 + index)}. ${answer}`;
  button.disabled = isCorrect;
  if (selection === index) button.classList.add(isCorrect ? 'correct' : 'incorrect');
  button.addEventListener('click', () => answerWindowsQuestion(index));
  answers.appendChild(button);
 });
 const feedback = $('windowsFeedback');
 if (selection === undefined) {
  feedback.innerText = '';
  feedback.className = 'windows-feedback';
 } else if (isCorrect) {
  feedback.innerText = `ถูกต้อง! ${step.explanation}`;
  feedback.className = 'windows-feedback correct';
 } else {
  feedback.innerText = 'คำตอบยังไม่ถูก ลองเลือกอีกครั้ง';
  feedback.className = 'windows-feedback incorrect';
 }
 $('btnWindowsBack').disabled = windowsCurrentStep === 0;
 $('btnWindowsNext').innerText = windowsCurrentStep === windowsGuideSteps.length - 1
  ? 'จบแบบทดสอบ'
  : 'ข้อถัดไป';
 $('btnWindowsNext').disabled = !isCorrect;
 renderMonitor(
  `WINDOWS QUIZ ${windowsCurrentStep + 1}/${windowsGuideSteps.length}`,
  [isCorrect ? 'คำตอบถูกต้อง' : selection === undefined ? 'รอคำตอบ...' : 'ลองเลือกคำตอบใหม่', 'ตอบคำถามบนหน้าจอ', 'Windows Setup'],
  isCorrect ? '#00e676' : '#00e5ff'
 );
}

function openWindowsGuide() {
 windowsCurrentStep = 0;
 windowsAnswers = Array(windowsGuideSteps.length).fill(false);
 windowsAnswerSelections = Array(windowsGuideSteps.length).fill(undefined);
 $('postScreen').style.display = 'none';
 $('windowsScreen').style.display = 'flex';
 renderWindowsGuide();
}

function advanceWindowsGuide(direction) {
 const lastStep = windowsGuideSteps.length - 1;
 if (direction > 0 && windowsCurrentStep === lastStep) {
  if (!windowsAnswers[windowsCurrentStep]) return;
  $('windowsScreen').style.display = 'none';
  if (!windowsInstallComplete) {
   windowsInstallComplete = true;
   score += 300;
   updateScoreAndBudget();
  }
  renderWindowsDesktop();
  renderProgress();
  const buildCost = Object.values(installedSlots).reduce((total, item) => total + item.price, 0);
  $('completionScore').innerText = `คะแนนรวม ${score.toLocaleString()} คะแนน · ใช้งบ ${buildCost.toLocaleString()} ฿`;
  if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
  stopMysteryMusic();
  playSFX('celebrate');
  $('completionScreen').style.display = 'flex';
  return;
 }
 if (direction > 0 && !windowsAnswers[windowsCurrentStep]) return;
 windowsCurrentStep = Math.max(0, Math.min(lastStep, windowsCurrentStep + direction));
 renderWindowsGuide();
}

function analyzeSystem() {
 const errors = [];
 const warnings = [];
 let totalWatt = 35;
 let totalCost = 0;

 ['cpu', 'cooler', 'ram', 'ssd', 'gpu', 'psu'].forEach(s => {
  if (!installedSlots[s]) errors.push(`ยังไม่ได้ติดตั้ง ${slotNames[s]}`);
  else {
   totalWatt += installedSlots[s].wattage;
   totalCost += installedSlots[s].price;
  }
 });

 if (!assemblyState.cablesConnected) {
  errors.push('ยังไม่ได้เดินสายไฟจาก Power Supply (กด [3] เพื่อเชื่อมต่อสายไฟ)');
 }

 ['ssd', 'gpu', 'psu'].forEach(s => {
  if (installedSlots[s] && !assemblyState.screwed[s]) {
   warnings.push(`ยังไม่ได้ขันน็อตยึด ${s.toUpperCase()} (อาจหลุดหลวมขณะเคลื่อนย้าย)`);
  }
 });

 if (installedSlots.cooler && !assemblyState.thermalPaste) {
  warnings.push('ไม่ได้ทาซิลิโคน (Thermal Paste) บน CPU — อุณหภูมิขณะโหลดหนักจะสูงเกิน 100°C!');
 }

 if (totalCost > 24000) {
  warnings.push(`งบประมาณรวม ${totalCost.toLocaleString()} ฿ เกินงบลูกค้าที่ตั้งไว้ (24,000 ฿)`);
 }

 if (installedSlots.psu) {
  const psuWatt = installedSlots.psu.maxWatt;
  if (totalWatt > psuWatt) {
   errors.push(`กำลังไฟไม่พอ! อุปกรณ์กินไฟรวม ~${totalWatt}W แต่ PSU จ่ายได้แค่ ${psuWatt}W`);
  }
 }

 return { errors, warnings, totalWatt, totalCost };
}

function runPOST() {
 const { errors, warnings, totalWatt, totalCost } = analyzeSystem();
 const passed = errors.length === 0;
 const psuCap = installedSlots.psu ? installedSlots.psu.maxWatt : 0;

 if (passed) playSFX('celebrate');
 else playSFX('error');
 renderMonitor(
  passed ? 'POST PASSED' : 'POST FAILED',
  passed
   ? [`CPU: ${installedSlots.cpu.name}`, `RAM: ${installedSlots.ram.name}`, `POWER: ${totalWatt}W / ${psuCap}W`, 'System ready for Windows Setup']
   : errors.slice(0, 5),
  passed ? '#00e676' : '#ff5252'
 );

 $('postContent').innerHTML = `
  <h1 style="margin-bottom:5px">AMERICAN MEGATRENDS - UEFI BIOS</h1>
  <h2 class="${passed ? 'good' : 'bad'}">${passed ? '● POST PASSED (เปิดเครื่องติดสำเร็จ!)' : '✖ POST FAILED (เปิดเครื่องไม่ติด)'}</h2>
  <p><b>CPU:</b> ${installedSlots.cpu ? `<span class="good">${installedSlots.cpu.name}</span>` : '<span class="bad">NOT DETECTED</span>'}</p>
  <p><b>Thermal Interface:</b> ${assemblyState.thermalPaste ? '<span class="good">Applied (ทาซิลิโคนแล้ว)</span>' : '<span class="warn">Missing (ไม่พบซิลิโคน!)</span>'}</p>
  <p><b>Memory:</b> ${installedSlots.ram ? `<span class="good">${installedSlots.ram.name}</span>` : '<span class="bad">MEMORY ERROR</span>'}</p>
  <p><b>Storage:</b> ${installedSlots.ssd ? `<span class="good">${installedSlots.ssd.name}</span>` : '<span class="bad">NO STORAGE</span>'}</p>
  <p><b>Graphics:</b> ${installedSlots.gpu ? `<span class="good">${installedSlots.gpu.name}</span>` : '<span class="bad">VGA ERROR</span>'}</p>
  <p><b>Power & Cables:</b> ${installedSlots.psu && assemblyState.cablesConnected ? `<span class="good">${installedSlots.psu.name} (${totalWatt}W / ${psuCap}W)</span>` : '<span class="bad">NO POWER / CABLES UNPLUGGED</span>'}</p>
  <p><b>Total Build Cost:</b> <span class="${totalCost <= 24000 ? 'good' : 'warn'}">${totalCost.toLocaleString()} ฿</span> (เป้าหมายภารกิจ ≤ 24,000 ฿)</p>
  <hr style="border-color:#2b5880">
  ${passed
   ? `<p class="good">✔ ระบบบูตผ่านแล้ว! ตรวจผลบนจอและเลือกทดสอบ 3DMark หรือตอบคำถามเกี่ยวกับการติดตั้ง Windows</p>
      ${warnings.map(w => `<p class="warn">⚠ คำเตือน: ${w}</p>`).join('')}`
   : errors.map(e => `<p class="bad">✖ สาเหตุ: ${e}</p>`).join('')
  }
  ${passed ? '<button id="startWindowsInstall" style="margin-top:8px;width:100%">🧠 ตอบคำถามการติดตั้ง Windows</button>' : ''}
  <button id="closePost" style="margin-top:15px;width:100%">กลับไปหน้าประกอบเครื่อง</button>
 `;

 $('postScreen').style.display = 'flex';
 $('closePost').onclick = () => { $('postScreen').style.display = 'none'; };
 if (passed) $('startWindowsInstall').addEventListener('click', openWindowsGuide);

 if (passed) {
  score += 300;
  updateScoreAndBudget();
  fanMeshes.forEach(f => f.userData.spinning = true);
 } else {
  fanMeshes.forEach(f => f.userData.spinning = false);
 }
}
function openStressTest() {
 const { errors, totalWatt, totalCost } = analyzeSystem();
 if (errors.length > 0) {
  playSFX('error');
  renderMonitor('3DMARK NOT READY', errors.slice(0, 5), '#ff5252');
  notify(`ไม่สามารถรัน 3DMark ได้: ${errors[0]}`, 'error');
  return;
 }

 const baseTemp = 38;
 const coolingPower = installedSlots.cooler.cooling || 20;
 const pasteBonus = assemblyState.thermalPaste ? 32 : 0;
 const cpuTemp = Math.min(105, Math.round(baseTemp + 68 - coolingPower - pasteBonus));
 const isOverheating = cpuTemp >= 95;

 const fps = isOverheating
  ? Math.round((installedSlots.gpu.perf + installedSlots.cpu.perf) * 0.35)
  : Math.round((installedSlots.gpu.perf * 1.15) + (installedSlots.cpu.perf * 0.6));

 const psuCap = installedSlots.psu.maxWatt;
 const loadPercent = Math.round((totalWatt / psuCap) * 100);
 const withinBudget = totalCost <= 24000;
 renderMonitor(
  isOverheating ? 'THERMAL TEST FAILED' : '3DMARK TEST PASSED',
  [`CPU TEMP: ${cpuTemp} C`, `POWER: ${totalWatt}W / ${psuCap}W`, `FPS: ${fps}`, withinBudget ? 'BUDGET: PASS' : 'BUDGET: OVER LIMIT'],
  isOverheating ? '#ff5252' : '#00e676'
 );

 $('stressLogs').innerHTML = `
  <p><b>CPU Package Temp:</b> <span class="${isOverheating ? 'bad' : 'good'}">${cpuTemp}°C ${isOverheating ? '(OVERHEATING - ลืมทาซิลิโคน!)' : '(เย็นเฉียบ)'}</span></p>
  <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, cpuTemp)}%;background:${isOverheating ? '#ff5252' : '#00e676'}"></div></div>

  <p><b>PSU Power Load:</b> <span class="${loadPercent > 85 ? 'warn' : 'good'}">${totalWatt}W / ${psuCap}W (${loadPercent}%)</span></p>
  <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, loadPercent)}%;background:${loadPercent > 85 ? '#ffd740' : '#00e5ff'}"></div></div>

  <p><b>Average FPS (1440p Ultra):</b> <span class="good" style="font-size:18px">${fps} FPS</span></p>
  <p><b>Mission Budget Check:</b> <span class="${withinBudget ? 'good' : 'warn'}">${withinBudget ? '✔ ผ่านเงื่อนไขงบประมาณลูกค้า!' : '⚠ เกินงบ 24,000 ฿'}</span></p>
  <hr style="border-color:#2b5880">
  ${isOverheating
   ? '<p class="bad">✖ ผลลัพธ์: เกิดอาการ Thermal Throttling! CPU ลดความเร็วลงเพราะไม่ได้ทาซิลิโคนระบายความร้อน</p>'
   : '<p class="good">🏆 ผลลัพธ์: เครื่องทำงานเต็มประสิทธิภาพ เสถียร 100% รับโบนัส +500 คะแนน!</p>'
  }
 `;

 if (!isOverheating) {
  score += 500;
  updateScoreAndBudget();
  playSFX('beep');
 } else {
  playSFX('error');
 }

 $('stressScreen').style.display = 'flex';
}

function openRepairChallenge() {
 if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
 $('repairFeedback').className = 'repair-feedback';
 $('repairFeedback').innerText = '';
 $('repairScreen').style.display = 'flex';
 renderMonitor('NO SIGNAL', [
  'MYSTERY PC: POWER ON',
  'CPU: Intel Core i5-12400F',
  'DISPLAY CABLE: MOTHERBOARD PORT',
  'GPU: INSTALLED / POWER OK'
 ], '#ff5252');
 $('repairScreen').querySelector('[data-repair-choice]:not(:disabled)').focus();
}

function answerRepairChallenge(choice) {
 if (repairChallengeComplete) return;

 const feedback = $('repairFeedback');
 if (choice !== 'gpu') {
  score = Math.max(0, score - 25);
  updateScoreAndBudget();
  playSFX('error');
  feedback.className = 'repair-feedback error';
  feedback.innerText = 'ยังไม่ถูก ลองเทียบข้อมูล CPU ที่ไม่มีกราฟิกในตัวกับตำแหน่งที่เสียบสายจออีกครั้ง (หัก 25 คะแนน)';
  return;
 }

 repairChallengeComplete = true;
 score += 400;
 updateScoreAndBudget();
 renderProgress();
 $('btnRepairChallenge').disabled = true;
 $('btnRepairChallenge').innerText = '✅ ซ่อมเครื่องปริศนาสำเร็จ';
 $('repairScreen').querySelectorAll('[data-repair-choice]').forEach(button => button.disabled = true);
 feedback.className = 'repair-feedback success';
 feedback.innerText = 'ซ่อมสำเร็จ! CPU รุ่น F ไม่มีกราฟิกในตัว จึงต้องย้ายสายจอไปยังพอร์ตบนการ์ดจอ (+400 คะแนน)';
 renderMonitor('DISPLAY SIGNAL RESTORED', [
  'REPAIR: DISPLAY CABLE MOVED TO GPU',
  'GPU OUTPUT: ACTIVE',
  'NO SIGNAL: RESOLVED'
 ], '#00e676');
 playSFX('celebrate');
}
function startGame() {
 $('start').style.display = 'none';
 running = true;
 startMysteryMusic();
 renderer.domElement.requestPointerLock();
}
document.addEventListener('pointerlockchange', () => {
 if (document.pointerLockElement === renderer.domElement) {
  $('prompt').innerText = 'WASD เดิน · E ใช้งาน · Shift ปลดเมาส์';
 } else if (running) {
  $('prompt').innerText = 'เมาส์อิสระแล้ว · คลิกฉากเพื่อกลับเข้าเกม';
 }
});

document.addEventListener('mousemove', e => {
 if (document.pointerLockElement !== renderer.domElement) return;
 yaw -= e.movementX * 0.0022;
 pitch -= e.movementY * 0.0022;
 pitch = Math.max(-1.3, Math.min(1.3, pitch));
 camera.rotation.set(pitch, yaw, 0, 'YXZ');
});

document.addEventListener('mousedown', e => {
 if (e.button === 2 && running) isZoomed = true;
});
document.addEventListener('mouseup', e => {
 if (e.button === 2) isZoomed = false;
});
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
 if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
  if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
  return;
 }
 keys[e.code] = true;
 if (!running) return;
 if (e.code === 'KeyQ') dropHeldItem();
 if (e.code === 'KeyE') {
  if (heldItem || activeTool) attemptInstall();
  else pickFromBench();
 }
 if (e.code === 'KeyR') removePart();
 if (e.code === 'KeyF') toggleStudioLight();
 if (e.code === 'Digit1') equipTool('paste');
 if (e.code === 'Digit2') equipTool('screwdriver');
 if (e.code === 'Digit3') equipTool('cables');
});
document.addEventListener('keyup', e => keys[e.code] = false);

renderer.domElement.addEventListener('click', () => {
 if (running && document.pointerLockElement !== renderer.domElement) {
  renderer.domElement.requestPointerLock();
 }
});

function pickFromBench() {
 raycaster.setFromCamera(center, camera);
 const hits = raycaster.intersectObjects(benchGroup.children, true);
 if (!hits.length) return;
 let obj = hits[0].object;
 while (obj.parent && obj.parent !== benchGroup) obj = obj.parent;
 if (obj.userData.itemId) {
  selectItem(obj.userData.itemId);
  pickItem(obj.userData.itemId);
 }
}

function resetGame(silent = false) {
 Object.keys(installedSlots).forEach(s => {
  const parent = s === 'psu' ? pc : board;
  if (installedMeshes[s]) parent.remove(installedMeshes[s]);
  delete installedMeshes[s];
  delete installedSlots[s];
 });
 benchItems.forEach(b => {
  b.mesh.visible = true;
  b.label.visible = true;
 });
 Object.values(screwMeshes).forEach(s => s.visible = false);
 assemblyState.thermalPaste = false;
 assemblyState.screwed = { ssd: false, gpu: false, psu: false };
 assemblyState.cablesConnected = false;
 pasteBlob.visible = false;
 cableGroup.visible = false;
 cpuLever.rotation.x = -0.6;

 heldItem = null;
 activeTool = null;
 selectedId = null;
 score = 0;
 windowsInstallComplete = false;
 repairChallengeComplete = false;
 windowsCurrentStep = 0;
 windowsAnswers = [];
 windowsAnswerSelections = [];
 $('windowsScreen').style.display = 'none';
 $('repairScreen').style.display = 'none';
 $('btnRepairChallenge').disabled = false;
 $('btnRepairChallenge').innerText = '🧩 ระดับท้าทาย: ซ่อมเครื่องปริศนา';
 $('repairScreen').querySelectorAll('[data-repair-choice]').forEach(button => button.disabled = false);
 heldGroup.clear();
 clearToolButtons();
 fanMeshes.forEach(f => f.userData.spinning = false);
 renderMonitor('SYSTEM READY', ['Press POWER to begin diagnostics', 'POST • 3DMark • Windows Setup'], '#00e5ff');
 renderInventory();
 renderProgress();
 $('details').innerHTML = 'เลือกอุปกรณ์หรือเครื่องมือเพื่อดูสเปคและวิธีใช้งาน';
 if (!silent) notify('รีเซ็ตห้องปฏิบัติการเรียบร้อยแล้ว');
}
const clock = new THREE.Clock();
function updateMovement(dt) {
 if (!running || document.pointerLockElement !== renderer.domElement) return;
 const speed = 3.2 * dt;
 const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
 const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
 let moveX = 0;
 let moveZ = 0;

 if (keys.KeyW) { moveX += forward.x * speed; moveZ += forward.z * speed; }
 if (keys.KeyS) { moveX -= forward.x * speed; moveZ -= forward.z * speed; }
 if (keys.KeyD) { moveX += right.x * speed; moveZ += right.z * speed; }
 if (keys.KeyA) { moveX -= right.x * speed; moveZ -= right.z * speed; }

 const candidateX = THREE.MathUtils.clamp(camera.position.x + moveX, -6.0, 6.0);
 const candidateZ = THREE.MathUtils.clamp(camera.position.z + moveZ, -2.5, 6.5);
 const obstacles = [caseCollisionBounds, monitorCollisionBounds];
 const overlapsObstacle = (x, z) => obstacles.some(bounds =>
  x >= bounds.minX && x <= bounds.maxX &&
  z >= bounds.minZ && z <= bounds.maxZ
 );
 if (!overlapsObstacle(candidateX, camera.position.z)) camera.position.x = candidateX;
 if (!overlapsObstacle(camera.position.x, candidateZ)) camera.position.z = candidateZ;
 camera.position.y = 2.45;
}

function updateRaycastHighlight() {
 Object.values(slotObjects).forEach(o => o.material.emissive.setHex(0x000000));
 const ch = $('crosshair');
 ch.className = '';

 if (!running) return;
 raycaster.setFromCamera(center, camera);

 if (activeTool) {
  ch.className = 'tool';
  const hits = raycaster.intersectObjects(getRaycastTargetSlots(), false);
  if (hits.length) hits[0].object.material.emissive.setHex(0x885500);
  return;
 }

 if (heldItem) {
  const hits = raycaster.intersectObjects(getRaycastTargetSlots(), false);
  if (hits.length) {
   const target = hits[0].object;
   const compatibility = getPartCompatibility(heldItem);
   const isMatch = target.userData.slot === heldItem.slot && compatibility.compatible;
   target.material.emissive.setHex(isMatch ? 0x008844 : 0x880000);
   ch.className = isMatch ? 'valid' : 'invalid';
   $('prompt').innerText = isMatch
    ? `[กด E] ติดตั้ง ${heldItem.name}`
    : target.userData.slot === heldItem.slot
     ? `[ใส่ไม่ได้] ${compatibility.reason}`
     : `[ใส่ไม่ได้] ช่องนี้ไม่รองรับ ${heldItem.name}`;
  } else {
   $('prompt').innerText = `กำลังถือ ${heldItem.name} — เล็งไปที่ช่อง ${slotNames[heldItem.slot]}`;
  }
 } else {
  const benchHits = raycaster.intersectObjects(benchGroup.children, true);
  if (benchHits.length) {
   let obj = benchHits[0].object;
   while (obj.parent && obj.parent !== benchGroup) obj = obj.parent;
   const item = hardwareCatalog.find(x => x.id === obj.userData.itemId);
   if (item) $('prompt').innerText = `[กด E] หยิบ ${item.name} (${item.price.toLocaleString()} ฿)`;
  }
 }
}

function animate() {
 requestAnimationFrame(animate);
 const dt = Math.min(clock.getDelta(), 0.05);
 const elapsed = clock.getElapsedTime();

 updateMovement(dt);
 updateRaycastHighlight();

 // ไฟ ARGB บนเพดานเคสเปลี่ยนสีนุ่มนวลตลอดเวลา
 const hue = (elapsed * 0.15) % 1;
 rgbStripMat.emissive.setHSL(hue, 0.9, 0.5);

 // อนิเมชันอะไหล่บนแท่นวางลอยขึ้นลงและหมุนช้าๆ ให้เห็นรอบด้านชัดเจน
 benchItems.forEach(b => {
  if (b.mesh.visible) {
   b.mesh.position.y = b.baseY + Math.sin(elapsed * 2.2 + b.phase) * 0.035;
   b.mesh.rotation.z = Math.sin(elapsed * 1.2 + b.phase) * 0.35;
  }
 });

 const targetFOV = isZoomed ? 34 : 68;
 if (Math.abs(camera.fov - targetFOV) > 0.1) {
  camera.fov += (targetFOV - camera.fov) * 10 * dt;
  camera.updateProjectionMatrix();
 }

 for (let i = animations.length - 1; i >= 0; i--) {
  const a = animations[i];
  a.progress = Math.min(1, a.progress + dt * 5);
  a.mesh.position.copy(a.startPos).lerp(a.targetPos, a.progress);
  if (a.progress >= 1) animations.splice(i, 1);
 }

 fanMeshes.forEach(f => {
  if (f.userData.spinning) f.rotation.y += dt * 18;
 });

 renderer.render(scene, camera);
}

addEventListener('resize', () => {
 camera.aspect = innerWidth / innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth, innerHeight);
});

$('btnPaste').addEventListener('click', () => equipTool('paste'));
$('btnScrew').addEventListener('click', () => equipTool('screwdriver'));
$('btnCable').addEventListener('click', () => equipTool('cables'));
$('btnDrop').addEventListener('click', dropHeldItem);
$('btnLight').addEventListener('click', toggleStudioLight);
$('btnLabels').addEventListener('click', togglePartLabels);
$('btnPost').addEventListener('click', runPOST);
$('btnStress').addEventListener('click', openStressTest);
$('btnRepairChallenge').addEventListener('click', openRepairChallenge);
$('btnReset').addEventListener('click', resetGame);
$('btnStart').addEventListener('click', startGame);
$('platformSelect').addEventListener('change', event => selectBuildPlatform(event.target.value));
$('settingsPlatformSelect').addEventListener('change', event => selectBuildPlatform(event.target.value));
syncBuildPlatformSelectors();
function openSettings() {
 if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
 $('settingsError').hidden = true;
 $('settingsScreen').style.display = 'flex';
}
$('btnSettings').addEventListener('click', openSettings);
$('btnSettingsStart').addEventListener('click', openSettings);
$('closeSettings').addEventListener('click', () => {
 $('settingsScreen').style.display = 'none';
});
function openSettingsHelp(sectionId) {
 $('settingsScreen').style.display = 'none';
 $('gameRules').hidden = sectionId !== 'gameRules';
 $('gameBasics').hidden = sectionId !== 'gameBasics';
 $('helpScreen').style.display = 'flex';
}
$('btnGameRules').addEventListener('click', () => openSettingsHelp('gameRules'));
$('btnGameBasics').addEventListener('click', () => openSettingsHelp('gameBasics'));
$('closeHelp').addEventListener('click', () => {
 $('helpScreen').style.display = 'none';
 $('settingsScreen').style.display = 'flex';
});
$('volumeSlider').addEventListener('input', () => {
 const volume = $('volumeSlider').valueAsNumber / 100;
 masterGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.02);
 backgroundMusic.volume = volume * 0.25;
 $('volumeValue').value = `${Math.round(volume * 100)}%`;
});
function updateFullscreenButton() {
 $('fullscreenToggle').innerText = document.fullscreenElement
  ? '⛶ ออกจากโหมดเต็มจอ'
  : '⛶ เข้าสู่โหมดเต็มจอ';
}
$('fullscreenToggle').addEventListener('click', async () => {
 $('settingsError').hidden = true;
 try {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
 } catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  $('settingsError').innerText = `เปลี่ยนโหมดเต็มจอไม่สำเร็จ: ${reason}`;
  $('settingsError').hidden = false;
 }
});
document.addEventListener('fullscreenchange', updateFullscreenButton);
$('closeStress').addEventListener('click', () => {
 $('stressScreen').style.display = 'none';
});
$('closeRepair').addEventListener('click', () => {
 $('repairScreen').style.display = 'none';
 $('btnRepairChallenge').focus();
});
$('repairScreen').querySelectorAll('[data-repair-choice]').forEach(button => {
 button.addEventListener('click', () => answerRepairChallenge(button.dataset.repairChoice));
});
$('btnWindowsBack').addEventListener('click', () => advanceWindowsGuide(-1));
$('btnWindowsNext').addEventListener('click', () => advanceWindowsGuide(1));
$('btnWindowsClose').addEventListener('click', () => {
 $('windowsScreen').style.display = 'none';
});
$('btnContinuePlaying').addEventListener('click', () => {
 $('completionScreen').style.display = 'none';
 startMysteryMusic();
 renderer.domElement.requestPointerLock();
});
$('btnReturnToStart').addEventListener('click', () => {
 if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
 $('completionScreen').style.display = 'none';
 running = false;
 stopMysteryMusic();
 resetGame();
 updateScoreAndBudget();
 $('message').hidden = true;
 $('start').style.display = 'flex';
});

renderInventory();
animate();
