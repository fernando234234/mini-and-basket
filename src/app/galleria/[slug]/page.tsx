import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { GalleryCollection, GalleryPhoto, COLLECTION_TYPE_LABELS } from "@/types/gallery";
import CollectionGalleryGrid from "./CollectionGalleryGrid";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Helper to create Supabase client for server-side
function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string): Promise<GalleryCollection | null> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('gallery_collections')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
  
  return data;
}

async function getPhotos(collectionId: string): Promise<GalleryPhoto[]> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
  
  return data || [];
}

// Generate metadata dynamically
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  
  if (!collection) {
    return {
      title: "Collezione non trovata | Mini & Basket Camp",
    };
  }
  
  return {
    title: `${collection.name} | Galleria Mini & Basket Camp`,
    description: collection.description || `Foto dalla collezione ${collection.name} del Mini & Basket Camp`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  
  if (!collection) {
    notFound();
  }
  
  const photos = await getPhotos(collection.id);
  
  // Get a hero image - use cover image or first photo
  const heroImage = collection.cover_image_url || 
    photos[0]?.url || 
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80";
  
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-brand-gray hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-brand-gray">/</li>
              <li>
                <Link href="/galleria" className="text-brand-gray hover:text-brand-orange transition-colors">
                  Galleria
                </Link>
              </li>
              <li className="text-brand-gray">/</li>
              <li className="text-brand-dark font-medium">{collection.name}</li>
            </ol>
          </nav>

          <PageHero
            title={collection.name.toUpperCase()}
            subtitle={collection.description || `Foto e ricordi dalla nostra collezione`}
            badge={`📸 ${COLLECTION_TYPE_LABELS[collection.collection_type]}`}
            backgroundImage={heroImage}
            gradient={collection.collection_type === 'camp' ? 'orange' : 'green'}
          />

          {/* Collection Info */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {collection.year && (
                  <div className="px-4 py-2 bg-brand-orange/10 rounded-xl">
                    <p className="text-xs text-brand-gray mb-1">Anno</p>
                    <p className="text-xl font-bold text-brand-orange">{collection.year}</p>
                  </div>
                )}
                <div className="px-4 py-2 bg-brand-green/10 rounded-xl">
                  <p className="text-xs text-brand-gray mb-1">Foto</p>
                  <p className="text-xl font-bold text-brand-green">{photos.length}</p>
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-xl">
                  <p className="text-xs text-brand-gray mb-1">Tipo</p>
                  <p className="text-sm font-bold text-brand-dark">
                    {COLLECTION_TYPE_LABELS[collection.collection_type]}
                  </p>
                </div>
              </div>
              
              <Link
                href="/galleria"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-dark rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna alla Galleria
              </Link>
            </div>
          </div>

          {/* Photo Grid */}
          <section className="mt-8">
            {photos.length > 0 ? (
              <CollectionGalleryGrid photos={photos} collectionName={collection.name} />
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">
                  Nessuna foto disponibile
                </h3>
                <p className="text-brand-gray max-w-md mx-auto">
                  Le foto per questa collezione non sono ancora disponibili.
                  Torna presto per vedere gli aggiornamenti!
                </p>
                <Link
                  href="/galleria"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Torna alla Galleria
                </Link>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}