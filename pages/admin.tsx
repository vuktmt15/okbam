import React, { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface BAMPackage {
  id: number;
  name: string;
  price: string;
  isActive: boolean;
}

export default function Admin() {
  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const { user, logout } = useAuth();
  const [users] = useState<User[]>([
    { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-20' },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com', status: 'inactive', joinDate: '2024-01-10' },
    { id: 4, username: 'alice_brown', email: 'alice@example.com', status: 'active', joinDate: '2024-01-25' },
    { id: 5, username: 'charlie_davis', email: 'charlie@example.com', status: 'inactive', joinDate: '2024-01-05' },
  ]);

  const [bamPackages, setBamPackages] = useState<BAMPackage[]>([
    { id: 1, name: 'BAM Basic', price: '$10', isActive: true },
    { id: 2, name: 'BAM Premium', price: '$45', isActive: true },
    { id: 3, name: 'BAM Pro', price: '$105', isActive: false },
    { id: 4, name: 'BAM VIP', price: '$500', isActive: true },
    { id: 5, name: 'BAM Elite', price: '$1350', isActive: false },
  ]);

  const togglePackageStatus = (id: number) => {
    setBamPackages(packages =>
      packages.map(pkg =>
        pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
      )
    );
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
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <button className="action-btn edit">Edit</button>
                        <button className="action-btn delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BAM Package Management Section */}
          <div className="admin-section">
            <h2>BAM Package Management</h2>
            <div className="package-grid">
              {bamPackages.map(pkg => (
                <div key={pkg.id} className="package-card">
                  <div className="package-info">
                    <h3>{pkg.name}</h3>
                    <p className="package-price">{pkg.price}</p>
                  </div>
                  <div className="package-controls">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={pkg.isActive}
                        onChange={() => togglePackageStatus(pkg.id)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="status-text">
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
