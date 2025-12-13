#!/usr/bin/env node
/**
 * Gallery Upload Script for Mini & Basket Camp
 * 
 * This script uploads images from local folders to Supabase Storage
 * and creates corresponding database records.
 * 
 * Usage:
 *   node scripts/upload-gallery.mjs --dry-run    # Preview what will be uploaded
 *   node scripts/upload-gallery.mjs              # Actually upload everything
 *   node scripts/upload-gallery.mjs --collection camp2024  # Upload specific collection
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Source folder containing downloaded images
  sourceFolder: 'C:\\Users\\ferna\\Downloads\\ImageAssistant_Batch_Image_Downloader\\www.miniandbasketcamp.it',
  
  // Supabase bucket name
  bucketName: 'gallery',
  
  // Supported image extensions
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  
  // Files to exclude (logos, etc.)
  excludePatterns: ['logo-og', 'logo_'],
  
  // Collection name mappings for better display names
  collectionNameMappings: {
    'camp2013': 'Camp 2013',
    'camp2014': 'Camp 2014',
    'camp2015': 'Camp 2015',
    'camp2016': 'Camp 2016',
    'camp2017': 'Camp 2017',
    'camp2018': 'Camp 2018',
    'camp2019': 'Camp 2019',
    'camp2021': 'Camp 2021',
    'Camp_2022_Mini_Basket_Camp': 'Camp 2022',
    'Camp_2023_Mini_Basket_Camp': 'Camp 2023',
    'Camp_2024': 'Camp 2024',
    'ed2019': 'Edizione 2019',
    'ed2020': 'Edizione 2020',
    'arzano': 'One Day Camp Arzano',
    'baiano': 'One Day Camp Baiano',
    'battipaglia': 'One Day Camp Battipaglia',
    'casalnuovo': 'One Day Camp Casalnuovo',
    'marigliano': 'One Day Camp Marigliano',
    'pontecagnano': 'One Day Camp Pontecagnano',
    'vico_equense': 'One Day Camp Vico Equense'
  },
  
  // Collection type detection
  oneDayCampLocations: ['arzano', 'baiano', 'battipaglia', 'casalnuovo', 'marigliano', 'pontecagnano', 'vico_equense']
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const specificCollection = args.find(arg => arg.startsWith('--collection='))?.split('=')[1] || 
                          (args.includes('--collection') ? args[args.indexOf('--collection') + 1] : null);

console.log('='.repeat(60));
console.log('🏀 Mini & Basket Camp Gallery Upload Script');
console.log('='.repeat(60));
console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (no actual uploads)' : '📤 LIVE UPLOAD'}`);
if (specificCollection) {
  console.log(`Collection filter: ${specificCollection}`);
}
console.log('');

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!');
    console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    console.error('');
    console.error('   You can set them by:');
    console.error('   1. Creating a .env.local file with these values');
    console.error('   2. Or running with environment variables:');
    console.error('      NEXT_PUBLIC_SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/upload-gallery.mjs');
    process.exit(1);
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Load environment variables from .env.local if exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ Loaded environment variables from .env.local');
  }
}

// Get all folders (collections) from source directory
function getCollectionFolders() {
  if (!fs.existsSync(CONFIG.sourceFolder)) {
    console.error(`❌ Source folder not found: ${CONFIG.sourceFolder}`);
    process.exit(1);
  }
  
  const folders = fs.readdirSync(CONFIG.sourceFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !specificCollection || name === specificCollection);
  
  return folders;
}

// Get all images from a folder
function getImagesFromFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  return fs.readdirSync(folderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isImage = CONFIG.supportedExtensions.includes(ext);
      const isExcluded = CONFIG.excludePatterns.some(pattern => file.toLowerCase().includes(pattern));
      return isImage && !isExcluded;
    });
}

// Parse collection info from folder name
function parseCollectionInfo(folderName) {
  const name = CONFIG.collectionNameMappings[folderName] || folderName.replace(/_/g, ' ');
  const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // Extract year from folder name
  const yearMatch = folderName.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Determine collection type
  const isOneDayCamp = CONFIG.oneDayCampLocations.includes(folderName.toLowerCase());
  const collectionType = isOneDayCamp ? 'one_day_camp' : 'camp';
  
  return {
    name,
    slug,
    year,
    collectionType
  };
}

// Generate a readable alt text for an image
function generateAltText(imageName, collectionName) {
  // Remove file extension and common prefixes
  const baseName = path.basename(imageName, path.extname(imageName))
    .replace(/^imgi_\d+_?/, '')
    .replace(/_m$/, '')
    .replace(/_master$/, '')
    .replace(/_/g, ' ')
    .trim();
  
  return `${collectionName}${baseName ? ' - ' + baseName : ''}`;
}

// Create or get collection from database
async function ensureCollection(supabase, collectionInfo) {
  // Check if collection exists
  const { data: existing, error: selectError } = await supabase
    .from('gallery_collections')
    .select('id')
    .eq('slug', collectionInfo.slug)
    .maybeSingle();
  
  if (selectError) {
    console.error(`❌ Error checking collection ${collectionInfo.slug}:`, selectError);
    return null;
  }
  
  if (existing) {
    console.log(`   📁 Collection exists: ${collectionInfo.name} (${existing.id})`);
    return existing.id;
  }
  
  // Create new collection
  const { data: newCollection, error: insertError } = await supabase
    .from('gallery_collections')
    .insert({
      name: collectionInfo.name,
      slug: collectionInfo.slug,
      year: collectionInfo.year,
      collection_type: collectionInfo.collectionType,
      description: `Foto dal ${collectionInfo.name}`
    })
    .select('id')
    .single();
  
  if (insertError) {
    console.error(`❌ Error creating collection ${collectionInfo.name}:`, insertError);
    return null;
  }
  
  console.log(`   ✨ Created collection: ${collectionInfo.name} (${newCollection.id})`);
  return newCollection.id;
}

// Upload a single image
async function uploadImage(supabase, localPath, storagePath, collectionId, collectionName, imageName) {
  // Read file
  const fileBuffer = fs.readFileSync(localPath);
  const mimeType = getMimeType(path.extname(imageName).toLowerCase());
  
  // Upload to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from(CONFIG.bucketName)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });
  
  if (storageError) {
    console.error(`   ❌ Storage error for ${imageName}:`, storageError.message);
    return false;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(CONFIG.bucketName)
    .getPublicUrl(storagePath);
  
  const publicUrl = urlData.publicUrl;
  
  // Insert database record
  const altText = generateAltText(imageName, collectionName);
  const { error: dbError } = await supabase
    .from('gallery_photos')
    .insert({
      url: publicUrl,
      alt_text: altText,
      collection_id: collectionId,
      storage_path: storagePath,
      featured: false
    });
  
  if (dbError) {
    // Check if it's a duplicate
    if (dbError.code === '23505') {
      console.log(`   ⏭️  Already exists: ${imageName}`);
      return true;
    }
    console.error(`   ❌ Database error for ${imageName}:`, dbError.message);
    return false;
  }
  
  return true;
}

// Get MIME type for image extension
function getMimeType(ext) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Update collection cover image
async function updateCollectionCover(supabase, collectionId, coverUrl) {
  const { error } = await supabase
    .from('gallery_collections')
    .update({ cover_image_url: coverUrl })
    .eq('id', collectionId);
  
  if (error) {
    console.error(`   ⚠️  Could not set cover image:`, error.message);
  }
}

// Main function
async function main() {
  loadEnvFile();
  
  const supabase = getSupabaseClient();
  
  // Get all collection folders
  const folders = getCollectionFolders();
  console.log(`📂 Found ${folders.length} collection folders\n`);
  
  // Statistics
  const stats = {
    collections: 0,
    images: 0,
    errors: 0,
    skipped: 0
  };
  
  // Process each collection
  for (const folderName of folders) {
    const folderPath = path.join(CONFIG.sourceFolder, folderName);
    const images = getImagesFromFolder(folderPath);
    const collectionInfo = parseCollectionInfo(folderName);
    
    console.log(`\n📁 ${collectionInfo.name}`);
    console.log(`   Folder: ${folderName}`);
    console.log(`   Images: ${images.length}`);
    console.log(`   Type: ${collectionInfo.collectionType}`);
    console.log(`   Year: ${collectionInfo.year || 'Unknown'}`);
    
    if (images.length === 0) {
      console.log('   ⏭️  Skipping (no images)');
      continue;
    }
    
    if (isDryRun) {
      console.log('   🔍 DRY RUN - Would upload:');
      images.slice(0, 5).forEach(img => console.log(`      - ${img}`));
      if (images.length > 5) {
        console.log(`      ... and ${images.length - 5} more`);
      }
      stats.collections++;
      stats.images += images.length;
      continue;
    }
    
    // Create or get collection
    const collectionId = await ensureCollection(supabase, collectionInfo);
    if (!collectionId) {
      stats.errors++;
      continue;
    }
    stats.collections++;
    
    // Upload images
    let firstImageUrl = null;
    let uploadedCount = 0;
    
    for (let i = 0; i < images.length; i++) {
      const imageName = images[i];
      const localPath = path.join(folderPath, imageName);
      const storagePath = `${collectionInfo.slug}/${imageName}`;
      
      process.stdout.write(`   📤 Uploading ${i + 1}/${images.length}: ${imageName.substring(0, 30)}...`);
      
      const success = await uploadImage(
        supabase,
        localPath,
        storagePath,
        collectionId,
        collectionInfo.name,
        imageName
      );
      
      if (success) {
        uploadedCount++;
        stats.images++;
        
        // Store first image URL for cover
        if (!firstImageUrl) {
          const { data: urlData } = supabase.storage
            .from(CONFIG.bucketName)
            .getPublicUrl(storagePath);
          firstImageUrl = urlData.publicUrl;
        }
        
        console.log(' ✅');
      } else {
        stats.errors++;
        console.log(' ❌');
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Set cover image if not already set
    if (firstImageUrl) {
      await updateCollectionCover(supabase, collectionId, firstImageUrl);
    }
    
    console.log(`   ✅ Uploaded ${uploadedCount}/${images.length} images`);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  console.log(`   Collections: ${stats.collections}`);
  console.log(`   Images: ${stats.images}`);
  console.log(`   Errors: ${stats.errors}`);
  
  if (isDryRun) {
    console.log('\n🔍 This was a DRY RUN. No actual uploads were made.');
    console.log('   Run without --dry-run to actually upload the images.');
  } else {
    console.log('\n✅ Upload complete!');
    console.log('   Check your Supabase dashboard to verify the uploads.');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});