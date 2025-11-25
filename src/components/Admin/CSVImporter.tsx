import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Trash2, Download } from 'lucide-react';
import { parseCSV, convertCSVToProducts } from '../../utils/csvImporter';
import { PermanentProductStorage } from '../../utils/productStorage';
import { Product } from '../../types';

interface CSVImporterProps {
  onImport: (products: Product[]) => void;
  onClearAll: () => void;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ onImport, onClearAll }) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    count?: number;
  }>({ type: null, message: '' });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (csvFile) {
      processFile(csvFile);
    } else {
      setImportStatus({
        type: 'error',
        message: 'Please upload a CSV file'
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      const content = await file.text();
      console.log('CSV Content:', content.substring(0, 500)); // Debug log
      
      const csvProducts = parseCSV(content);
      console.log('Parsed CSV Products:', csvProducts); // Debug log
      
      if (csvProducts.length === 0) {
        throw new Error('No valid products found in CSV file. Make sure your CSV has a header row and product data.');
      }

      const products = convertCSVToProducts(csvProducts);
      console.log('Converted Products:', products); // Debug log

      // SAFETY: Don't clear existing products, ADD to them instead
      console.log('🛡️ SAFETY: Adding CSV products to existing products instead of replacing');
      onImport(products);
      setImportStatus({
        type: 'success',
        message: `✅ ${products.length} products imported successfully! They have been ADDED to your existing products.`,
        count: products.length
      });
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to import CSV file'
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ DANGER: This will remove ALL current products!\n\nAre you absolutely sure? This action cannot be undone.\n\nClick OK only if you want to completely clear all products.')) {
      onClearAll();
      setImportStatus({
        type: 'success',
        message: '⚠️ All products have been removed. Import your CSV now or products will be empty!'
      });
    }
  };

  const downloadTemplate = () => {
    const template = `name,description,price,weight,category,images,inStock,featured,seoTitle,seoDescription,seoKeywords
"Wooden Train Engine","Classic wooden train engine with authentic railway details perfect for imaginative play",35.00,0.8,wooden-trains,"https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800",true,true,"","",""
"Steam Locomotive Toy","Beautiful steam locomotive with moving parts and realistic details",42.00,1.2,wooden-trains,"https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800",true,true,"","",""
"Freight Train Set","Complete freight train with multiple cars and locomotive",48.00,2.5,wooden-trains,"https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800",true,false,"","",""
"Baby Rattle","Safe wooden rattle for babies and toddlers with smooth finish",15.00,0.2,wooden-baby-toys,"https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",true,false,"","",""
"Wooden Dump Truck","Heavy-duty wooden dump truck with tilting bed",28.00,1.8,wooden-trucks,"https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800",true,false,"","",""`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-2">CSV Import Instructions</h3>
            <p className="text-sm text-amber-700 mb-3">
              Your CSV file should have these columns (column names are flexible):
            </p>
            <div className="text-xs text-amber-600 space-y-1">
              <div><strong>Required:</strong> name, description, price, weight</div>
              <div><strong>Important:</strong> category should match: wooden-trains, wooden-baby-toys, wooden-trucks, etc.</div>
              <div><strong>Images:</strong> Use full URLs like https://images.pexels.com/... (separated by | ; , or newlines)</div>
              <div><strong>SEO:</strong> seoTitle, seoDescription, seoKeywords (auto-generated if not provided)</div>
              <div className="mt-2 text-amber-700">
                <strong>Auto-Detection:</strong> Categories detected from names: "train" → wooden-trains, "baby" → wooden-baby-toys, etc.
              </div>
              <div className="text-amber-700">
                <strong>Train Keywords:</strong> train, railway, locomotive, engine, steam, freight, passenger, carriage, wagon
              </div>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="ml-4 bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download size={14} />
            <span>Template</span>
          </button>
        </div>
      </div>

      {/* Clear All Products Button */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-800">Remove Current Products</h4>
            <p className="text-sm text-red-600">Clear all current products before importing your CSV</p>
          </div>
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Upload className="text-amber-600" size={24} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Your Products CSV
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            
            <label className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer">
              <FileText size={16} className="mr-2" />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="text-xs text-gray-500">
            Supported formats: .csv files only
          </div>
        </div>
      </div>

      {/* Import Status */}
      {importStatus.type && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          importStatus.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <AlertCircle className="text-red-600" size={20} />
          )}
          <div>
            <p className={`font-medium ${
              importStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {importStatus.message}
            </p>
            {importStatus.count && (
              <p className="text-sm text-green-600">
                {importStatus.count} products imported
              </p>
            )}
          </div>
        </div>
      )}

      {importing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
            <span className="text-gray-600">Processing your CSV file...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImporter;