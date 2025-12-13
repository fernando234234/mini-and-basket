import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { GalleryCollection, COLLECTION_TYPE_LABELS, getPhotoCountText } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Galleria | Mini & Basket Camp 2025",
  description: "Scopri i momenti più belli del Mini & Basket Camp attraverso foto e video delle nostre edizioni precedenti.",
};

// Force dynamic rendering to fetch fresh data
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

interface CollectionWithCount extends GalleryCollection {
  photo_count: number;
}

async function getCollections(): Promise<CollectionWithCount[]> {
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    console.log('Supabase not configured, returning empty collections');
    return [];
  }
  
  try {
    // Fetch collections ordered by year (newest first) and order_index
    const { data: collections, error: collectionsError } = await supabase
      .from('gallery_collections')
      .select('*')
      .order('year', { ascending: false, nullsFirst: false })
      .order('order_index', { ascending: true });
    
    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError);
      return [];
    }
    
    if (!collections || collections.length === 0) {
      return [];
    }
    
    // Get photo counts for each collection
    const collectionsWithCounts: CollectionWithCount[] = await Promise.all(
      collections.map(async (collection) => {
        const { count, error: countError } = await supabase
          .from('gallery_photos')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collection.id);
        
        if (countError) {
          console.error(`Error counting photos for collection ${collection.id}:`, countError);
        }
        
        return {
          ...collection,
          photo_count: count || 0,
        };
      })
    );
    
    return collectionsWithCounts;
  } catch (error) {
    console.error('Error in getCollections:', error);
    return [];
  }
}

export default async function GalleriaPage() {
  const collections = await getCollections();
  
  // Group collections by type for better organization
  const campCollections = collections.filter(c => c.collection_type === 'camp');
  const oneDayCampCollections = collections.filter(c => c.collection_type === 'one_day_camp');
  const eventCollections = collections.filter(c => c.collection_type === 'event');
  
  return (
    <>
      <Navigation />
      <div className="max-w-[1440px] mx-auto" id="page-container">
        <main className="p-4 md:p-8">
          <PageHero
            title="GALLERIA"
            subtitle="Rivivi i momenti più emozionanti delle nostre edizioni precedenti"
            badge="📸 I Nostri Momenti"
            backgroundImage="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&q=80"
            gradient="orange"
          />

          {/* Stats */}
          {collections.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-brand-orange">{collections.length}</p>
                  <p className="text-sm text-brand-gray">Collezioni</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-green">
                    {collections.reduce((acc, c) => acc + c.photo_count, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-brand-gray">Foto Totali</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-blue">{campCollections.length}</p>
                  <p className="text-sm text-brand-gray">Camp Estivi</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-500">{oneDayCampCollections.length}</p>
                  <p className="text-sm text-brand-gray">One Day Camp</p>
                </div>
              </div>
            </div>
          )}

          {/* Camp Collections */}
          {campCollections.length > 0 && (
            <section className="mt-12">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-2">
                  🏀 Camp Estivi
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                  LE NOSTRE EDIZIONI
                </h2>
              </div>
              <CollectionGrid collections={campCollections} />
            </section>
          )}

          {/* One Day Camp Collections */}
          {oneDayCampCollections.length > 0 && (
            <section className="mt-16">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-brand-green/10 text-brand-green text-sm font-bold rounded-full mb-2">
                  📍 One Day Camp
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                  EVENTI NELLE CITTÀ
                </h2>
              </div>
              <CollectionGrid collections={oneDayCampCollections} />
            </section>
          )}

          {/* Event Collections */}
          {eventCollections.length > 0 && (
            <section className="mt-16">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 text-sm font-bold rounded-full mb-2">
                  🎉 Eventi Speciali
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                  MOMENTI SPECIALI
                </h2>
              </div>
              <CollectionGrid collections={eventCollections} />
            </section>
          )}

          {/* Empty State */}
          {collections.length === 0 && (
            <div className="mt-12 text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                Galleria in arrivo
              </h3>
              <p className="text-brand-gray max-w-md mx-auto">
                Stiamo preparando la galleria fotografica con tutti i momenti 
                migliori delle nostre edizioni. Torna presto!
              </p>
            </div>
          )}

          {/* Video Section */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-4">
                🎬 Video
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                I NOSTRI VIDEO
              </h2>
              <p className="text-brand-gray mt-2">
                Guarda i momenti più emozionanti delle nostre edizioni
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"
                    alt="Video Camp 2024"
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform group-hover:bg-brand-orange-dark">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-brand-orange text-white text-sm font-bold rounded-full">
                      Camp 2024
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-brand-dark">Highlights Camp 2024</h3>
                  <p className="text-sm text-brand-gray mt-1">
                    I migliori momenti dell&apos;edizione 2024 del Mini & Basket Camp
                  </p>
                </div>
              </div>

              {/* Video 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80"
                    alt="Video Behind the Scenes"
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform group-hover:bg-brand-green-dark">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-brand-green text-white text-sm font-bold rounded-full">
                      Behind the Scenes
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-brand-dark">Dietro le Quinte</h3>
                  <p className="text-sm text-brand-gray mt-1">
                    Scopri come si svolge una giornata tipo al nostro camp
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

// Collection Grid Component
function CollectionGrid({ collections }: { collections: CollectionWithCount[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

// Collection Card Component
function CollectionCard({ collection }: { collection: CollectionWithCount }) {
  const placeholderImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80";
  const coverImage = collection.cover_image_url || placeholderImage;
  
  return (
    <Link
      href={`/galleria/${collection.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={coverImage}
          alt={collection.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Photo Count Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold rounded-full shadow-lg">
            📷 {collection.photo_count}
          </span>
        </div>
        
        {/* Collection Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg ${
            collection.collection_type === 'camp' 
              ? 'bg-brand-orange' 
              : collection.collection_type === 'one_day_camp'
                ? 'bg-brand-green'
                : 'bg-purple-500'
          }`}>
            {COLLECTION_TYPE_LABELS[collection.collection_type]}
          </span>
        </div>
        
        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg drop-shadow-lg">
            {collection.name}
          </h3>
          {collection.year && (
            <p className="text-white/80 text-sm">
              Anno {collection.year}
            </p>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4">
        {collection.description && (
          <p className="text-sm text-brand-gray line-clamp-2 mb-3">
            {collection.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-gray">
            {getPhotoCountText(collection.photo_count)}
          </span>
          
          <span className="inline-flex items-center text-sm font-semibold text-brand-orange group-hover:translate-x-1 transition-transform">
            Vedi foto
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}