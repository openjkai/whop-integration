# Architecture Documentation

## Overview

This Next.js application provides a complete integration with Whop payment gateway for subscription management. The architecture follows a modern, type-safe approach with clear separation between frontend components, API routes, and business logic.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: Inline styles (easily replaceable)
- **Payment Gateway**: Whop API

## Directory Structure

```
whop-integration/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes (backend)
│   │   ├── subscription/    # Subscription management endpoints
│   │   └── webhooks/        # Webhook handlers
│   ├── pricing/             # Pricing page
│   ├── subscription/        # Subscription management page
│   └── page.tsx             # Home page
├── components/              # React components
├── lib/                     # Business logic & utilities
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
└── examples/                # Usage examples
```

## Architecture Layers

### 1. Presentation Layer (Components)

**Location**: `components/`

React components that handle UI rendering and user interactions.

- `SubscriptionButton.tsx`: Initiates checkout
- `SubscriptionStatus.tsx`: Displays subscription information
- `CancelSubscription.tsx`: Handles cancellation/reactivation
- `PricingCard.tsx`: Renders pricing plans

**Responsibilities**:
- User interface rendering
- User input handling
- State management (UI state only)
- API calls to backend routes

### 2. API Layer (Backend Routes)

**Location**: `app/api/`

Next.js API routes that handle server-side operations.

#### Subscription Routes

- `POST /api/subscription/create-checkout`: Creates Whop checkout session
- `GET /api/subscription/verify`: Verifies membership validity
- `GET /api/subscription/status`: Retrieves subscription status
- `POST /api/subscription/cancel`: Cancels subscription
- `POST /api/subscription/reactivate`: Reactivates cancelled subscription

#### Webhook Route

- `POST /api/webhooks/whop`: Receives and processes Whop events

**Responsibilities**:
- Request validation
- Authentication (future)
- Business logic orchestration
- Error handling
- Response formatting

### 3. Business Logic Layer

**Location**: `lib/`

Core business logic and external service integrations.

#### WhopClient (`lib/whop-client.ts`)

Wrapper around Whop API with methods for:
- Membership management
- User operations
- Product retrieval
- Checkout session creation

**Key Methods**:
```typescript
getMembership(id): Get membership details
getUserMemberships(userId): Get all user subscriptions
verifyMembership(id): Check if membership is active
createCheckout(planId): Create checkout session
cancelMembership(id): Cancel subscription
reactivateMembership(id): Reactivate subscription
```

#### Webhook Utils (`lib/webhook-utils.ts`)

Utilities for webhook handling:
- Signature verification (security)
- Payload parsing
- Event validation

### 4. Type Layer

**Location**: `types/`

TypeScript definitions for type safety across the application.

**Key Types**:
- `WhopMembership`: Subscription data structure
- `WhopUser`: User information
- `WhopProduct`: Product details
- `WhopPlan`: Pricing plan
- `WhopWebhookEvent`: Webhook event structure

### 5. Hook Layer

**Location**: `hooks/`

Custom React hooks for common operations.

#### useSubscription Hook

Provides subscription management functionality with:
- Loading states
- Error handling
- Membership operations
- Automatic state updates

## Data Flow

### Subscription Creation Flow

```
1. User clicks "Subscribe" button
   ↓
2. SubscriptionButton component calls API
   ↓
3. POST /api/subscription/create-checkout
   ↓
4. WhopClient.createCheckout(planId)
   ↓
5. Whop API creates checkout session
   ↓
6. User redirected to Whop checkout page
   ↓
7. User completes payment on Whop
   ↓
8. Whop sends webhook to /api/webhooks/whop
   ↓
9. Webhook handler processes event
   ↓
10. Custom logic executes (email, database, etc.)
```

### Subscription Verification Flow

```
1. App needs to verify access
   ↓
2. GET /api/subscription/verify?membershipId=xxx
   ↓
3. WhopClient.verifyMembership(id)
   ↓
4. Whop API returns membership status
   ↓
5. API validates status and valid flag
   ↓
6. Returns boolean to frontend
   ↓
7. UI grants/denies access
```

### Cancellation Flow

```
1. User clicks "Cancel Subscription"
   ↓
2. Confirmation dialog appears
   ↓
3. User confirms cancellation
   ↓
4. POST /api/subscription/cancel
   ↓
5. WhopClient.cancelMembership(id)
   ↓
6. Whop marks subscription for cancellation
   ↓
7. Whop sends webhook (membership.updated)
   ↓
8. Webhook handler processes event
   ↓
9. User notified (access continues until period end)
```

## Security Considerations

### API Security

1. **Environment Variables**: Sensitive keys stored in `.env.local`
2. **Server-Side Only**: API keys never exposed to client
3. **Webhook Verification**: HMAC signature validation
4. **HTTPS Required**: All production traffic over HTTPS

