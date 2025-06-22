'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const UserProfilePage = () => {
  const params = useParams();
  const { userId } = params;

  const handleRequestExchange = () => {
    alert(`Skill exchange request sent to user ${userId}!`);
    // Here you would typically open a modal to select a skill to offer
    // and then send a request to the backend.
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p className="mb-6">This is the profile page for user: <span className="font-mono bg-gray-100 p-1 rounded">{userId}</span></p>
      
      <button 
        onClick={handleRequestExchange}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Request Skill Exchange
      </button>
    </div>
  );
};

export default UserProfilePage;
