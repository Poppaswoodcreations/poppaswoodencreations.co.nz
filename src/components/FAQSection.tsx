import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs, 
  title = "Frequently Asked Questions" 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema markup for search engines and AI
  const generateFAQSchema = () => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    );
  };

  return (
    <section className="faq-section" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      {/* FAQ Schema for search engines */}
      {generateFAQSchema()}
      
      <h2 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        color: '#2c3e50'
      }}>
        {title}
      </h2>
      
      <div style={{ maxWidth: '800px' }}>
        {faqs.map((faq, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                padding: '1.25rem',
                textAlign: 'left',
                backgroundColor: openIndex === index ? '#f8f9fa' : 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#2c3e50',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (openIndex !== index) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (openIndex !== index) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <span>{faq.question}</span>
              <span style={{ 
                fontSize: '1.5rem',
                transition: 'transform 0.2s',
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </button>
            
            {openIndex === index && (
              <div 
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#f8f9fa',
                  borderTop: '1px solid #e0e0e0',
                  lineHeight: '1.7',
                  color: '#555'
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
