"use client"

import React, { useState, useEffect } from 'react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const apiKey = '7672343d2249c87c200c99aac710f75d'; // Replace with your actual API key
  const appId = '5b9ee676'; // Replace with your actual App ID
  const countryCode = 'in'; // Country code (e.g., 'us' for USA)
  const resultsPerPage = 10; // Number of results per page
  const what = 'developer'; // Job title or keyword
  const where = 'India'; // Location

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${currentPage}?app_id=${appId}&app_key=${apiKey}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobs(data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [apiKey, appId, countryCode, resultsPerPage, what, where, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0a0a0a', // Dark background
      color: '#e0e0e0', // Light text
      minHeight: '100vh',
    },
    heading: {
      textAlign: 'center',
      color: '#ffffff', // White heading
      marginBottom: '20px',
      fontSize: '2rem',
    },
    jobCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
    },
    jobCard: {
      background: '#2a2a2a', // Dark card background
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      padding: '20px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    jobCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
    },
    jobTitle: {
      fontSize: '1.5rem',
      margin: '0 0 10px 0',
      color: '#ffffff', // White title
    },
    jobDetail: {
      margin: '5px 0',
      color: '#b0b0b0', // Light gray text
    },
    applyButton: {
      display: 'inline-block',
      marginTop: '15px',
      padding: '10px 20px',
      backgroundColor: '#007bff', // Blue button
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '5px',
      textAlign: 'center',
      transition: 'background-color 0.3s ease',
    },
    applyButtonHover: {
      backgroundColor: '#0056b3', // Darker blue on hover
    },
    pagination: {
      textAlign: 'center',
      marginTop: '30px',
    },
    paginationButton: {
      padding: '10px 20px',
      margin: '0 10px',
      backgroundColor: '#007bff', // Blue button
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    paginationButtonDisabled: {
      backgroundColor: '#555', // Gray for disabled button
      cursor: 'not-allowed',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#e0e0e0', // Light text
      marginTop: '50px',
    },
    error: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#ff6b6b', // Red error text
      marginTop: '50px',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Job Listings</h1>
      <div style={styles.jobCards}>
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              key={index}
              style={styles.jobCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.jobCardHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <h2 style={styles.jobTitle}>{job.title}</h2>
              <p style={styles.jobDetail}><strong>Company:</strong> {job.company.display_name}</p>
              <p style={styles.jobDetail}><strong>Location:</strong> {job.location.display_name}</p>
              <p style={styles.jobDetail}>
                <strong>Salary:</strong> {job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : 'Not specified'}
              </p>
              <p style={styles.jobDetail}>
                <strong>Posted:</strong> {formatDate(job.created)}
              </p>
              <p style={styles.jobDetail}>
                <strong>Last Date to Apply:</strong> {job.contract_time ? formatDate(job.contract_time) : 'Not specified'}
              </p>
              <p style={styles.jobDetail}>
                <strong>Description:</strong> {job.description.substring(0, 150)}...
              </p>
              <a
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.applyButton}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.applyButtonHover.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.applyButton.backgroundColor)}
              >
                Apply Now
              </a>
            </div>
          ))
        ) : (
          <p style={styles.jobDetail}>No job listings found.</p>
        )}
      </div>
      <div style={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButton}
        >
          Previous
        </button>
        <span style={{ color: '#e0e0e0' }}>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobListings;