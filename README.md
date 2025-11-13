# Whop Payment Gateway Integration

A complete Next.js implementation for integrating Whop payment gateway with subscription management, including checkout, cancellation, reactivation, and webhook handling.

## 🚀 Features

- ✅ **Subscription Checkout**: Create Whop checkout sessions
- ✅ **Membership Verification**: Verify active subscriptions
- ✅ **Subscription Management**: View subscription status and details
- ✅ **Cancel Subscriptions**: Cancel with grace period
- ✅ **Reactivate Subscriptions**: Reactivate cancelled subscriptions
- ✅ **Webhook Integration**: Handle real-time subscription events
- ✅ **Secure**: Webhook signature verification
- ✅ **TypeScript**: Full type safety
- ✅ **Modern UI**: Beautiful, responsive components

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- A [Whop](https://whop.com/) account
- Whop API key and webhook secret

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Whop API Configuration
WHOP_API_KEY=your_whop_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
WHOP_COMPANY_ID=your_company_id_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Whop API Credentials

1. Go to [Whop Developer Dashboard](https://whop.com/developers)
2. Create a new API key
3. Copy your API key and webhook secret
4. Update your `.env.local` file

### 4. Configure Webhook Endpoint

In your Whop dashboard:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/whop`
3. Select events to listen to:
   - `membership.created`
   - `membership.updated`
   - `membership.deleted`
   - `payment.succeeded`
   - `payment.failed`

### 5. Update Plan IDs

Edit `app/pricing/page.tsx` and replace the example plan IDs with your actual Whop plan IDs:

```typescript
const plans = [
  {
    planId: 'your_actual_plan_id_here', // Replace this
    name: 'Starter',
    // ...
  },
];
```

### 6. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
whop-integration/
├── app/
│   ├── api/
│   │   ├── subscription/
│   │   │   ├── create-checkout/route.ts  # Create checkout session
│   │   │   ├── verify/route.ts           # Verify membership
│   │   │   ├── status/route.ts           # Get subscription status
│   │   │   ├── cancel/route.ts           # Cancel subscription
│   │   │   └── reactivate/route.ts       # Reactivate subscription
│   │   └── webhooks/
│   │       └── whop/route.ts             # Webhook handler
│   ├── pricing/page.tsx                  # Pricing page
│   ├── subscription/page.tsx             # Subscription management
│   ├── page.tsx                          # Home page
│   ├── layout.tsx                        # Root layout
│   └── globals.css                       # Global styles
├── components/
│   ├── SubscriptionButton.tsx            # Subscribe button component
│   ├── SubscriptionStatus.tsx            # Status display component
│   ├── CancelSubscription.tsx            # Cancel/reactivate component
│   └── PricingCard.tsx                   # Pricing card component
├── lib/
│   ├── whop-client.ts                    # Whop API client
│   └── webhook-utils.ts                  # Webhook utilities
├── types/
│   └── whop.ts                           # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔌 API Routes

### Create Checkout Session

**POST** `/api/subscription/create-checkout`

```typescript
// Request
{
  "planId": "plan_xxx",
  "metadata": {
    "customField": "value"
  }
}

// Response
{
  "success": true,
  "data": {
    "checkout_url": "https://whop.com/checkout/...",
    "checkout_session_id": "session_xxx"
  }
}
```

### Verify Membership

**GET** `/api/subscription/verify?membershipId=mem_xxx`

```typescript
// Response
{
  "success": true,
  "data": {
    "isValid": true,
    "membership": { /* membership object */ }
  }
}
```

### Get Subscription Status

**GET** `/api/subscription/status?membershipId=mem_xxx` or `?userId=user_xxx`

```typescript
// Response
{
  "success": true,
  "data": {
    "memberships": [ /* array of memberships */ ],
    "count": 1
  }
}
```

### Cancel Subscription

**POST** `/api/subscription/cancel`

```typescript
// Request
{
  "membershipId": "mem_xxx"
}

// Response
{
  "success": true,
  "message": "Subscription cancelled successfully...",
  "data": { /* updated membership */ }
}
```

### Reactivate Subscription

**POST** `/api/subscription/reactivate`

```typescript
// Request
{
  "membershipId": "mem_xxx"
}

// Response
{
  "success": true,
  "message": "Subscription reactivated successfully",
  "data": { /* updated membership */ }
}
```

## 🎯 Usage Examples

### Create a Subscription Button

```tsx
import SubscriptionButton from '@/components/SubscriptionButton';

<SubscriptionButton
  planId="plan_xxx"
  planName="Pro Plan"
  price="$29.99/month"
  metadata={{ userId: "user_123" }}
/>
```

### Display Subscription Status

```tsx
import SubscriptionStatus from '@/components/SubscriptionStatus';

<SubscriptionStatus membershipId="mem_xxx" />
// or
<SubscriptionStatus userId="user_xxx" />
```

### Cancel Subscription

```tsx
import CancelSubscription from '@/components/CancelSubscription';

<CancelSubscription
  membershipId="mem_xxx"
  onSuccess={() => console.log('Cancelled!')}
  onError={(error) => console.error(error)}
/>
```

### Use Whop Client Directly

```tsx
import { whopClient } from '@/lib/whop-client';

// Verify membership
const isValid = await whopClient.verifyMembership('mem_xxx');

// Get user memberships
const memberships = await whopClient.getUserMemberships('user_xxx');

// Cancel membership
const cancelled = await whopClient.cancelMembership('mem_xxx');

// Reactivate membership
const reactivated = await whopClient.reactivateMembership('mem_xxx');
```

## 🔐 Webhook Events

The webhook handler automatically processes these events:

- **membership.created**: New subscription created
- **membership.updated**: Subscription updated (plan change, cancellation, etc.)
- **membership.deleted**: Subscription expired/deleted
- **payment.succeeded**: Payment successful
- **payment.failed**: Payment failed

Edit `app/api/webhooks/whop/route.ts` to add your custom logic for each event.

## 🎨 Customization

### Styling

The components use inline styles for simplicity. You can:
1. Replace inline styles with CSS modules
2. Use Tailwind CSS
3. Use your preferred styling solution

### Authentication

This demo uses manual input for membership/user IDs. In production:
1. Integrate with NextAuth, Auth0, Clerk, or your auth provider
2. Store user's Whop membership ID in your database
3. Automatically fetch subscription status on login

### Database Integration

Add database logic in webhook handlers to:
- Store subscription data
- Track user access
- Log events and analytics
- Send email notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📚 Resources

- [Whop Developer Docs](https://docs.whop.com)
- [Whop API Reference](https://docs.whop.com/api)
- [Next.js Documentation](https://nextjs.org/docs)

## 🐛 Troubleshooting

### Webhook not receiving events

1. Ensure webhook URL is publicly accessible (use ngrok for local testing)
2. Verify webhook secret matches in `.env.local`
3. Check Whop dashboard for webhook delivery logs

### Checkout redirect not working

1. Verify `WHOP_API_KEY` is correct
2. Ensure plan IDs match your Whop products
3. Check browser console for errors

### Membership verification fails

1. Confirm membership ID is valid
2. Check API key has required permissions
3. Verify membership hasn't expired

## 📝 License

MIT

## 🤝 Support

For Whop-specific issues, contact [Whop Support](https://whop.com/support)

For implementation questions, create an issue in this repository.

---

Built with ❤️ using [Whop](https://whop.com) and [Next.js](https://nextjs.org)

