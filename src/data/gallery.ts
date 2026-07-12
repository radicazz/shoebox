import rawGalleryData from './gallery.json';

export const GALLERY_ITEM_SIZES = ['text', 'tall', 'wide'] as const;
type GalleryItemSize = (typeof GALLERY_ITEM_SIZES)[number];

export interface GalleryProfile {
  name: string;
  photo: string;
  repository: string;
  about: string;
  skills: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  size: GalleryItemSize;
  tags: string[];
  link: string;
}

export interface GalleryData {
  title: string;
  description: string;
  profile: GalleryProfile;
  items: GalleryItem[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const requireString = (value: unknown, name: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`gallery.json: ${name} must be a non-empty string`);
  }
  return value;
};

const requireUrl = (value: unknown, name: string) => {
  const url = requireString(value, name);
  if (!/^https:\/\//.test(url)) {
    throw new Error(`gallery.json: ${name} must use https`);
  }
  return url;
};

const requireStringList = (value: unknown, name: string) => {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`gallery.json: ${name} must be a non-empty list of strings`);
  }
  return value;
};

export const validateGalleryData = (value: unknown): asserts value is GalleryData => {
  if (!isRecord(value)) throw new Error('gallery.json: expected an object');
  requireString(value.title, 'title');
  requireString(value.description, 'description');

  if (!isRecord(value.profile)) throw new Error('gallery.json: profile is required');
  requireString(value.profile.name, 'profile.name');
  requireString(value.profile.photo, 'profile.photo');
  requireUrl(value.profile.repository, 'profile.repository');
  requireString(value.profile.about, 'profile.about');
  requireStringList(value.profile.skills, 'profile.skills');

  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new Error('gallery.json: items must be a non-empty list');
  }

  const ids = new Set<string>();
  for (const [index, item] of value.items.entries()) {
    if (!isRecord(item)) throw new Error(`gallery.json: items[${index}] must be an object`);
    const id = requireString(item.id, `items[${index}].id`);
    if (ids.has(id)) throw new Error(`gallery.json: duplicate item id "${id}"`);
    ids.add(id);
    requireString(item.title, `items[${index}].title`);
    requireString(item.description, `items[${index}].description`);
    if (!GALLERY_ITEM_SIZES.includes(item.size as GalleryItemSize)) {
      throw new Error(`gallery.json: items[${index}].size must be text, tall, or wide`);
    }
    requireStringList(item.tags, `items[${index}].tags`);
    requireUrl(item.link, `items[${index}].link`);
  }
};

validateGalleryData(rawGalleryData);
export const galleryData = rawGalleryData as GalleryData;
