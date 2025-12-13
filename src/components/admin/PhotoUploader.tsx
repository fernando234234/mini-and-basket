'use client'

import { useState } from 'react'
import { GalleryPhotoInsert, GALLERY_CATEGORIES, GALLERY_YEARS } from '@/types/gallery'

interface PhotoUploaderProps {
  onSubmit: (photo: GalleryPhotoInsert) => void
  onCancel: () => void
  initialData?: GalleryPhotoInsert
  isEditing?: boolean
}

export default function PhotoUploader({ onSubmit, onCancel, initialData, isEditing = false }: PhotoUploaderProps) {
  const [formData, setFormData] = useState<GalleryPhotoInsert>(
    initialData || {
      url: '',
      alt_text: '',
      year: new Date().getFullYear(),
      category: 'allenamenti',
      featured: false,
      sort_order: 0,
    }
  )
  const [previewError, setPreviewError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifica Foto' : 'Aggiungi Nuova Foto'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Immagine *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value })
                  setPreviewError(false)
                }}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              {formData.url && (
                <div className="mt-3">
                  {!previewError ? (
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      <span>Impossibile caricare l&apos;anteprima</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo / Testo Alternativo *
              </label>
              <input
                type="text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Descrizione della foto"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Year and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anno *
                </label>
                <select
                  value={formData.year ?? new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  {GALLERY_YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category ?? 'allenamenti'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryPhotoInsert['category'] })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                >
                  {GALLERY_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordine di visualizzazione
              </label>
              <input
                type="number"
                value={formData.sort_order ?? 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Numeri più bassi vengono mostrati prima</p>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Mostra nella galleria homepage
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors"
              >
                {isEditing ? 'Salva Modifiche' : 'Aggiungi Foto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}