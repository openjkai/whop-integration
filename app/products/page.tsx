import Link from 'next/link';
import { whopClient } from '@/lib/whop-client';

// Helper function to format date
function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function ProductsPage() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  
  // Fetch products from Whop API
  const whopProducts = await whopClient.listProducts(companyId);
  
  console.log('Fetched products:', whopProducts);

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
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Back Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#5B4FE9',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#1f2937',
            }}
          >
            Products
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Browse all available products from your Whop store
          </p>
        </div>

        {/* Products Count */}
        {whopProducts.length > 0 && (
          <div
            style={{
              marginBottom: '24px',
              padding: '16px 20px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '24px' }}>📦</span>
            <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
              Found <strong>{whopProducts.length}</strong> product{whopProducts.length !== 1 ? 's' : ''} in your Whop account
            </p>
          </div>
        )}

        {/* Products Grid */}
        {whopProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            {whopProducts.map((product: any) => (
              <div
                key={product.id}
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Product Header */}
                <div style={{ marginBottom: '16px' }}>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1f2937',
                    }}
                  >
                    {product.name || 'Unnamed Product'}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#5B4FE9',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {product.id}
                    </span>
                    {product.visibility && (
                      <span
                        style={{
                          padding: '4px 10px',
                          backgroundColor: product.visibility === 'visible' ? '#22c55e' : '#f59e0b',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {product.visibility}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}
                  >
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                )}

                {/* Product Details */}
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Created Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Created:</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                        {formatDate(product.created_at)}
                      </span>
                    </div>

                    {/* Active Memberships */}
                    {product.active_memberships_count !== undefined && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Active Members:</span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#22c55e',
                          }}
                        >
                          {product.active_memberships_count}
                        </span>
                      </div>
                    )}

                    {/* Product Type */}
                    {product.product_type && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Type:</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                          {product.product_type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Plans Button */}
                <Link
                  href={`/pricing`}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    textAlign: 'center',
                    backgroundColor: '#5B4FE9',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  View Pricing Plans →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // No Products Found
          <div
            style={{
              padding: '60px 40px',
              backgroundColor: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px dashed #e5e7eb',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1f2937',
              }}
            >
              No Products Found
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#6b7280',
                marginBottom: '24px',
                maxWidth: '500px',
                margin: '0 auto 24px',
              }}
            >
              {companyId
                ? "You don't have any products yet. Create your first product in the Whop dashboard."
                : 'Please add WHOP_COMPANY_ID to your .env.local file to fetch products.'}
            </p>
            <Link
              href="https://whop.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#5B4FE9',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Go to Whop Dashboard →
            </Link>
          </div>
        )}

        {/* Info Box */}
        <div
          style={{
            padding: '24px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#92400e',
            }}
          >
            💡 About Products
          </h3>
          <p style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.6', margin: 0 }}>
            Products are the main items you sell on Whop. Each product can have multiple pricing plans 
            (monthly, yearly, one-time, etc.). Products are automatically fetched from your Whop account 
            using the official Whop SDK.
          </p>
        </div>
      </div>
    </main>
  );
}

