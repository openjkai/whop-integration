# 🔔 Webhook Setup Guide

## ✅ What's Fixed

Your webhook integration now uses the **official Whop SDK** for secure webhook verification according to the Standard Webhooks spec!

### Issues Fixed:
- ❌ ~~`RangeError: Input buffers must have the same byte length`~~
- ❌ ~~`Invalid webhook signature`~~
- ✅ Now uses `whopSDK.webhooks.unwrap()` for automatic verification
- ✅ Follows Whop's Standard Webhooks spec
- ✅ Properly handles webhook headers

---

## 🚀 Setup Instructions

### 1. Create Webhook in Whop Dashboard

#### For Company Webhooks (Recommended for most users):

1. Go to https://whop.com/dashboard
2. Navigate to **Developer** tab (not inside your app!)
3. Click **"Create Webhook"** in the top right
4. Enter your webhook URL:
   - **Local testing**: `https://your-ngrok-url.ngrok.io/api/webhooks/whop`
   - **Production**: `https://yourdomain.com/api/webhooks/whop`
5. Select **API version**: `v1`
6. Select events you want to receive:
   - ✅ `payment.succeeded` - When payment succeeds
   - ✅ `membership.went_valid` - When membership activates
   - ✅ `membership.went_invalid` - When membership deactivates
   - ✅ `waitlist.entry.created` - When someone joins waitlist
