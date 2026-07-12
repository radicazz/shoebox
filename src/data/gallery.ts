import rawGalleryData from './gallery.json';
import { GALLERY_ITEM_SIZES, validateGalleryData } from './validate-gallery.mjs';

export { GALLERY_ITEM_SIZES, validateGalleryData };
type GalleryItemSize = 'text' | 'tall' | 'wide';

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

validateGalleryData(rawGalleryData);
export const galleryData = rawGalleryData as GalleryData;
