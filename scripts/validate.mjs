import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
let errors = [];
let warnings = [];

if (!existsSync(distDir)) {
  console.error('No dist/ directory found. Run `astro build` first.');
  process.exit(1);
}

function getHtmlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(distDir);

if (htmlFiles.length === 0) {
  errors.push('No HTML files found in dist/');
}

const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const relPath = file.replace(distDir, '');

  // Check <title>
  const titleMatch = html.match(/<title>(.*?)<\/title>/s);
  if (!titleMatch) {
    errors.push(`${relPath}: Missing <title> tag`);
  } else {
    const title = titleMatch[1].trim();
    if (!title || title.includes('undefined') || title === ' | Arizona Spiritual Retreats') {
      errors.push(`${relPath}: Empty or placeholder title`);
    }
    if (titles.has(title)) {
      errors.push(`${relPath}: Duplicate title "${title}" (also in ${titles.get(title)})`);
    } else {
      titles.set(title, relPath);
    }
  }

  // Check meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/s);
  if (!descMatch) {
    errors.push(`${relPath}: Missing meta description`);
  } else {
    const desc = descMatch[1].trim();
    if (!desc || desc.includes('undefined') || desc.includes('NaN')) {
      errors.push(`${relPath}: Empty or placeholder meta description`);
    }
    if (descriptions.has(desc)) {
      warnings.push(`${relPath}: Duplicate meta description (also in ${descriptions.get(desc)})`);
    } else {
      descriptions.set(desc, relPath);
    }
  }

  // Check canonical
  if (!html.includes('rel="canonical"')) {
    errors.push(`${relPath}: Missing canonical link`);
  }

  // Check lang attribute
  if (!html.match(/<html\s+lang="/)) {
    errors.push(`${relPath}: Missing lang attribute on <html>`);
  }

  // Check for placeholder text
  const placeholders = ['undefined', 'NaN', '[object Object]', 'null'];
  for (const ph of placeholders) {
    if (html.includes(`>${ph}<`) || html.includes(`="${ph}"`)) {
      errors.push(`${relPath}: Contains placeholder text "${ph}"`);
    }
  }

  // Check h1 count
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    errors.push(`${relPath}: Missing <h1>`);
  } else if (h1Count > 1) {
    errors.push(`${relPath}: Multiple <h1> tags (${h1Count})`);
  }
}

// Check sitemap exists
const sitemapPath = join(distDir, 'sitemap-index.xml');
if (!existsSync(sitemapPath)) {
  warnings.push('Missing sitemap-index.xml in dist/');
}

// Report
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`  ${w}`));
}

if (errors.length > 0) {
  console.error('\n❌ Validation errors:');
  errors.forEach(e => console.error(`  ${e}`));
  console.error(`\n${errors.length} error(s) found. Build failed.`);
  process.exit(1);
} else {
  console.log(`\n✅ Validation passed: ${htmlFiles.length} HTML files checked, no errors.`);
}
