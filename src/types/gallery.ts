export interface GalleryPhoto {
  id: string
  created_at: string
  updated_at: string
  url: string
  alt_text: string
  year: number
  category: 'allenamenti' | 'partite' | 'attivita' | 'gruppo'
  featured: boolean
  sort_order: number
}

export type GalleryPhotoInsert = Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>

export const GALLERY_CATEGORIES = [
  { value: 'allenamenti', label: 'Allenamenti' },
  { value: 'partite', label: 'Partite' },
  { value: 'attivita', label: 'Attività' },
  { value: 'gruppo', label: 'Gruppo' },
] as const

export const GALLERY_YEARS = [2024, 2023, 2022, 2021, 2020] as const