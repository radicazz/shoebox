import fs from 'node:fs';
import { validateGalleryData } from '../src/data/validate-gallery.mjs';

const data = JSON.parse(fs.readFileSync(new URL('../src/data/gallery.json', import.meta.url), 'utf8'));
validateGalleryData(data);
