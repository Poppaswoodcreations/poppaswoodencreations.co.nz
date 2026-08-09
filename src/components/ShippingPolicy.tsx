diff --git a/functions/api/create-payment-intent.js b/functions/api/create-payment-intent.js
index 196d660..5ba3861 100644
--- a/functions/api/create-payment-intent.js
+++ b/functions/api/create-payment-intent.js
@@ -17,7 +17,9 @@
 // (length_mm/width_mm/height_mm), falling back to actual weight only for
 // any product missing dimension data.
 
-const RURAL_SURCHARGE = 5.70;
+// NZ Post small-parcel pricing effective 1 July 2026 (Courier service tier —
+// delivery to door, next working day). Source: NZ Post small parcel rate card.
+const RURAL_SURCHARGE = 6.00;
 
 const NZ_RURAL_POSTCODES = new Set([
   // North Island
@@ -58,8 +60,14 @@ function volumetricWeightKg(lengthMm, widthMm, heightMm) {
   return (lCm * wCm * hCm) / 5000;
 }
 
+// Approximates NZ Post's size-based Courier tiers (XS/S/M/L/XL) using
+// billable weight as a proxy, since we don't store box-size categories.
+// Prices are the Courier column from NZ Post's small-parcel rate card,
+// effective 1 July 2026: XS $9.10, S $10.40, M $12.40, L $13.40, XL $18.70.
+// Floored at $10 on the smallest tier — the last few orders showed Courier
+// coming in cheaper than our old $10 minimum, so we keep $10 as the floor.
 function nzWeightTier(weight) {
-  return weight <= 1 ? 10 : weight <= 2 ? 13 : weight <= 3 ? 19 : weight <= 4 ? 26 : 32;
+  return weight <= 1 ? 10.00 : weight <= 2 ? 10.40 : weight <= 3 ? 12.40 : weight <= 4 ? 13.40 : 18.70;
 }
 
 function calculateShipping({ items, dbProducts, subtotal, billableWeight, country, deliveryMethod, postalCode }) {
diff --git a/src/components/Cart/Cart.tsx b/src/components/Cart/Cart.tsx
index 1266cb5..c396d3c 100644
--- a/src/components/Cart/Cart.tsx
+++ b/src/components/Cart/Cart.tsx
@@ -74,7 +74,9 @@ const NZ_RURAL_POSTCODES = new Set([
   '7886','9781','9782','9783','9891','9892','9893',
 ]);
 
-const RURAL_SURCHARGE = 5.70;
+// NZ Post small-parcel pricing effective 1 July 2026 (Courier service tier —
+// delivery to door, next working day). Source: NZ Post small parcel rate card.
+const RURAL_SURCHARGE = 6.00;
 
 function isRuralPostcode(postcode: string): boolean {
   return NZ_RURAL_POSTCODES.has(postcode.trim());
@@ -364,7 +366,11 @@ const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onRemoveI
     if (hasPineCars) return 0;
     if (total >= 1000) return 0;
     switch (formData.country) {
-      case 'NZ': return totalWeight <= 1 ? 10 : totalWeight <= 2 ? 13 : totalWeight <= 3 ? 19 : totalWeight <= 4 ? 26 : 32;
+      // Approximates NZ Post's size-based Courier tiers (XS/S/M/L/XL) using
+      // total weight as a proxy. Prices are the Courier column from NZ
+      // Post's small-parcel rate card, effective 1 July 2026. Floored at
+      // $10 on the smallest tier so we never undercharge vs our old minimum.
+      case 'NZ': return totalWeight <= 1 ? 10.00 : totalWeight <= 2 ? 10.40 : totalWeight <= 3 ? 12.40 : totalWeight <= 4 ? 13.40 : 18.70;
       case 'AU': return totalWeight <= 1 ? 25 : 35;
       case 'US': case 'CA': return totalWeight <= 1 ? 35 : 50;
       case 'GB': return totalWeight <= 1 ? 40 : 55;
@@ -455,7 +461,7 @@ const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onRemoveI
                     {isRural && (
                       <div className="flex justify-between text-sm text-orange-700">
                         <span>Rural delivery surcharge:</span>
-                        <span>$5.70</span>
+                        <span>${RURAL_SURCHARGE.toFixed(2)}</span>
                       </div>
                     )}
                     <div className="flex justify-between font-bold mt-1"><span>Total:</span><span>${grandTotal.toFixed(2)} NZD</span></div>
@@ -521,7 +527,7 @@ const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onRemoveI
                       <div className="flex items-start space-x-2 bg-orange-50 border border-orange-300 rounded-lg p-3">
                         <span className="text-orange-500 text-lg leading-none">🚐</span>
                         <p className="text-sm text-orange-800">
-                          <strong>Rural delivery detected</strong> — NZ Post charges an additional $5.70 for rural addresses. This has been added to your order total.
+                          <strong>Rural delivery detected</strong> — NZ Post charges an additional ${RURAL_SURCHARGE.toFixed(2)} for rural addresses. This has been added to your order total.
                         </p>
                       </div>
                     )}
diff --git a/src/components/ProductDetail.tsx b/src/components/ProductDetail.tsx
index b052e33..bd494e0 100644
--- a/src/components/ProductDetail.tsx
+++ b/src/components/ProductDetail.tsx
@@ -627,7 +627,7 @@ const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart, is
                 <h4 className="font-medium text-blue-900 mb-2">Shipping Information</h4>
                 <div className="text-sm text-blue-800 space-y-1">
                   <p>• NZ shipping from $10.00 NZD (by weight), FREE on orders over $1000 NZD</p>
-                  <p>• Rural delivery: +$5.70 NZD surcharge may apply</p>
+                  <p>• Rural delivery: +$6.00 NZD surcharge may apply</p>
                   <p>• Free pickup available from our Whangarei workshop</p>
                   <p>• Worldwide shipping available</p>
                   <p>• Processing time: 1-2 business days</p>
diff --git a/src/components/ShippingPolicy.tsx b/src/components/ShippingPolicy.tsx
index e145204..e457f88 100644
--- a/src/components/ShippingPolicy.tsx
+++ b/src/components/ShippingPolicy.tsx
@@ -65,7 +65,7 @@ const ShippingPolicy: React.FC = () => {
                   </li>
                   <li className="flex items-start">
                     <span className="text-amber-600 mr-2">•</span>
-                    <span><strong>Rural delivery surcharge:</strong> An additional $5.70 NZD applies to addresses on NZ Post's rural delivery list, calculated automatically at checkout once you enter your postcode.</span>
+                    <span><strong>Rural delivery surcharge:</strong> An additional $6.00 NZD applies to addresses on NZ Post's rural delivery list, calculated automatically at checkout once you enter your postcode.</span>
                   </li>
                 </ul>
                 <p className="text-sm text-gray-600 mt-3 italic">
