#!/usr/bin/env node
/**
 * Check Gallery Data Script
 * Verifies gallery collections and photos in the database
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
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
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    console.log('📊 Checking Gallery Collections...\n');
    
    // Get all collections
    const { data: collections, error: collectionsError } = await supabase
      .from('gallery_collections')
      .select('id, name, slug, cover_image_url')
      .order('year', { ascending: false })
      .limit(5);
    
    if (collectionsError) {
      console.error('❌ Error:', collectionsError.message);
      return;
    }
    
    console.log('Collections (first 5):');
    collections.forEach(c => {
      console.log(`  - ${c.name} (${c.slug})`);
      console.log(`    Cover URL: ${c.cover_image_url || 'NULL'}`);
    });
    
    console.log('\n📸 Checking Gallery Photos...\n');
    
    // Get sample photos from the first collection
    if (collections.length > 0) {
      const { data: photos, error: photosError } = await supabase
        .from('gallery_photos')
        .select('id, collection_id, url, storage_path')
        .eq('collection_id', collections[0].id)
        .limit(3);
      
      if (photosError) {
        console.error('❌ Error:', photosError.message);
        return;
      }
      
      console.log(`Photos from "${collections[0].name}" (first 3):`);
      photos.forEach(p => {
        console.log(`  - ID: ${p.id}`);
        console.log(`    URL: ${p.url || 'NULL'}`);
        console.log(`    Storage Path: ${p.storage_path || 'NULL'}`);
      });
    }
    
    // Test a direct public URL
    console.log('\n🔗 Testing Public URL Format...');
    const testUrl = `${supabaseUrl}/storage/v1/object/public/gallery/camp-2024/test.jpg`;
    console.log(`  Format: ${testUrl}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();