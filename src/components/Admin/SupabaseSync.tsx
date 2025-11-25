import React, { useState } from 'react';
import { Database, Upload, Download, RefreshCw, CheckCircle, AlertCircle, Zap, Shield } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { Product } from '../../types';

interface SupabaseSyncProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
}

const SupabaseSync: React.FC<SupabaseSyncProps> = ({ products, onProductsUpdate }) => {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isConnected = !!supabase;
  const isAdminConnected = !!supabaseAdmin;

  const syncToSupabase = async () => {
    console.log('🔄 Starting sync to Supabase...');
    console.log('🔐 Admin client available:', !!supabaseAdmin);
    console.log('📦 Products to sync:', products.length);
    
    if (!supabaseAdmin) {
      console.error('❌ Admin client not available');
      setStatus('error');
      setMessage('Supabase admin client not connected. Service role key may be missing.');
      return;
    }

    setSyncing(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log(`🔐 Step 1: Using admin client to sync ${products.length} products to Supabase...`);
      
      // Test basic connection first
      console.log('🧪 Testing basic database connection...');
      const { data: testData, error: testError } = await supabaseAdmin
        .from('products')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('✅ Database connection successful');

      // Step 2: Use upsert instead of insert to handle existing products
      console.log('🔄 Step 2: Using upsert to handle existing products...');

      // Step 3: Prepare products for database format
      console.log('📝 Step 3: Converting products to database format...');
      const supabaseProducts = products.map(product => {
        const dbProduct = {
          id: product.id || `SQ${Math.floor(Math.random() * 10000000)}`,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: product.images,
          in_stock: product.inStock,
          featured: product.featured,
          weight: product.weight || 0.5,
          stock_quantity: product.stockQuantity || 5
        };
        
        console.log(`📦 Prepared product: ${dbProduct.name} (ID: ${dbProduct.id})`);
        return dbProduct;
      });
      
      console.log('✅ Products converted to database format');
      console.log('📊 Sample product:', supabaseProducts[0]);

      // Step 4: Insert products in batches to avoid timeout
      console.log('📤 Step 4: Inserting products to database...');
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < supabaseProducts.length; i += batchSize) {
        batches.push(supabaseProducts.slice(i, i + batchSize));
      }
      
      console.log(`📦 Inserting ${batches.length} batches of products...`);
      
      let totalInserted = 0;
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`📤 Inserting batch ${i + 1}/${batches.length} (${batch.length} products)...`);
        console.log(`📦 Batch ${i + 1} sample product:`, batch[0]);
        
        const { data: batchData, error: batchError } = await supabaseAdmin
          .from('products')
          .upsert(batch, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select();
        
        if (batchError) {
          console.error(`❌ Batch ${i + 1} failed:`, batchError);
          console.error(`❌ Failed batch data:`, batch);
          throw new Error(`Batch ${i + 1} failed: ${batchError.message}`);
        }
        
        totalInserted += batchData.length;
        console.log(`✅ Batch ${i + 1} completed: ${batchData.length} products inserted`);
      }
      
      // Final verification
      const { data: finalData, error: finalError } = await supabaseAdmin
        .from('products')
        .select('*');

      if (finalError) {
        console.error('❌ Final verification failed:', finalError);
        throw new Error(`Final verification failed: ${finalError.message}`);
      }

      setStatus('success');
      setMessage(`✅ Successfully synced ${totalInserted} products to Supabase with admin permissions! Database now has ${finalData.length} total products. You can now add products directly on your live site with permanent saving.`);
      
      console.log(`✅ SYNC COMPLETE: ${totalInserted} products synced to Supabase with admin client`);
      console.log(`📊 Database verification: ${finalData.length} total products in database`);

    } catch (error) {
      console.error('❌ DETAILED SYNC ERROR:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error type');
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      setStatus('error');
      setMessage(`❌ Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check browser console for details.`);
    } finally {
      setSyncing(false);
    }
  };

  const loadFromSupabase = async () => {
    if (!supabase) {
      setStatus('error');
      setMessage('Supabase not connected. Please check your configuration.');
      return;
    }

    setSyncing(true);
    setStatus('idle');

    try {
      console.log('📖 Using public client to load products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Convert Supabase data to Product format
        const supabaseProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          category: item.category,
          images: item.images || ['/FB_IMG_1640827671355.jpg'],
          inStock: item.in_stock,
          featured: item.featured,
          weight: item.weight,
          stockQuantity: item.stock_quantity || 5,
          seoTitle: item.seo_title,
          seoDescription: item.seo_description,
          seoKeywords: item.seo_keywords,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        onProductsUpdate(supabaseProducts);
        setStatus('success');
        setMessage(`✅ Loaded ${supabaseProducts.length} products from Supabase`);
      }

    } catch (error) {
      console.error('❌ Load error:', error);
      setStatus('error');
      setMessage(`Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
        <h3 className="text-2xl font-bold mb-2 flex items-center">
          <Zap className="mr-3" size={28} />
          {isAdminConnected ? '✅ Admin Database Connected - Permanent Saves Enabled!' : '⚠️ Admin Access Missing - Limited Save Permissions'}
        </h3>
        <p className="text-lg">
          {isAdminConnected ? 'Perfect! Your edits now save permanently with full admin permissions.' : 'Service role key needed for permanent database saves.'}
        </p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${
          isConnected 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <div>
              <p className={`font-medium ${
                isConnected ? 'text-green-800' : 'text-red-800'
              }`}>
                {isConnected ? '✅ Public Client Connected' : '❌ Public Client Missing'}
              </p>
              <p className={`text-sm ${
                isConnected ? 'text-green-700' : 'text-red-700'
              }`}>
                {isConnected 
                  ? 'Can read products from database'
                  : 'Cannot connect to Supabase'
                }
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isAdminConnected 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {isAdminConnected ? (
              <Shield className="text-blue-600" size={20} />
            ) : (
              <AlertCircle className="text-yellow-600" size={20} />
            )}
            <div>
              <p className={`font-medium ${
                isAdminConnected ? 'text-blue-800' : 'text-yellow-800'
              }`}>
                {isAdminConnected ? '🔐 Admin Client Connected' : '⚠️ Admin Client Missing'}
              </p>
              <p className={`text-sm ${
                isAdminConnected ? 'text-blue-700' : 'text-yellow-700'
              }`}>
                {isAdminConnected 
                  ? 'Can save/edit products permanently'
                  : 'Service role key needed for saves'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
          status === 'success' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="text-green-500 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
          )}
          <div className={`text-sm ${
            status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            <p className="font-medium">{status === 'success' ? 'Success!' : 'Error'}</p>
            <p>{message}</p>
          </div>
        </div>
      )}

      {/* Sync Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Upload className="mr-2 text-blue-600" size={20} />
            Upload to Database
          </h4>
          <p className="text-gray-600 mb-4 text-sm">
            Upload your current {products.length} products to Supabase database using admin permissions. 
            After this, you can add products directly on your live site with permanent saving!
          </p>
          <button
            onClick={syncToSupabase}
            disabled={!isAdminConnected || syncing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {syncing ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Syncing with Admin Permissions...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Sync to Database (Admin)</span>
              </>
            )}
          </button>
          {!isAdminConnected && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Admin client required for permanent saves
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Download className="mr-2 text-green-600" size={20} />
            Load from Database
          </h4>
          <p className="text-gray-600 mb-4 text-sm">
            Load products from Supabase database. Use this to get the latest 
            products added through your live site admin panel.
          </p>
          <button
            onClick={loadFromSupabase}
            disabled={!isConnected || syncing}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {syncing ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Load from Database</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">🔧 Configuration Status</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>Supabase URL:</span>
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? '✅ Configured' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Anon Key:</span>
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? '✅ Configured' : '❌ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Service Role Key:</span>
            <span className={isAdminConnected ? 'text-blue-600' : 'text-yellow-600'}>
              {isAdminConnected ? '🔐 Admin Access' : '⚠️ Limited Access'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">🎯 Setup Instructions</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>✅ Step 1:</strong> Environment variables configured</p>
          <p><strong>✅ Step 2:</strong> Admin client with service role key ready</p>
          <p><strong>Step 3:</strong> Click "Sync to Database (Admin)" above to upload your products</p>
          <p><strong>Step 4:</strong> Deploy your website</p>
          <p><strong>Step 5:</strong> 🎉 Add products directly on your live site with permanent saving!</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl">
        <h4 className="text-xl font-bold mb-3">✨ Benefits with Admin Access</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p>🔐 Permanent saves with service role</p>
            <p>✅ Add products directly on live site</p>
            <p>✅ No more manual code editing</p>
            <p>✅ Instant updates for all visitors</p>
          </div>
          <div className="space-y-2">
            <p>✅ Real-time inventory management</p>
            <p>✅ Automatic backups in cloud</p>
            <p>✅ Bypass RLS policies safely</p>
            <p>✅ 100% FREE for your business size</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSync;