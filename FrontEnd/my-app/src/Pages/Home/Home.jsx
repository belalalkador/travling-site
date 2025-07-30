import React from 'react';
import { Layout } from '../../Layout/Layout';
import { Link } from 'react-router-dom';
import './Home.css'; // Updated CSS
import {useUser} from '../../Context/Context'
function Home() {
  
  const { user } = useUser();

  return (
    <Layout>
      <div className="home">
        <div className="glass">
          <h1>Welcome to TravelSite!</h1>
          <h1>{user?.name}</h1>
          <Link to="/reserve" className="reserve-btn">Reserve Now</Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
