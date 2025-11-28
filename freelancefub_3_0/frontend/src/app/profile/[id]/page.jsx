'use client';

import { useParams } from 'next/navigation';

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Профіль</h1>
      {/* User ID: {userId} */}
    </div>
  );
};

export default Profile;
