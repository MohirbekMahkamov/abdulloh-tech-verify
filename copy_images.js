const fs = require('fs');
const path = require('path');

const dir = 'd:/Abdulloh-tech/frontend/public/products';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = [
  ['C:/Users/User/.gemini/antigravity/brain/dc49d35a-e2c1-438c-b683-74225f49b5ef/monoblok_product_1780056378448.png', 'd:/Abdulloh-tech/frontend/public/products/monoblok.png'],
  ['C:/Users/User/.gemini/antigravity/brain/dc49d35a-e2c1-438c-b683-74225f49b5ef/interactive_panel_1780056390199.png', 'd:/Abdulloh-tech/frontend/public/products/interactive-panel.png'],
  ['C:/Users/User/.gemini/antigravity/brain/dc49d35a-e2c1-438c-b683-74225f49b5ef/laser_printer_1780057329195.png', 'd:/Abdulloh-tech/frontend/public/products/printer.png'],
  ['C:/Users/User/.gemini/antigravity/brain/dc49d35a-e2c1-438c-b683-74225f49b5ef/office_desk_1780057196598.png', 'd:/Abdulloh-tech/frontend/public/products/desk.png'],
  ['C:/Users/User/.gemini/antigravity/brain/dc49d35a-e2c1-438c-b683-74225f49b5ef/hero_banner_1780057341115.png', 'd:/Abdulloh-tech/frontend/public/hero-banner.png'],
];

files.forEach(([src, dest]) => {
  try {
    fs.copyFileSync(src, dest);
    console.log('OK:', dest);
  } catch (e) {
    console.log('ERR:', dest, e.message);
  }
});
console.log('Done!');
