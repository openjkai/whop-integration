# Quick Start Guide

Get your Whop integration running in 5 minutes!

## 🚀 Fast Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cat > .env.local << EOF
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
WHOP_COMPANY_ID=your_company_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📝 Get Whop Credentials

1. Visit [Whop Dashboard](https://whop.com/dashboard)
2. Go to **Settings** → **Developers**
3. Click **Generate API Key**
4. Copy your **API Key** and **Webhook Secret**
5. Paste them into `.env.local`

## 🎯 Update Plan IDs

Edit `app/pricing/page.tsx`:

```typescript
const plans = [
  {
    planId: 'plan_YOUR_ACTUAL_PLAN_ID', // ← Change this!
    name: 'Starter',
    price: '$9.99',
    // ...
  },
];
```

Get your Plan IDs from **Whop Dashboard** → **Products**

## ✅ Test Checkout

1. Go to [http://localhost:3000/pricing](http://localhost:3000/pricing)
2. Click any **Subscribe** button
3. You'll be redirected to Whop checkout
4. Complete test payment
5. Check subscription at [http://localhost:3000/subscription](http://localhost:3000/subscription)

## 🔗 Setup Webhooks (Production)

After deploying:

1. Go to **Whop Dashboard** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/whop`
3. Select events:
   - ✅ membership.created
   - ✅ membership.updated
   - ✅ membership.deleted
   - ✅ payment.succeeded
   - ✅ payment.failed
4. Save

## 🧪 Test Webhooks Locally

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Start ngrok
ngrok http 3000

# Use the HTTPS URL in Whop webhook settings
# Example: https://abc123.ngrok.io/api/webhooks/whop
```

## 📂 Project Structure

```
whop-integration/
├── app/
│   ├── api/              ← Backend API routes
│   ├── pricing/          ← Pricing page
│   └── subscription/     ← Manage subscriptions
├── components/           ← React components
├── lib/                  ← Whop client & utils
├── types/                ← TypeScript types
└── hooks/                ← Custom React hooks
```

## 🎨 Customize

### Change Colors

Edit inline styles in components:
- Primary: `#5B4FE9` (Whop purple)
- Success: `#22c55e` (green)
- Error: `#ef4444` (red)

### Add Authentication

Integrate with:
- [NextAuth.js](https://next-auth.js.org/)
- [Clerk](https://clerk.com/)
- [Auth0](https://auth0.com/)

### Add Database

Store subscriptions in:
- PostgreSQL (via Prisma)
- MongoDB (via Mongoose)
- Supabase
- Firebase

## 🐛 Common Issues

### "Cannot read properties of undefined"
➡️ Check that `.env.local` exists and has all variables

### "Invalid API key"
➡️ Verify API key in Whop dashboard, regenerate if needed

### Checkout button does nothing
➡️ Open browser console, check for errors
➡️ Verify plan ID is correct

### Webhook not working
➡️ For local: Use ngrok
➡️ For production: Check webhook logs in Whop dashboard

## 📚 Next Steps

1. ✅ Complete setup above
2. 📖 Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for details
3. 🏗️ Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand structure
4. 🎨 Customize UI to match your brand
5. 🔐 Add authentication
6. 💾 Add database integration
7. 📧 Implement email notifications
8. 🚀 Deploy to production

## 🆘 Need Help?

- **Whop Issues**: [Whop Support](https://whop.com/support)
- **Code Issues**: [Open GitHub Issue](#)
- **Documentation**: [README.md](./README.md)

## 📹 Video Tutorial

Coming soon! Subscribe for updates.

---

**Made with ❤️ for developers**

