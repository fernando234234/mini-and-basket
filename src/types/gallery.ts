// Gallery Collection interface matching Supabase schema
export interface GalleryCollection {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  description?: string | null
  cover_image_url?: string | null
  year?: number | null
  collection_type: 'camp' | 'one_day_camp' | 'event'
  order_index: number
}

// Gallery Photo interface matching Supabase schema
export interface GalleryPhoto {
  id: string
  created_at: string
  updated_at?: string
  url: string
  storage_path?: string | null
  alt_text: string
  year?: number | null
  category?: 'allenamenti' | 'partite' | 'attivita' | 'gruppo' | null
  featured: boolean
  sort_order?: number
  collection_id?: string | null
  title?: string | null
  order_index?: number
}

// Insert types
export type GalleryCollectionInsert = Omit<GalleryCollection, 'id' | 'created_at' | 'updated_at'>
export type GalleryPhotoInsert = Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>

// Legacy constants for backward compatibility
export const GALLERY_CATEGORIES = [
  { value: 'allenamenti', label: 'Allenamenti' },
  { value: 'partite', label: 'Partite' },
  { value: 'attivita', label: 'Attività' },
  { value: 'gruppo', label: 'Gruppo' },
] as const

export const GALLERY_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013] as const

// Collection type labels for display
export const COLLECTION_TYPE_LABELS: Record<GalleryCollection['collection_type'], string> = {
  camp: 'Camp Estivo',
  one_day_camp: 'One Day Camp',
  event: 'Evento'
}

// Helper to get photo count text
export function getPhotoCountText(count: number): string {
  if (count === 0) return 'Nessuna foto'
  if (count === 1) return '1 foto'
  return `${count} foto`
}