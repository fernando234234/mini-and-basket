'use client'

import { useState } from 'react'
import { mockGalleryPhotos } from '@/lib/mockData'
import { GalleryPhoto, GalleryPhotoInsert } from '@/types/gallery'
import GalleryManager from '@/components/admin/GalleryManager'

export default function AdminGalleriaPage() {
  // In a real app, this would be fetched from Supabase
  const [photos, setPhotos] = useState<GalleryPhoto[]>(mockGalleryPhotos)

  const handleAdd = (data: GalleryPhotoInsert) => {
    const newPhoto: GalleryPhoto = {
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    }
    setPhotos(prev => [newPhoto, ...prev])
    // In a real app, this would insert into Supabase
    console.log('Added photo:', newPhoto)
  }

  const handleUpdate = (id: string, data: GalleryPhotoInsert) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === id
          ? { ...photo, ...data, updated_at: new Date().toISOString() }
          : photo
      )
    )
    // In a real app, this would update Supabase
    console.log(`Updated photo ${id}:`, data)
  }

  const handleDelete = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id))
    // In a real app, this would delete from Supabase
    console.log(`Deleted photo ${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Galleria</h1>
          <p className="text-gray-500">Aggiungi, modifica o rimuovi foto dalla galleria</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Suggerimento</p>
            <p className="text-sm text-blue-700 mt-1">
              Le foto contrassegnate come &quot;In evidenza&quot; appariranno nella galleria della homepage. 
              Usa l&apos;ordine di visualizzazione per controllare la posizione delle foto.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Manager */}
      <GalleryManager
        photos={photos}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}