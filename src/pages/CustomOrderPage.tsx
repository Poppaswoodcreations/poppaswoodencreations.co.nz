import React, { useState, useRef } from 'react';
import { CheckCircle, Upload, X, ChevronDown, Ruler, TreePine, Package, Send } from 'lucide-react';

const WOOD_TYPES = [
  { value: 'kauri', label: 'Kauri', description: 'Premium NZ native, stunning grain' },
  { value: 'rimu', label: 'Rimu', description: 'Rich reddish tones, classic NZ timber' },
  { value: 'macrocarpa', label: 'Macrocarpa', description: 'Warm golden hues, aromatic' },
  { value: 'pine', label: 'Pine', description: 'Light & affordable, great for toys' },
  { value: 'unsure', label: "Not Sure – Adrian's Choice", description: 'Let Poppa choose the best fit' },
];

const PRODUCT_TYPES = [
  { value: 'toy-car', label: 'Toy Car / Truck', category: 'toys' },
  { value: 'toy-train', label: 'Toy Train', category: 'toys' },
  { value: 'toy-plane', label: 'Toy Plane / Helicopter', category: 'toys' },
  { value: 'toy-boat', label: 'Toy Boat', category: 'toys' },
  { value: 'toy-other', label: 'Other Toy', category: 'toys' },
  { value: 'chopping-board', label: 'Chopping Board', category: 'kitchen' },
  { value: 'cutting-board', label: 'Cutting Board', category: 'kitchen' },
  { value: 'bowl', label: 'Bowl', category: 'kitchen' },
  { value: 'spoon', label: 'Spoon / Spatula', category: 'kitchen' },
  { value: 'kitchen-other', label: 'Other Kitchenware', category: 'kitchen' },
  { value: 'pen', label: 'Pen', category: 'pens' },
  { value: 'other', label: 'Something Else', category: 'other' },
];

const SIZE_PRESETS = ['Small', 'Medium', 'Large', 'Extra Large'];

type FormState = {
  name: string;
  email: string;
  phone: string;
  productType: string;
  woodType: string;
  sizePreset: string;
  length: string;
  width: string;
  height: string;
  finish: string;
  quantity: string;
  details: string;
  image: File | null;
};

const CustomOrderPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '',
    productType: '', woodType: '',
    sizePreset: '', length: '', width: '', height: '',
    finish: '', quantity: '1', details: '', image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('form-name', 'custom-order');
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('phone', form.phone);
    data.append('product-type', form.productType);
    data.append('wood-type', form.woodType);
    data.append('size-preset', form.sizePreset);
    data.append('length', form.length);
    data.append('width', form.width);
    data.append('height', form.height);
    data.append('finish', form.finish);
    data.append('quantity', form.quantity);
    data.append('details', form.details);
    if (form.image) data.append('image', form.image);

    try {
      await fetch('/', { method: 'POST', body: data });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please email us directly at poppas.wooden.creations@gmail.com');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Received!</h2>
          <p className="text-gray-600 mb-2">Thanks <strong>{form.name}</strong> — Poppa will review your custom order and get back to you within 1–2 business days.</p>
          <p className="text-sm text-gray-500 mb-8">A confirmation will be sent to <strong>{form.email}</strong></p>
          <a href="/products" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
            Browse Our Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            <TreePine size={12} /> Handcrafted to Order
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Custom Wooden Creations</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Tell Poppa exactly what you have in mind — size, timber, finish — and he'll craft it by hand in Whangarei.
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          {[
            { n: 1, label: 'Product' },
            { n: 2, label: 'Size & Wood' },
            { n: 3, label: 'Your Details' },
          ].map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                step === n ? 'bg-amber-600 text-white' : step > n ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === n ? 'bg-white text-amber-600' : step > n ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-500'}`}>{step > n ? '✓' : n}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form
        name="custom-order"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 py-10"
      >
        <input type="hidden" name="form-name" value="custom-order" />
        <input type="hidden" name="bot-field" />

        {/* STEP 1: Product Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">What would you like made?</h2>
              <p className="text-gray-500 text-sm">Select the type of product you'd like custom made.</p>
            </div>

            {/* Category: Toys */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Package size={12} /> Toys</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCT_TYPES.filter(p => p.category === 'toys').map(p => (
                  <button type="button" key={p.value}
                    onClick={() => setForm({ ...form, productType: p.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${form.productType === p.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category: Kitchen */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Package size={12} /> Kitchenware</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCT_TYPES.filter(p => p.category === 'kitchen').map(p => (
                  <button type="button" key={p.value}
                    onClick={() => setForm({ ...form, productType: p.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${form.productType === p.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category: Pens & Other */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Package size={12} /> Other</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCT_TYPES.filter(p => p.category === 'pens' || p.category === 'other').map(p => (
                  <button type="button" key={p.value}
                    onClick={() => setForm({ ...form, productType: p.value })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${form.productType === p.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number" name="quantity" min="1" max="100"
                value={form.quantity} onChange={handleChange}
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Image <span className="text-gray-400 font-normal">(optional)</span></label>
              <p className="text-xs text-gray-500 mb-3">Upload a sketch, photo, or inspiration image to help Poppa understand what you have in mind.</p>

              {!imagePreview ? (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                >
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  <span className="text-sm text-gray-500 group-hover:text-amber-600">Click to upload image</span>
                  <span className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB</span>
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
                  <button type="button" onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" name="image" accept="image/*" onChange={handleImage} className="hidden" />
            </div>

            <button type="button" onClick={() => setStep(2)} disabled={!form.productType}
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next: Size & Timber →
            </button>
          </div>
        )}

        {/* STEP 2: Size & Wood */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Size & Timber</h2>
              <p className="text-gray-500 text-sm">Give us dimensions if you know them, or just pick a general size.</p>
            </div>

            {/* Size Preset */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">General Size</label>
              <div className="grid grid-cols-4 gap-3">
                {SIZE_PRESETS.map(s => (
                  <button type="button" key={s}
                    onClick={() => setForm({ ...form, sizePreset: s })}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${form.sizePreset === s ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Exact Dimensions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Ruler size={14} /> Exact Dimensions <span className="text-gray-400 font-normal">(optional, in cm)</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Leave blank if you're not sure — Poppa can advise.</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Length (cm)</label>
                  <input type="number" name="length" min="0" step="0.5" placeholder="e.g. 20"
                    value={form.length} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Width (cm)</label>
                  <input type="number" name="width" min="0" step="0.5" placeholder="e.g. 8"
                    value={form.width} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Height (cm)</label>
                  <input type="number" name="height" min="0" step="0.5" placeholder="e.g. 5"
                    value={form.height} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Wood Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TreePine size={14} /> Timber Preference
              </label>
              <div className="space-y-3">
                {WOOD_TYPES.map(w => (
                  <button type="button" key={w.value}
                    onClick={() => setForm({ ...form, woodType: w.value })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${form.woodType === w.value ? 'border-amber-600 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'}`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${form.woodType === w.value ? 'text-amber-700' : 'text-gray-800'}`}>{w.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{w.description}</p>
                    </div>
                    {form.woodType === w.value && <div className="w-4 h-4 rounded-full bg-amber-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Finish Preference <span className="text-gray-400 font-normal">(optional)</span></label>
              <select name="finish" value={form.finish} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">No preference — Adrian's choice</option>
                <option value="natural-oil">Natural Oil (food-safe)</option>
                <option value="beeswax">Beeswax Polish</option>
                <option value="raw">Raw / Unfinished</option>
                <option value="varnish">Varnish (glossy)</option>
              </select>
            </div>

            {/* Extra Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Extra Details <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea name="details" rows={4} value={form.details} onChange={handleChange}
                placeholder="Any special requests, personalisation, engravings, or anything else Poppa should know..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
              >
                ← Back
              </button>
              <button type="button" onClick={() => setStep(3)} disabled={!form.woodType || !form.sizePreset}
                className="flex-2 flex-grow bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Details</h2>
              <p className="text-gray-500 text-sm">So Poppa can get back to you with a quote and timeline.</p>
            </div>

            {/* Order Summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm space-y-1">
              <p className="font-semibold text-amber-800 mb-2">Order Summary</p>
              <p className="text-gray-700"><span className="text-gray-500">Product:</span> {PRODUCT_TYPES.find(p => p.value === form.productType)?.label}</p>
              <p className="text-gray-700"><span className="text-gray-500">Timber:</span> {WOOD_TYPES.find(w => w.value === form.woodType)?.label}</p>
              <p className="text-gray-700"><span className="text-gray-500">Size:</span> {form.sizePreset}{form.length || form.width || form.height ? ` — ${[form.length && `L:${form.length}cm`, form.width && `W:${form.width}cm`, form.height && `H:${form.height}cm`].filter(Boolean).join(', ')}` : ''}</p>
              <p className="text-gray-700"><span className="text-gray-500">Qty:</span> {form.quantity}</p>
              {imagePreview && <p className="text-gray-700"><span className="text-gray-500">Image:</span> ✓ Attached</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+64 21 000 0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">What happens next?</strong> Poppa will review your order and reply within 1–2 business days with a quote and estimated timeframe. Custom orders typically take 2–4 weeks to complete.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors"
              >
                ← Back
              </button>
              <button type="submit" disabled={submitting || !form.name || !form.email}
                className="flex-grow flex items-center justify-center gap-2 bg-amber-600 text-white py-4 rounded-xl font-semibold hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Sending...</>
                ) : (
                  <><Send size={18} /> Send Custom Order</>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomOrderPage;
