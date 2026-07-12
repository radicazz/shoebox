export const GALLERY_ITEM_SIZES = ['text', 'tall', 'wide'];

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const requireString = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`gallery.json: ${name} must be a non-empty string`);
  }
  return value;
};

const requireUrl = (value, name) => {
  const url = requireString(value, name);
  if (!/^https:\/\//.test(url)) {
    throw new Error(`gallery.json: ${name} must use https`);
  }
  return url;
};

const requireStringList = (value, name) => {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`gallery.json: ${name} must be a non-empty list of strings`);
  }
  return value;
};

export const validateGalleryData = (value) => {
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

  const ids = new Set();
  for (const [index, item] of value.items.entries()) {
    if (!isRecord(item)) throw new Error(`gallery.json: items[${index}] must be an object`);
    const id = requireString(item.id, `items[${index}].id`);
    if (ids.has(id)) throw new Error(`gallery.json: duplicate item id "${id}"`);
    ids.add(id);
    requireString(item.title, `items[${index}].title`);
    requireString(item.description, `items[${index}].description`);
    if (!GALLERY_ITEM_SIZES.includes(item.size)) {
      throw new Error(`gallery.json: items[${index}].size must be text, tall, or wide`);
    }
    requireStringList(item.tags, `items[${index}].tags`);
    requireUrl(item.link, `items[${index}].link`);
  }
};
