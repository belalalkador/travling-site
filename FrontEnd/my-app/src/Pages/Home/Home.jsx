import { Layout } from '../../Layout/Layout';
import { Link } from 'react-router-dom';
import { useUser } from '../../Context/Context';

function Home() {
  const { user } = useUser();

  return (
    <Layout>
      <div
        className="h-screen bg-center bg-cover "
        style={{ backgroundImage: 
`url('../../../src/assets/download\ \(13\).jfif')` }} // ✅ 
      >
        <div className="flex flex-col items-center justify-center w-full h-full text-center text-white bg-white/10 backdrop-blur-sm">
          <h1
            className={`mb-6 font-bold transition-all duration-500 ${
              user ? 'text-6xl text-blue-900 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)] animate-pulse' : 'text-4xl md:text-5xl'
            }`}
          >
            Welcome to TravelSite!
          </h1>

          {user && (
            <h2 className="mb-6 text-6xl font-semibold text-cyan-200 animate-bounce drop-shadow-lg">
              Hello, {user.name}
            </h2>
          )}

          <Link
            to="/reserve"
            className="px-6 py-3 font-semibold text-white transition duration-300 transform rounded-full bg-cyan-500 hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-400/50 hover:scale-105"
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
