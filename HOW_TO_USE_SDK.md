# 🚀 How to Use Whop SDK

Your integration now uses the **official Whop SDK** to dynamically fetch plans!

## ✅ What's Updated

1. ✅ Installed `@whop/sdk` package
2. ✅ Updated `lib/whop-client.ts` to use the SDK
3. ✅ Updated `app/pricing/page.tsx` to fetch plans dynamically
4. ✅ Added helper functions for formatting

## 📋 Setup Instructions

### 1. Add Your Company ID to `.env.local`

```env
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
WHOP_COMPANY_ID=biz_xxxxxxxxxxxxxx    ← Add this!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find your Company ID:**
- Go to https://whop.com/dashboard
- Look at the URL: `whop.com/hub/biz_xxxxxxxxxxxxx`
- Copy the `biz_xxxxxxxxxxxxx` part

### 2. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 3. Visit the Pricing Page

Go to http://localhost:3000/pricing

Your **actual Whop plans** will now load automatically! 🎉

---

## 🎯 How It Works

### Before (Hardcoded)
```typescript
const plans = [
  {
    planId: 'plan_starter_monthly',  // ← Hardcoded
    name: 'Starter',
    price: '$9.99',
    // ...
  }
];
```

### After (Dynamic from Whop API)
```typescript
// Fetches your real plans from Whop
const whopPlans = await whopClient.listPlans(companyId);

// Automatically displays:
// - Correct plan IDs
// - Real prices
// - Actual billing periods
```

---

## 💻 Using the SDK

### Fetch Plans in Any Server Component

```typescript
import { whopClient } from '@/lib/whop-client';

export default async function MyPage() {
  const companyId = process.env.WHOP_COMPANY_ID!;
  const plans = await whopClient.listPlans(companyId);
  
  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.plan_type}</h3>
          <p>${(plan.price / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Get a Specific Plan

```typescript
const plan = await whopClient.getPlan('plan_xxxxxxxx');
console.log(plan.price); // Price in cents
console.log(plan.plan_type); // 'monthly', 'yearly', etc.
```

### Direct SDK Usage

```typescript
import Whop from '@whop/sdk';

const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY,
});

// Fetch all plans
for await (const plan of whop.plans.list({ 
  company_id: 'biz_xxxxx' 
})) {
  console.log(plan.id);
}
```

---

## 🎨 Customizing Plan Display

The pricing page now shows plans from Whop, but you can customize how they're displayed.

### Edit `app/pricing/page.tsx`

```typescript
const plans = whopPlans.length > 0 
  ? whopPlans.map((plan, index) => ({
      planId: plan.id,
      
      // Customize the display name
      name: plan.plan_type === 'monthly' ? 'Pro Monthly' : 'Pro Yearly',
      
      // Add custom description
      description: 'Your custom description here',
      
      // Price is auto-formatted from Whop
      price: formatPrice(plan.price, plan.currency),
      
      // Customize features per plan
      features: plan.plan_type === 'monthly' 
        ? ['Monthly billing', 'Cancel anytime']
        : ['Annual billing', 'Save 20%'],
        
      // Highlight specific plans
      highlighted: plan.plan_type === 'monthly',
    }))
  : [/* fallback plans */];
```

---

## 📊 Plan Data Structure

When you fetch plans, you get:

```typescript
{
  id: "plan_xxxxxxxx",           // Use this for checkout
  product_id: "prod_xxxxxxxx",   // Associated product
  plan_type: "monthly",          // monthly, yearly, one_time, etc.
  price: 2999,                   // Price in cents (29.99)
  currency: "USD",               // Currency code
  billing_period: 30,            // Days in billing period
  created_at: 1234567890,        // Unix timestamp
}
```

---

## 🔧 Common Customizations

### 1. Add Plan Metadata

Create a mapping for custom information:

```typescript
const planMetadata: Record<string, any> = {
  'monthly': {
    name: 'Pro Monthly',
    description: 'Best for professionals',
    features: ['Feature 1', 'Feature 2'],
  },
  'yearly': {
    name: 'Pro Yearly',
    description: 'Save with annual billing',
    features: ['Feature 1', 'Feature 2', 'Save 20%'],
  },
};

// Apply metadata
const plans = whopPlans.map(plan => ({
  planId: plan.id,
  ...planMetadata[plan.plan_type],
  price: formatPrice(plan.price, plan.currency),
  period: getBillingPeriod(plan.plan_type),
}));
```

### 2. Filter Plans

Show only specific plan types:

```typescript
// Show only monthly and yearly plans
const filteredPlans = whopPlans.filter(plan => 
  ['monthly', 'yearly'].includes(plan.plan_type)
);
```

### 3. Sort Plans

Order by price:

```typescript
const sortedPlans = whopPlans.sort((a, b) => a.price - b.price);
```

---

## 🐛 Troubleshooting

### Plans Not Loading?

1. **Check Company ID**: Make sure `WHOP_COMPANY_ID` is correct in `.env.local`
2. **Check API Key**: Verify `WHOP_API_KEY` has proper permissions
3. **Check Console**: Look for error messages in terminal
4. **Fallback Plans**: If API fails, fallback plans will show

### See This Error: "Cannot read properties of undefined"

- Make sure you've added `WHOP_COMPANY_ID` to `.env.local`
- Restart the dev server after adding environment variables

### Wrong Plans Showing?

- Double-check your Company ID matches your Whop account
- Verify you're using the correct API key

---

## 📚 More Examples

See `examples/whop-sdk-usage.ts` for 10+ code examples including:
- Direct SDK usage
- API route examples
- Error handling
- Filtering plans
- And more!

---

## 🚀 Next Steps

1. ✅ Add your `WHOP_COMPANY_ID` to `.env.local`
2. ✅ Restart dev server
3. ✅ Check http://localhost:3000/pricing
4. ✅ Customize plan names and features
5. ✅ Test checkout with real plans!

---

## 📖 Resources

- [Whop SDK Docs](https://docs.whop.com/sdk)
- [Whop API Reference](https://docs.whop.com/api)
- [Your Whop Dashboard](https://whop.com/dashboard)

---

**Your plans are now dynamically loaded from Whop!** 🎉

Test it out: http://localhost:3000/pricing

