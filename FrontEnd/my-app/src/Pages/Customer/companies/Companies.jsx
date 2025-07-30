import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Companies.css';
import axios from 'axios';
import { Layout } from '../../../Layout/Layout';

const Companies = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { companies = [], data = {} } = location.state || {};
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    console.log('Received companies:', companies);

    if (!location.state) {
      console.warn('No location.state found — user may have visited directly.');
    }

    if (Array.isArray(companies) && companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, location.state, selectedCompany]);

  const handleShowJourneys = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/customer/api/v1/company-journeys',
        {
          companyId: selectedCompany.companyId,
          ...data,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log(response.data);
        navigate('/reserve/company-journeys', { state: { journeys: response.data.journeys } });
      }
    } catch (error) {
      console.error('Error fetching journeys:', error.message);
    }
  };

  return (
    <Layout>
      <div className="companies-container">
        <h2 className="companies-title">Choose a Company</h2>

        {Array.isArray(companies) && companies.length > 0 ? (
          <>
            <select
              className="companies-select"
              value={selectedCompany?.companyId || ''}
              onChange={(e) =>
                setSelectedCompany(
                  companies.find((company) => company.companyId === e.target.value)
                )
              }
            >
              {companies.map((company, index) => (
                <option key={index} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
            </select>

            <button
              className="show-journeys-button"
              onClick={handleShowJourneys}
              disabled={!selectedCompany}
            >
              Show Journeys for Selected Company
            </button>

            {selectedCompany && (
              <div className="companies-selected">
                Selected Company: <strong>{selectedCompany.companyName}</strong>
              </div>
            )}
          </>
        ) : (
          <div className="companies-error">
            <h3>No companies to show.</h3>
            <p>Please go back and search again.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Companies;
