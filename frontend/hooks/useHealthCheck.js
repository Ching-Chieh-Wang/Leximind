import { useEffect } from 'react';

const useHealthCheck = () => {
  const sendHealthCheck = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (response.ok) {
        console.log('Health check sent successfully');
      } else {
        console.error('Failed to send health check:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending health check:', error);
    }
  };

  useEffect(() => {
    // Send the first request immediately
    sendHealthCheck();

    // Send every 14 minutes (14 * 60 * 1000 ms)
    const interval = setInterval(sendHealthCheck, 14 * 60 * 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);
};

export default useHealthCheck;