### Recommended Additions

- **Rate Limiting**: Prevent abuse of API endpoints
- **Authentication**: Verify user identity before operations
- **Authorization**: Ensure users can only access their subscriptions
- **CSRF Protection**: Protect state-changing operations
- **Input Validation**: Validate all user inputs
- **Logging**: Log all operations for audit trail

## Webhook Processing

### Event Types

The system handles these Whop webhook events:

1. **membership.created**: New subscription
   - Store in database
   - Send welcome email
   - Grant access
   - Log analytics

2. **membership.updated**: Subscription changed
   - Update database
   - Handle cancellation flags
   - Notify user of changes

3. **membership.deleted**: Subscription ended
   - Revoke access
   - Send confirmation email
   - Archive subscription data

4. **payment.succeeded**: Payment processed
   - Send receipt
   - Log revenue
   - Extend access period

5. **payment.failed**: Payment declined
   - Notify user
   - Update subscription status
   - Trigger retry logic

### Webhook Security

1. **Signature Verification**: Every webhook validated using HMAC-SHA256
2. **Idempotency**: Handle duplicate events gracefully
3. **Quick Response**: Return 200 OK immediately, process async
4. **Error Handling**: Retry logic for failed processing

## State Management

### Component State

- Local state for UI interactions
- Loading states for async operations
- Error states for user feedback

### Server State

- Subscriptions fetched from Whop API
- No client-side caching (always fresh data)
- Optimistic updates for better UX

### Future Enhancements

Consider adding:
- React Query for better data management
- Context API for global state
- Redux for complex state needs

## Scalability Considerations

### Current Design

- Stateless API routes (horizontal scaling)
- Direct Whop API calls (no caching)
- Synchronous webhook processing

### Recommended Optimizations

1. **Caching Layer**
   - Redis for membership status
   - Reduce API calls to Whop
   - Invalidate on webhook events

2. **Queue System**
   - Process webhooks asynchronously
   - Retry failed operations
   - Better reliability

3. **Database Layer**
   - Store subscriptions locally
   - Faster queries
   - Reduced API dependencies

4. **CDN Integration**
   - Cache static pages
   - Faster page loads
   - Reduced server load

## Error Handling

### Frontend Errors

- User-friendly error messages
- Loading states during operations
- Retry mechanisms for failed requests

### Backend Errors

- Structured error responses
- Proper HTTP status codes
- Error logging for debugging

### Webhook Errors

- Return 200 even if processing fails (Whop will retry)
- Log all errors for investigation
- Alert on repeated failures

## Testing Strategy

### Unit Tests

- Test individual functions
- Mock external API calls
- Verify error handling

### Integration Tests

- Test API routes
- Verify Whop integration
- Test webhook processing

### End-to-End Tests

- Complete user flows
- Subscription lifecycle
- Payment processing

## Deployment Architecture

### Vercel (Recommended)

```
User Browser
    ↓
Vercel CDN (static assets)
    ↓
Next.js Server (Vercel Functions)
    ↓
Whop API (external)
```

### Self-Hosted

```
User Browser
    ↓
Load Balancer
    ↓
Next.js Servers (multiple instances)
    ↓
Whop API (external)
```

## Performance Optimization

### Current Implementation

- Server-side rendering
- API routes for data fetching
- Inline styles (no CSS bundle)

### Suggested Improvements

1. **Static Generation**: Pre-render pricing page
2. **Image Optimization**: Use Next.js Image component
3. **Code Splitting**: Lazy load components
4. **Caching**: Cache Whop API responses
5. **Compression**: Gzip/Brotli compression

## Monitoring & Observability

### Recommended Tools

- **Vercel Analytics**: Page performance
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Infrastructure monitoring

### Key Metrics

- Checkout conversion rate
- Subscription churn rate
- API response times
- Webhook processing time
- Error rates

## Future Enhancements

### Short Term

- [ ] Add authentication (NextAuth)
- [ ] Implement database storage
- [ ] Add email notifications
- [ ] Improve error messages
- [ ] Add loading skeletons

### Long Term

- [ ] Multi-currency support
- [ ] Team/organization subscriptions
- [ ] Usage-based billing
- [ ] Custom billing periods
- [ ] Prorated upgrades/downgrades
- [ ] Referral system
- [ ] Analytics dashboard

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Monitor Whop API changes
- Review webhook logs
- Optimize performance
- Update documentation

### Breaking Changes

When Whop updates their API:
1. Review changelog
2. Update types if needed
3. Test all integrations
4. Update documentation
5. Deploy gradually

## Support & Resources

- **Whop API Docs**: https://docs.whop.com
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

Last Updated: November 2025

