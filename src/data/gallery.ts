import rawGalleryData from './gallery.json';
import { validateGalleryData } from './validate-gallery.mjs';

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
