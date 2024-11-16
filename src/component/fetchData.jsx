import React, { useEffect, useState } from "react";

function FetchData() {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch API data when the component mounts
    const fetchAPI = async () => {
      try {
        const response = await fetch(
          "https://blogg-sandy-pi.vercel.app/service"
        ); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false); // Update loading state
      } catch (error) {
        setError(error.message); // Handle error if fetch fails
        setLoading(false);
      }
    };

    fetchAPI();
  }, []); // Empty dependency array ensures this runs once on mount



  if (loading) {
    return <div className="text-center text-xl font-semibold py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl py-10">Error: {error}</div>;
  }



  return (
   


    <div className="container mx-auto p-4 mt-5">
      <h1 className="text-3xl font-bold text-center mb-6 mt-10">Data List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </div>

   

  );
}

export default FetchData;
