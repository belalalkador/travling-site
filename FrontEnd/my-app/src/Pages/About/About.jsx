import { Layout } from '../../Layout/Layout';


function About() {
  return (
    <Layout>
      <div
        className="flex items-center justify-center min-h-screen px-4 py-10 bg-center bg-cover sm:py-16 md:py-24"
        style={{ backgroundImage: `url('../../../src/assets/download\ \(9\).jfif')` }}
      >
        <div className="w-full max-w-4xl p-6 text-center text-white shadow-lg sm:p-8 md:p-10 bg-white/20 backdrop-blur-md rounded-2xl ">
          <h1 className="mb-5 text-3xl font-bold sm:text-4xl text-cyan-400">About TravelSite</h1>
          <p className="mb-8 text-base leading-relaxed sm:mb-10 sm:text-lg">
            TravelSite is your ultimate destination to plan and book your dream trips! 🌍✈️
            We offer easy, fast, and secure booking for all types of vacations — whether you're
            looking for adventure, relaxation, or exploration.
          </p>

          <h2 className="mb-2 text-xl font-semibold sm:mb-3 sm:text-2xl text-cyan-300">How to Reserve?</h2>
          <p className="mb-8 text-sm leading-relaxed sm:mb-10 sm:text-base">
            1. Browse through our available travel packages.<br />
            2. Choose your favorite destination.<br />
            3. Click on the "Reserve Now" button and fill in your details.<br />
            4. Our team will confirm your booking shortly! ✅
          </p>

          <h2 className="mb-2 text-xl font-semibold sm:mb-3 sm:text-2xl text-cyan-300">Contact the Admin</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            📞 Phone: +123-456-7890<br />
            📱 WhatsApp: +123-456-7890<br />
            📧 Email: support@travelsite.com
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default About;
