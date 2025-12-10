'use client'

import { useState } from 'react'
import { GalleryPhoto, GalleryPhotoInsert, GALLERY_CATEGORIES, GALLERY_YEARS } from '@/types/gallery'
import PhotoUploader from './PhotoUploader'

interface GalleryManagerProps {
  photos: GalleryPhoto[]
  onAdd: (photo: GalleryPhotoInsert) => void
  onUpdate: (id: string, photo: GalleryPhotoInsert) => void
  onDelete: (id: string) => void
}

export default function GalleryManager({ photos, onAdd, onUpdate, onDelete }: GalleryManagerProps) {
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showUploader, setShowUploader] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null)
  const [deletingPhoto, setDeletingPhoto] = useState<GalleryPhoto | null>(null)

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesYear = yearFilter === 'all' || photo.year === parseInt(yearFilter)
    const matchesCategory = categoryFilter === 'all' || photo.category === categoryFilter
    return matchesYear && matchesCategory
  }).sort((a, b) => a.sort_order - b.sort_order)

  const handleAdd = (data: GalleryPhotoInsert) => {
    onAdd(data)
    setShowUploader(false)
  }

  const handleUpdate = (data: GalleryPhotoInsert) => {
    if (editingPhoto) {
      onUpdate(editingPhoto.id, data)
      setEditingPhoto(null)
    }
  }

  const handleDelete = () => {
    if (deletingPhoto) {
      onDelete(deletingPhoto.id)
      setDeletingPhoto(null)
    }
  }

  const getCategoryLabel = (category: string) => {
    return GALLERY_CATEGORIES.find(c => c.value === category)?.label || category
  }

  return (
    <div>
      {/* Header and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            >
              <option value="all">Tutti gli anni</option>
              {GALLERY_YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            >
              <option value="all">Tutte le categorie</option>
              {GALLERY_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Aggiungi Foto
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {filteredPhotos.length} foto trovate
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4">Nessuna foto trovata</p>
          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Aggiungi la prima foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-square">
                <img
                  src={photo.url}
                  alt={photo.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Modifica"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingPhoto(photo)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Elimina"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Featured badge */}
              {photo.featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-brand-orange text-white text-xs font-medium rounded">
                  In evidenza
                </div>
              )}

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{photo.alt_text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{photo.year}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{getCategoryLabel(photo.category)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showUploader && (
        <PhotoUploader
          onSubmit={handleAdd}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {editingPhoto && (
        <PhotoUploader
          onSubmit={handleUpdate}
          onCancel={() => setEditingPhoto(null)}
          initialData={{
            url: editingPhoto.url,
            alt_text: editingPhoto.alt_text,
            year: editingPhoto.year,
            category: editingPhoto.category,
            featured: editingPhoto.featured,
            sort_order: editingPhoto.sort_order,
          }}
          isEditing
        />
      )}

      {/* Delete Confirmation */}
      {deletingPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setDeletingPhoto(null)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Elimina foto</h3>
                  <p className="text-sm text-gray-500">Questa azione non può essere annullata</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={deletingPhoto.url}
                    alt={deletingPhoto.alt_text}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{deletingPhoto.alt_text}</p>
                    <p className="text-sm text-gray-500">{deletingPhoto.year} • {getCategoryLabel(deletingPhoto.category)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeletingPhoto(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}