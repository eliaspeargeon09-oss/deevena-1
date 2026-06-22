/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryPhoto {
  id: number;
  title: string;
  message: string;
  defaultImage: string;
  userImage?: string; // base64 string from localStorage if customized
}

export interface CleaningItem {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  x: number; // percentage coordinate 0-100 on screen
  y: number; // percentage coordinate 0-100 on screen
  isCleaned: boolean;
  targetBin: 'dustbin' | 'laundry' | 'shelf';
  color: string;
}

export interface GiftOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}