7. Click **"Create"**
8. **Copy the Webhook Secret** (you'll need this!)

### 2. Update Environment Variables

Add the webhook secret to `.env.local`:

```env
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx    ← Add this!
WHOP_COMPANY_ID=biz_xxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Restart Your Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing Webhooks Locally

### Using ngrok:

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/download

# Start ngrok
ngrok http 3000

# Copy the HTTPS URL
# Example: https://abc123.ngrok.io
```

### Update Webhook URL:

In Whop dashboard, set webhook URL to:
```
https://abc123.ngrok.io/api/webhooks/whop
```

### Test Payment:

1. Go to your pricing page: http://localhost:3000/pricing
2. Click "Subscribe" button
3. Complete a test payment on Whop
4. Check your terminal - you should see:
   ```
   Received webhook: payment.succeeded
   [PAYMENT SUCCEEDED] { id: 'pay_xxx', ... }
   ```

---

## 📊 How It Works Now

### Webhook Flow:

```
1. User completes payment on Whop
   ↓
2. Whop sends POST to your webhook URL
   ↓
3. Your handler receives request
   ↓
4. SDK verifies signature (automatic!)
   ↓
5. Webhook data unwrapped
   ↓
6. Handler processes event
   ↓
7. Return 200 OK
```

### Code Implementation:

```typescript
// Webhook handler automatically verifies signature
const whopSDK = whopClient.getSDK();
const webhookData = whopSDK.webhooks.unwrap(requestBodyText, { headers });

// webhookData contains:
// - type: 'payment.succeeded'
// - data: { id, amount, user, product, ... }
// - timestamp: '2025-01-01T00:00:00.000Z'
// - api_version: 'v1'
```

---

## 🎯 Supported Webhook Events

Your handler supports these events:

### 1. Payment Succeeded
```typescript
webhookData.type === 'payment.succeeded'

// Data includes:
{
  id: 'pay_xxx',
  total: 29.99,
  currency: 'usd',
  user: { id, email, username },
  product: { id, title },
  membership: { id, status },
  status: 'paid'
}
```

**What to do:**
- Send receipt email
- Log revenue
- Grant access
- Update database

### 2. Membership Activated
```typescript
webhookData.type === 'membership.went_valid'

// Data includes:
{
  id: 'mem_xxx',
  user: { id, email },
  product: { id, title },
  plan: { id },
  status: 'active'
}
```

**What to do:**
- Send welcome email
- Grant access to content
- Add to Discord/community
- Update database

### 3. Membership Deactivated
```typescript
webhookData.type === 'membership.went_invalid'

// Data includes:
{
  id: 'mem_xxx',
  user: { id, email },
  product: { id, title },
  status: 'cancelled' | 'expired' | 'past_due'
}
```

**What to do:**
- Revoke access
- Remove from community
- Send cancellation email
- Update database

### 4. Waitlist Entry Created
```typescript
webhookData.type === 'waitlist.entry.created'

// Data includes:
{
  email: 'user@example.com',
  product: { id, title },
  created_at: '...'
}
```

**What to do:**
- Send confirmation email
- Add to CRM
- Track in analytics

---

## 🔧 Customize Event Handlers

Edit `app/api/webhooks/whop/route.ts`:

### Example: Send Welcome Email

```typescript
async function handleMembershipActivated(membership: any) {
  console.log('[MEMBERSHIP ACTIVATED]', membership);
  
  // Send welcome email
  await sendEmail({
    to: membership.user.email,
    subject: 'Welcome to our community!',
    template: 'welcome',
    data: {
      name: membership.user.name,
      productName: membership.product.title,
    },
  });
  
  // Grant Discord role
  await grantDiscordRole(membership.user.id, 'premium');
  
  // Store in database
  await db.memberships.create({
    id: membership.id,
    userId: membership.user.id,
    productId: membership.product.id,
    status: membership.status,
  });
}
```

### Example: Store Payment

```typescript
async function handlePaymentSucceeded(payment: any) {
  console.log('[PAYMENT SUCCEEDED]', payment);
  
  // Store in database
  await db.payments.create({
    id: payment.id,
    userId: payment.user.id,
    amount: payment.total,
    currency: payment.currency,
    productId: payment.product.id,
    membershipId: payment.membership.id,
    status: payment.status,
    paidAt: payment.paid_at,
  });
  
  // Send receipt
  await sendReceiptEmail(payment);
  
  // Track analytics
  await analytics.track({
    event: 'Purchase Completed',
    userId: payment.user.id,
    properties: {
      revenue: payment.total,
      currency: payment.currency,
      product: payment.product.title,
    },
  });
}
```

---

## 🔐 Security Features

✅ **Automatic Signature Verification**
- Uses Standard Webhooks spec
- HMAC-SHA256 signature
- Prevents replay attacks
- Validates timestamp

✅ **Header Validation**
- `webhook-signature`: Signature with version
- `webhook-timestamp`: Request timestamp

✅ **Error Handling**
- Returns 401 for invalid signatures
- Returns 200 for successful processing
- Logs all events for debugging

---

## 🐛 Troubleshooting

### Webhook Not Receiving Events?

1. **Check URL is public**
   - Use ngrok for local testing
   - Ensure URL is accessible from internet

2. **Verify webhook secret**
   - Check `.env.local` has `WHOP_WEBHOOK_SECRET`
   - Copy exact secret from Whop dashboard

3. **Check Whop dashboard**
   - Go to Developer → Webhooks
   - Click on your webhook
   - Check "Recent Deliveries" tab
   - See if requests are being sent

4. **Restart dev server**
   ```bash
   npm run dev
   ```

### Still Getting Signature Errors?

1. **Webhook secret format**
   - Should start with `whsec_`
   - Don't add quotes or extra characters
   - Copy directly from Whop dashboard

2. **Check logs**
   ```bash
   # In terminal, you should see:
   Received webhook: payment.succeeded
   [PAYMENT SUCCEEDED] { ... }
   ```

3. **Test with Whop dashboard**
   - Go to webhook settings
   - Click "Send Test Event"
   - Check your logs

---

## 📝 Webhook Headers

Whop sends these headers:

```
webhook-signature: v1,BASE64SIGNATURE
webhook-timestamp: 1727606400
content-type: application/json
```

The SDK handles these automatically!

---

## ✅ Verification Checklist

- [ ] Created webhook in Whop dashboard
- [ ] Added `WHOP_WEBHOOK_SECRET` to `.env.local`
- [ ] Restarted dev server
- [ ] Testing with ngrok (local) or public URL (production)
- [ ] Webhook events appear in console logs
- [ ] No signature verification errors

---

## 🎯 Next Steps

1. ✅ Test webhook with real payment
2. ✅ Add custom logic to event handlers
3. ✅ Integrate with your database
4. ✅ Send email notifications
5. ✅ Add error monitoring (Sentry, etc.)
6. ✅ Deploy to production
7. ✅ Update webhook URL to production domain

---

## 📚 Resources

- **Whop Webhooks Docs**: https://docs.whop.com/webhooks
- **Standard Webhooks Spec**: https://www.standardwebhooks.com/
- **Whop SDK Docs**: https://docs.whop.com/sdk

---

**Your webhooks are now properly configured!** 🎉

Test them by making a purchase at: http://localhost:3000/pricing

