#!/usr/bin/env node
/**
 * Create Gallery Bucket Script
 * Creates the gallery bucket on Supabase and sets it to public
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
    console.log('✅ Loaded environment variables from .env.local');
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🏀 Creating Gallery Bucket...');
console.log(`   Supabase URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      process.exit(1);
    }
    
    console.log('📦 Existing buckets:', buckets.map(b => b.name).join(', ') || 'none');
    
    const galleryExists = buckets.some(b => b.id === 'gallery');
    
    if (galleryExists) {
      console.log('✅ Gallery bucket already exists');
      
      // Update to make it public
      const { error: updateError } = await supabase.storage.updateBucket('gallery', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (updateError) {
        console.error('❌ Error updating bucket:', updateError.message);
      } else {
        console.log('✅ Gallery bucket updated to be public');
      }
    } else {
      // Create the bucket
      const { data, error: createError } = await supabase.storage.createBucket('gallery', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        process.exit(1);
      }
      
      console.log('✅ Gallery bucket created successfully!');
    }
    
    // Test access
    const { data: testData } = supabase.storage
      .from('gallery')
      .getPublicUrl('test.jpg');
    
    console.log('🔗 Public URL format:', testData.publicUrl);
    console.log('\n✅ Done! The gallery bucket is now public.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

main();