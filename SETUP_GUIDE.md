# Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

Or create `.env.local` manually with:

```env
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
WHOP_COMPANY_ID=your_company_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Whop Credentials

1. **Sign up or login** to [Whop](https://whop.com/)
2. **Create a Company** (if you don't have one)
3. **Go to Developer Settings**:
   - Navigate to Settings → Developer
   - Generate API Key
   - Copy your API Key
4. **Create Products & Plans**:
   - Go to Products
   - Create a new product
   - Add pricing plans
   - Copy the Plan IDs

### 4. Update Plan IDs

Edit `app/pricing/page.tsx`:

```typescript
const plans = [
  {
    planId: 'plan_xxxxxxxxxx', // Replace with your actual plan ID
    name: 'Starter',
    // ...
  },
];
```

### 5. Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test Webhooks Locally (Optional)

Install ngrok:

```bash
# macOS
brew install ngrok

# or download from https://ngrok.com/download
```

Start ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://xxxxx.ngrok.io`) and:
1. Go to Whop Dashboard → Settings → Webhooks
2. Add webhook URL: `https://xxxxx.ngrok.io/api/webhooks/whop`
3. Select events to listen to

### 7. Deploy to Production

#### Vercel (Easiest)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

#### Update Webhook URL

After deployment, update your Whop webhook URL:
- From: `https://xxxxx.ngrok.io/api/webhooks/whop`
- To: `https://yourdomain.com/api/webhooks/whop`

## Testing Checklist

- [ ] Environment variables are set
- [ ] Dependencies are installed
- [ ] Dev server runs without errors
- [ ] Pricing page displays correctly
- [ ] Clicking "Subscribe" redirects to Whop checkout
- [ ] Webhook URL is configured in Whop dashboard
- [ ] Test subscription status check
- [ ] Test subscription cancellation

## Common Issues

### Issue: "WHOP_API_KEY is undefined"
**Solution**: Make sure `.env.local` exists and contains `WHOP_API_KEY`

### Issue: Checkout button does nothing
**Solution**: 
1. Check browser console for errors
2. Verify Plan ID is correct
3. Ensure API key has proper permissions

### Issue: Webhook not working
**Solution**:
1. Use ngrok for local testing (webhooks need public URL)
2. Verify webhook secret matches
3. Check Whop dashboard webhook logs

### Issue: TypeScript errors
**Solution**: Run `npm install` to ensure all types are installed

## Next Steps

1. **Customize the UI**: Update colors, fonts, and layout
2. **Add Authentication**: Integrate NextAuth, Clerk, or Auth0
3. **Database Integration**: Store subscriptions in your database
4. **Email Notifications**: Send emails on subscription events
5. **Analytics**: Track subscription metrics

## Need Help?

- Whop Docs: https://docs.whop.com
- Whop Support: https://whop.com/support
- Next.js Docs: https://nextjs.org/docs

