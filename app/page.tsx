import Link from 'next/link';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#1f2937',
            }}
          >
            Whop Payment Integration
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Complete subscription management with Whop payment gateway
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '60px',
          }}
        >
          <Link
            href="/pricing"
            style={{
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#5B4FE9',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '28px',
              }}
            >
              💳
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1f2937',
              }}
            >
              View Pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
              Browse our subscription plans and start your journey
            </p>
          </Link>

          <Link
            href="/subscription"
            style={{
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#22c55e',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '28px',
              }}
            >
              ⚙️
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1f2937',
              }}
            >
              Manage Subscription
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
              View, update, or cancel your active subscriptions
            </p>
          </Link>
        </div>

        <div
          style={{
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1f2937',
            }}
          >
            Features
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { icon: '🔐', title: 'Secure Payments', desc: 'PCI-DSS compliant payment processing' },
              { icon: '🔄', title: 'Auto-Renewal', desc: 'Automatic subscription renewals' },
              { icon: '📊', title: 'Real-time Status', desc: 'Live subscription status tracking' },
              { icon: '🎫', title: 'Webhooks', desc: 'Event-driven subscription updates' },
              { icon: '❌', title: 'Easy Cancellation', desc: 'Cancel anytime with one click' },
              { icon: '🔔', title: 'Notifications', desc: 'Email alerts for payment events' },
            ].map((feature, index) => (
              <div key={index}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#1f2937',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

