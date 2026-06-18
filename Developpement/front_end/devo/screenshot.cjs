const puppeteer = require('puppeteer-core');
const path      = require('path');
const fs        = require('fs');

const BASE_URL   = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const WAIT_MS = 4000;

const PAGES = [
  { name: '01_accueil',            path: '/' },
  { name: '02_login',              path: '/login' },
  { name: '03_register',           path: '/register' },
  { name: '04_home_living',        path: '/categories/home-living' },
  { name: '05_fashion',            path: '/categories/fashion' },
  { name: '06_jewelry',            path: '/categories/jewelry' },
  { name: '07_beauty',             path: '/categories/beauty-hammam' },
  { name: '08_pantry',             path: '/categories/moroccan-pantry' },
  { name: '09_tapis',              path: '/categories/moroccan-rugs' },
  { name: '10_tagines',            path: '/categories/tagines' },
  { name: '11_style_moderne',      path: '/styles/moderne' },
  { name: '12_style_traditionnel', path: '/styles/traditionnel' },
  { name: '13_artisans',           path: '/artisans' },
  { name: '14_artisan_detail',     path: '/artisans/1' },
  { name: '15_panier',             path: '/panier' },
  { name: '16_checkout',           path: '/checkout' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 390,  height: 844 },
];

async function screenshot(browser, viewport, page) {
  const url      = `${BASE_URL}${page.path}`;
  const dir      = path.join(OUTPUT_DIR, viewport.name);
  const filepath = path.join(dir, `${page.name}.png`);

  let tab;
  try {
    tab = await browser.newPage();

    // Intercepte les dialogues (alert, confirm) pour éviter les blocages
    tab.on('dialog', async dialog => { await dialog.dismiss(); });

    await tab.setViewport({ width: viewport.width, height: viewport.height });

    // Injecte un faux utilisateur connecté pour les pages protégées
    await tab.evaluateOnNewDocument(() => {
      localStorage.setItem('auth_token', 'fake_token_screenshot');
      localStorage.setItem('user', JSON.stringify({
        id: 1, nom: 'Test', prenom: 'User',
        email: 'test@moroccandesigners.ma', role: 'client',
      }));
    });

    // Navigation avec gestion des redirections
    const response = await tab.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    // Attend que la page soit stable (images, données API)
    await new Promise(r => setTimeout(r, WAIT_MS));

    // Vérifie que la page est toujours ouverte avant le screenshot
    if (tab.isClosed()) {
      console.error(`  ERREUR : ${page.name} — page fermée inopinément`);
      return;
    }

    await tab.screenshot({ path: filepath, fullPage: true });
    console.log(`  OK : ${page.name}`);

  } catch (err) {
    console.error(`  ERREUR : ${page.name} — ${err.message.split('\n')[0]}`);
  } finally {
    // Ferme proprement même en cas d'erreur
    if (tab && !tab.isClosed()) {
      await tab.close().catch(() => {});
    }
  }
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Lancement Puppeteer...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  for (const viewport of VIEWPORTS) {
    const dir = path.join(OUTPUT_DIR, viewport.name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log(`Viewport : ${viewport.name} (${viewport.width}x${viewport.height})`);

    // Pages en séquentiel (une par une) pour éviter les conflits
    for (const page of PAGES) {
      await screenshot(browser, viewport, page);
    }

    console.log('');
  }

  await browser.close();

  // Résumé final
  const total = VIEWPORTS.reduce((acc, v) => {
    const dir   = path.join(OUTPUT_DIR, v.name);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
    console.log(`  ${v.name} : ${files} screenshots`);
    return acc + files;
  }, 0);

  console.log(`\nTermine ! ${total} screenshots dans : ${OUTPUT_DIR}`);
}

run();