import React from 'react';
import { Layout } from '../../Layout/Layout';
import './About.css'; // Make sure About.css exists

function About() {
  return (
    <Layout>
      <div className="about-background">
        <div className="about-glass">
          <div className="about-content">
            <h1>About TravelSite</h1>
            <p>
              TravelSite is your ultimate destination to plan and book your dream trips! 🌍✈️
              We offer easy, fast, and secure booking for all types of vacations — whether you're looking for adventure, relaxation, or exploration.
            </p>

            <h2>How to Reserve?</h2>
            <p>
              1. Browse through our available travel packages.<br />
              2. Choose your favorite destination.<br />
              3. Click on the "Reserve Now" button and fill in your details.<br />
              4. Our team will confirm your booking shortly! ✅
            </p>

            <h2>Contact the Admin</h2>
            <p>
              📞 Phone: +123-456-7890<br />
              📱 WhatsApp: +123-456-7890<br />
              📧 Email: support@travelsite.com
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
