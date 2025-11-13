# 📦 Products Page Guide

Your Whop integration now has a **Products Page** that dynamically fetches all products from your Whop account!

## ✅ What's New

1. ✅ **Products Page** at `/products` - Displays all your Whop products
2. ✅ **API Route** at `/api/products` - Fetches products via API
3. ✅ **Updated WhopClient** - New methods for product management
4. ✅ **Updated Types** - Extended product type definitions
5. ✅ **Homepage Link** - New products card on homepage

---

## 🚀 How to Use

### 1. Make Sure Your `.env.local` is Set Up

```env
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
WHOP_COMPANY_ID=biz_xxxxxxxxxxxxxx    ← Must have this!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Visit the Products Page

Go to: **http://localhost:3000/products**

You'll see all products from your Whop account automatically! 🎉

---

## 📊 What You'll See

For each product, the page displays:

- ✅ **Product Name** - The name of your product
- ✅ **Product ID** - The unique identifier
- ✅ **Description** - Product description (if available)
- ✅ **Visibility Status** - Whether it's visible, hidden, or archived
- ✅ **Active Members Count** - Number of active subscribers
- ✅ **Created Date** - When the product was created
- ✅ **Product Type** - The type of product
- ✅ **View Plans Button** - Link to pricing page

---

## 💻 Code Structure

### Products Page (`app/products/page.tsx`)

```typescript
export default async function ProductsPage() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  
  // Fetch products from Whop API using SDK
  const whopProducts = await whopClient.listProducts(companyId);
  
  // Display products in a responsive grid
  return (
    // Beautiful product cards with details
  );
}
```

### API Route (`app/api/products/route.ts`)

```typescript
export async function GET(request: NextRequest) {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  const products = await whopClient.listProducts(companyId);
  
  return NextResponse.json({
    success: true,
    data: { products, count: products.length },
  });
}
```

### WhopClient Methods

```typescript
// Fetch all products
const products = await whopClient.listProducts(companyId);

// Get specific product
const product = await whopClient.getProductById(productId);
```

---

## 🎨 Product Data Structure

When you fetch products, each product contains:

```typescript
{
  id: "prod_xxxxxxxx",                    // Product ID
  name: "My Awesome Product",             // Product name
  description: "Description here...",     // Description
  image_url: "https://...",               // Product image
  created_at: 1234567890,                 // Unix timestamp
  visibility: "visible",                  // visible | hidden | archived
  product_type: "access_pass",            // Product type
  active_memberships_count: 42,           // Active subscribers
  metadata: {},                           // Custom metadata
}
```

---

## 🔧 Customization

### Change Product Card Layout

Edit `app/products/page.tsx`:

```typescript
// Change grid columns
gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'

// Change card styling
backgroundColor: 'your-color'
borderRadius: '16px'
```

### Add Product Images

```typescript
{product.image_url && (
  <img 
    src={product.image_url} 
    alt={product.name}
    style={{ width: '100%', borderRadius: '8px' }}
  />
)}
```

### Filter Products by Type

```typescript
// Show only specific product types
const filteredProducts = whopProducts.filter(
  product => product.product_type === 'access_pass'
);
```

### Sort Products

```typescript
// Sort by created date (newest first)
const sortedProducts = whopProducts.sort(
  (a, b) => b.created_at - a.created_at
);

// Sort by active members (most popular first)
const sortedProducts = whopProducts.sort(
  (a, b) => (b.active_memberships_count || 0) - (a.active_memberships_count || 0)
);
```

---

## 🎯 Use Cases

### 1. Product Catalog

Display all your products to visitors before they choose a plan.

### 2. Product Details

Show detailed information about each product including subscriber count.

### 3. Dynamic Pricing

Link each product to its pricing plans dynamically.

### 4. Analytics Dashboard

Track which products have the most active members.

---

## 🔌 API Usage

### Fetch Products via API

```typescript
// From client component
const response = await fetch('/api/products');
const data = await response.json();

console.log(data.data.products); // Array of products
console.log(data.data.count);    // Total count
```

### Use in API Route

```typescript
import { whopClient } from '@/lib/whop-client';

export async function GET() {
  const companyId = process.env.WHOP_COMPANY_ID!;
  const products = await whopClient.listProducts(companyId);
  
  return NextResponse.json({ products });
}
```

### Use in Server Component

```typescript
import { whopClient } from '@/lib/whop-client';

export default async function MyPage() {
  const products = await whopClient.listProducts('biz_xxxxx');
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🎨 Advanced Examples

### 1. Product with Plans

Show product with its associated pricing plans:

```typescript
const product = await whopClient.getProductById('prod_xxx');
const plans = await whopClient.listPlans(companyId);

// Filter plans for this product
const productPlans = plans.filter(
  plan => plan.product_id === product.id
);
```

### 2. Featured Products

Highlight specific products:

```typescript
const featuredProductIds = ['prod_xxx', 'prod_yyy'];

const featuredProducts = whopProducts.filter(
  product => featuredProductIds.includes(product.id)
);
```

### 3. Product Search

Add search functionality:

```typescript
'use client';

const [search, setSearch] = useState('');

const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(search.toLowerCase()) ||
  product.description?.toLowerCase().includes(search.toLowerCase())
);
```

### 4. Product Statistics

Calculate statistics:

```typescript
const totalMembers = products.reduce(
  (sum, p) => sum + (p.active_memberships_count || 0), 
  0
);

const averageMembers = totalMembers / products.length;
```

---

## 📱 Responsive Design

The products page is fully responsive:

- **Desktop**: 3-4 columns grid
- **Tablet**: 2 columns grid
- **Mobile**: 1 column grid

Cards automatically adjust based on screen size!

---

## 🐛 Troubleshooting

### No Products Showing?

1. **Check Company ID**: Verify `WHOP_COMPANY_ID` in `.env.local`
2. **Create Products**: Go to Whop dashboard and create products
3. **Check API Key**: Ensure API key has proper permissions
4. **Check Console**: Look for errors in terminal output

### Products Not Updating?

- Refresh the page (products are fetched server-side)
- Check Whop dashboard to verify product exists
- Restart dev server: `npm run dev`

### Wrong Company Products?

- Double-check your `WHOP_COMPANY_ID` matches your account
- Verify you're logged into the correct Whop account

---

## 📚 Related Documentation

- **[HOW_TO_USE_SDK.md](./HOW_TO_USE_SDK.md)** - Whop SDK usage
- **[README.md](./README.md)** - Main documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

---

## 🔗 Navigation

Your app now has these pages:

- **`/`** - Homepage with navigation
- **`/products`** - Browse all products ← **NEW!**
- **`/pricing`** - View pricing plans
- **`/subscription`** - Manage subscriptions

---

## 🚀 Next Steps

1. ✅ Visit http://localhost:3000/products
2. ✅ See your Whop products loaded automatically
3. ✅ Customize the product cards
4. ✅ Add product images
5. ✅ Link products to specific pricing plans

---

## 💡 Pro Tips

- Products are fetched at **build time** in production (super fast!)
- Use **ISR (Incremental Static Regeneration)** to update products periodically
- Add product images to make the page more attractive
- Show subscriber count to build social proof
- Link each product to its specific pricing plans

---

## 🎉 You're All Set!

Your products page is ready! Visit **http://localhost:3000/products** to see it in action!

**Questions?** Check the other documentation files or create an issue.

---

**Happy selling!** 🚀💰

