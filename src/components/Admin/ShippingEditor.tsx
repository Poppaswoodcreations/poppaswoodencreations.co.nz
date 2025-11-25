import React, { useState, useEffect } from 'react';
import { Save, Truck, Globe, Plus, Trash2, Edit, MapPin } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

interface ShippingRate {
  id: string;
  name: string;
  description: string;
  weightMin: number;
  weightMax: number;
  price: number;
  estimatedDays: string;
}

interface ShippingEditorProps {
  onSave: (shippingData: any) => void;
}

const ShippingEditor: React.FC<ShippingEditorProps> = ({ onSave }) => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: 'nz',
      name: 'New Zealand',
      countries: ['NZ'],
      rates: [
        {
          id: 'nz-pickup',
          name: '🏪 FREE PICKUP',
          description: 'Pickup from Whangarei workshop (by appointment)',
          weightMin: 0,
          weightMax: 999,
          price: 0,
          estimatedDays: 'Same day pickup'
        },
        {
          id: 'nz-1kg',
          name: 'Standard Shipping',
          description: 'Up to 1kg',
          weightMin: 0,
          weightMax: 1,
          price: 8.50,
          estimatedDays: '3-5 business days'
        },
        {
          id: 'nz-2kg',
          name: 'Standard Shipping',
          description: '1-2kg',
          weightMin: 1,
          weightMax: 2,
          price: 12.00,
          estimatedDays: '3-5 business days'
        },
        {
          id: 'nz-3kg',
          name: 'Standard Shipping',
          description: '2-3kg',
          weightMin: 2,
          weightMax: 3,
          price: 18.00,
          estimatedDays: '3-5 business days'
        },
        {
          id: 'nz-4kg',
          name: 'Standard Shipping',
          description: '3-4kg',
          weightMin: 3,
          weightMax: 4,
          price: 25.00,
          estimatedDays: '3-5 business days'
        },
        {
          id: 'nz-5kg',
          name: 'Standard Shipping',
          description: '4-5kg',
          weightMin: 4,
          weightMax: 5,
          price: 30.00,
          estimatedDays: '3-5 business days'
        }
      ]
    },
    {
      id: 'au',
      name: 'Australia',
      countries: ['AU'],
      rates: [
        {
          id: 'au-1kg',
          name: 'Standard Shipping',
          description: 'Up to 1kg',
          weightMin: 0,
          weightMax: 1,
          price: 25.00,
          estimatedDays: '7-14 business days'
        },
        {
          id: 'au-5kg',
          name: 'Standard Shipping',
          description: '1-5kg',
          weightMin: 1,
          weightMax: 5,
          price: 35.00,
          estimatedDays: '7-14 business days'
        }
      ]
    },
    {
      id: 'us-ca',
      name: 'USA & Canada',
      countries: ['US', 'CA'],
      rates: [
        {
          id: 'us-1kg',
          name: 'Standard Shipping',
          description: 'Up to 1kg',
          weightMin: 0,
          weightMax: 1,
          price: 35.00,
          estimatedDays: '10-21 business days'
        },
        {
          id: 'us-5kg',
          name: 'Standard Shipping',
          description: '1-5kg',
          weightMin: 1,
          weightMax: 5,
          price: 50.00,
          estimatedDays: '10-21 business days'
        }
      ]
    },
    {
      id: 'international',
      name: 'International',
      countries: ['*'],
      rates: [
        {
          id: 'intl-1kg',
          name: 'Standard Shipping',
          description: 'Up to 1kg',
          weightMin: 0,
          weightMax: 1,
          price: 50.00,
          estimatedDays: '14-28 business days'
        },
        {
          id: 'intl-5kg',
          name: 'Standard Shipping',
          description: '1-5kg',
          weightMin: 1,
          weightMax: 5,
          price: 70.00,
          estimatedDays: '14-28 business days'
        }
      ]
    }
  ]);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [ruralDeliveryFee, setRuralDeliveryFee] = useState(5);
  const [processingTime, setProcessingTime] = useState({
    inStock: '1-2 business days',
    custom: '2-4 weeks',
    large: '3-5 business days'
  });

  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [showRateForm, setShowRateForm] = useState(false);
  const [newRate, setNewRate] = useState<Omit<ShippingRate, 'id'>>({
    name: '',
    description: '',
    weightMin: 0,
    weightMax: 1,
    price: 0,
    estimatedDays: ''
  });

  // Load saved shipping settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-shipping-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.zones) setShippingZones(parsed.zones);
        if (parsed.freeShippingThreshold) setFreeShippingThreshold(parsed.freeShippingThreshold);
        if (parsed.ruralDeliveryFee) setRuralDeliveryFee(parsed.ruralDeliveryFee);
        if (parsed.processingTime) setProcessingTime(parsed.processingTime);
        console.log('📦 Loaded saved shipping settings');
      }
    } catch (error) {
      console.error('Error loading shipping settings:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      const shippingData = {
        zones: shippingZones,
        freeShippingThreshold,
        ruralDeliveryFee,
        processingTime,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('poppas-shipping-settings', JSON.stringify(shippingData));
      console.log('💾 Shipping settings saved to localStorage:', shippingData);
      
      // Also call the onSave callback
      onSave(shippingData);
      
      // Verify save
      const verification = localStorage.getItem('poppas-shipping-settings');
      if (verification) {
        console.log('✅ Shipping save verified');
        alert('Shipping settings saved successfully!');
      } else {
        throw new Error('Save verification failed');
      }
    } catch (error) {
      console.error('❌ Failed to save shipping settings:', error);
      alert('Failed to save shipping settings. Please try again.');
    }
  };

  const handleAddRate = (zoneId: string) => {
    console.log('🚛 Adding rate for zone:', zoneId);
    setEditingZone(zoneId);
    setNewRate({
      name: 'New Shipping Rate',
      description: 'Enter description',
      weightMin: 0,
      weightMax: 1,
      price: 0,
      estimatedDays: '3-5 business days'
    });
    setShowRateForm(true);
  };

  const handleSaveNewRate = () => {
    if (!editingZone) return;
    
    const rate: ShippingRate = {
      ...newRate,
      id: `rate-${Date.now()}-${Math.random()}`
    };

    console.log('💾 Saving new rate:', rate);

    setShippingZones(zones => zones.map(zone => 
      zone.id === editingZone 
        ? { ...zone, rates: [...zone.rates, rate] }
        : zone
    ));
    
    setShowRateForm(false);
    setEditingZone(null);
    setNewRate({
      name: '',
      description: '',
      weightMin: 0,
      weightMax: 1,
      price: 0,
      estimatedDays: ''
    });

    console.log('✅ Rate added successfully');
  };

  const updateRate = (zoneId: string, rateId: string, updatedRate: Partial<ShippingRate>) => {
    setShippingZones(zones => zones.map(zone => 
      zone.id === zoneId 
        ? {
            ...zone,
            rates: zone.rates.map(rate => 
              rate.id === rateId ? { ...rate, ...updatedRate } : rate
            )
          }
        : zone
    ));
  };

  const deleteRate = (zoneId: string, rateId: string) => {
    if (window.confirm('Are you sure you want to delete this shipping rate?')) {
      setShippingZones(zones => zones.map(zone => 
        zone.id === zoneId 
          ? { ...zone, rates: zone.rates.filter(rate => rate.id !== rateId) }
          : zone
      ));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Truck className="mr-3 text-amber-600" size={28} />
          Shipping Settings
        </h3>
        <button
          onClick={handleSave}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <Save size={16} />
          <span>Save All Changes</span>
        </button>
      </div>

      {/* Free Pickup Highlight */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <MapPin className="text-green-600" size={24} />
          <h4 className="text-xl font-bold text-green-800">🏪 FREE PICKUP AVAILABLE!</h4>
        </div>
        <p className="text-green-700 mb-2">
          <strong>Workshop Address:</strong> 102 Kiripaka Rd, Whangarei, New Zealand
        </p>
        <p className="text-green-700 text-sm">
          Customers can pickup orders directly from your workshop by appointment. 
          This saves shipping costs and lets customers see your craftsmanship in person!
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">General Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold (NZD)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Orders over this amount get free shipping</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rural Delivery Fee (NZD)
            </label>
            <input
              type="number"
              value={ruralDeliveryFee}
              onChange={(e) => setRuralDeliveryFee(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Additional fee for rural addresses</p>
          </div>
        </div>
      </div>

      {/* Processing Times */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Processing Times</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              In-Stock Items
            </label>
            <input
              type="text"
              value={processingTime.inStock}
              onChange={(e) => setProcessingTime({ ...processingTime, inStock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Orders
            </label>
            <input
              type="text"
              value={processingTime.custom}
              onChange={(e) => setProcessingTime({ ...processingTime, custom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Large Orders (10+ items)
            </label>
            <input
              type="text"
              value={processingTime.large}
              onChange={(e) => setProcessingTime({ ...processingTime, large: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="space-y-6">
        <h4 className="text-xl font-bold text-gray-900">Shipping Zones & Rates</h4>
        
        {shippingZones.map((zone) => (
          <div key={zone.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="mr-2 text-blue-600" size={20} />
                {zone.name}
                {zone.id === 'nz' && (
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    🏪 Pickup Available
                  </span>
                )}
              </h5>
              <button
                onClick={() => handleAddRate(zone.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <Plus size={16} />
                <span>Add Rate</span>
              </button>
            </div>

            <div className="space-y-3">
              {zone.rates.map((rate) => (
                <div key={rate.id} className={`border rounded-lg p-4 ${
                  rate.price === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Rate Name
                      </label>
                      <input
                        type="text"
                        value={rate.name}
                        onChange={(e) => updateRate(zone.id, rate.id, { name: e.target.value })}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={rate.description}
                        onChange={(e) => updateRate(zone.id, rate.id, { description: e.target.value })}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Min Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={rate.weightMin}
                        onChange={(e) => updateRate(zone.id, rate.id, { weightMin: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={rate.weightMax}
                        onChange={(e) => updateRate(zone.id, rate.id, { weightMax: parseFloat(e.target.value) || 1 })}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Price (NZD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={rate.price}
                        onChange={(e) => updateRate(zone.id, rate.id, { price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => deleteRate(zone.id, rate.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete rate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Estimated Delivery Time
                    </label>
                    <input
                      type="text"
                      value={rate.estimatedDays}
                      onChange={(e) => updateRate(zone.id, rate.id, { estimatedDays: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>

                  {rate.price === 0 && (
                    <div className="mt-2 bg-green-100 border border-green-300 rounded p-2">
                      <p className="text-green-800 text-xs font-medium">
                        🎉 FREE OPTION - This rate costs $0.00
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Rate Form Modal */}
      {showRateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Add New Shipping Rate
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate Name</label>
                <input
                  type="text"
                  value={newRate.name}
                  onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Express Shipping"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newRate.description}
                  onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Up to 2kg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newRate.weightMin}
                    onChange={(e) => setNewRate({ ...newRate, weightMin: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newRate.weightMax}
                    onChange={(e) => setNewRate({ ...newRate, weightMax: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (NZD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newRate.price}
                  onChange={(e) => setNewRate({ ...newRate, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter 0 for free shipping"
                />
                {newRate.price === 0 && (
                  <p className="text-green-600 text-xs mt-1">🎉 This will be a FREE shipping option!</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                <input
                  type="text"
                  value={newRate.estimatedDays}
                  onChange={(e) => setNewRate({ ...newRate, estimatedDays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., 3-5 business days"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveNewRate}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                ✅ Add This Rate
              </button>
              <button
                onClick={() => {
                  setShowRateForm(false);
                  setEditingZone(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 How to Add Shipping Rates</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Add Rate" next to any shipping zone</li>
          <li>• Fill in the rate details (name, weight range, price)</li>
          <li>• Set price to $0.00 for free shipping options</li>
          <li>• Click "Add This Rate" to save</li>
          <li>• Don't forget to "Save All Changes" when done!</li>
        </ul>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">🔍 Shipping Preview</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded border">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
              🇳🇿 New Zealand Shipping
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Pickup Available
              </span>
            </h5>
            <div className="text-sm text-gray-600 space-y-2">
              {shippingZones.find(z => z.id === 'nz')?.rates.map(rate => (
                <div key={rate.id} className={`flex justify-between p-2 rounded ${
                  rate.price === 0 ? 'bg-green-50 border border-green-200' : ''
                }`}>
                  <span>
                    {rate.name}: {rate.description}
                    <br />
                    <span className="text-xs text-gray-500">{rate.estimatedDays}</span>
                  </span>
                  <span className={`font-medium ${rate.price === 0 ? 'text-green-600' : ''}`}>
                    {rate.price === 0 ? 'FREE' : `$${rate.price.toFixed(2)}`}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between font-medium text-amber-600">
                  <span>Free shipping on orders over:</span>
                  <span>${freeShippingThreshold} NZD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <h5 className="font-medium text-gray-900 mb-3">🌏 International Shipping</h5>
            <div className="text-sm text-gray-600 space-y-2">
              {shippingZones.filter(z => z.id !== 'nz').slice(0, 3).map(zone => (
                <div key={zone.id}>
                  <div className="font-medium text-gray-800">{zone.name}</div>
                  {zone.rates.slice(0, 2).map(rate => (
                    <div key={rate.id} className="flex justify-between ml-2">
                      <span>{rate.description}</span>
                      <span>${rate.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingEditor;