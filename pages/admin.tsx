import React, { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  referrerId: string | null;
  name: string | null;
  email: string;
  spinCount: number;
  refererCode: string | null;
  refererBy: string | null;
  emailVerifiedAt: string | null;
  password: string;
  avatar: string | null;
  dob: string | null;
  gender: string | null;
  appLang: string;
  phone: string | null;
  countryCode: string | null;
  dateOfBirth: string | null;
  phoneVerifiedAt: string | null;
  googleId: string | null;
  facebookId: string | null;
  rememberToken: string | null;
  status: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  address: string;
  privateKey: string | null;
  role: {
    id: number;
    name: string;
  };
  seedPhrase: string | null;
}

interface BAMPackage {
  id: number;
  title: string;
  period: string;
  dailyIncome: string;
  purchaseAmount: number;
  amount: number;
  imageUrl: string;
  color: string | null;
  status: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function Admin() {
  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [bamPackages, setBamPackages] = useState<BAMPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and BAM packages from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('/api/auth/list-user');
        const usersData = await usersResponse.json();
        if (usersData.statusCode === 'OK' && usersData.body) {
          // Filter out admin users, only show regular users
          const regularUsers = usersData.body.filter((user: User) => user.role.name === 'USER');
          setUsers(regularUsers);
        }

        // Fetch BAM packages
        const packagesResponse = await fetch('/api/product/');
        const packagesData = await packagesResponse.json();
        if (packagesData.statusCode === 'OK' && packagesData.body) {
          setBamPackages(packagesData.body);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setUsersLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePackageStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/admin-configs/update-product?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state after successful API call
        setBamPackages(packages =>
          packages.map(pkg =>
            pkg.id === id ? { ...pkg, status: pkg.status === 1 ? 0 : 1 } : pkg
          )
        );
        console.log('Package status updated successfully');
      } else {
        console.error('Failed to update package status:', data);
        alert('Failed to update package status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating package status:', error);
      alert('Error updating package status. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - BAM</title>
      </Head>
      <div className="admin-page">
        <div className="admin-header">
          <div className="header-top">
            <h1>Admin Dashboard</h1>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
          <p>Welcome, {user?.name || user?.email}</p>
        </div>

        <div className="admin-content">
          {/* User Management Section */}
          <div className="admin-section">
            <h2>User Management</h2>
            {usersLoading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name || 'N/A'}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${user.status === 1 ? 'active' : 'inactive'}`}>
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="action-btn edit">Edit</button>
                          <button className="action-btn delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BAM Package Management Section */}
          <div className="admin-section">
            <h2>BAM Package Management</h2>
            {loading ? (
              <div className="loading">Loading packages...</div>
            ) : (
              <div className="package-grid">
                {bamPackages.map(pkg => (
                  <div key={pkg.id} className="package-card">
                    <div className="package-info">
                      <h3>{pkg.title}</h3>
                      <p className="package-price">${pkg.purchaseAmount}</p>
                      <p className="package-details">
                        Daily: ${pkg.dailyIncome} | Period: {pkg.period} days | Total: ${pkg.amount}
                      </p>
                    </div>
                    <div className="package-controls">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={pkg.status === 1}
                          onChange={() => togglePackageStatus(pkg.id)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="status-text">
                        {pkg.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
