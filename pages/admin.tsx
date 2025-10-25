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
  balance?: {
    usdt: number;
    dragon: number;
  }; // Thêm trường số dư
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

interface AdminConfig {
  id: number;
  name: string;
  value: string;
  description: string;
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

  // Config management state
  const [withdrawConfig, setWithdrawConfig] = useState<AdminConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  // Cache all users to avoid refetching
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allUsersLoaded, setAllUsersLoaded] = useState(false);

  const [listUserDeposit, setListUserDeposit] = useState<any>([]);

  // Cache user balances to avoid refetching
  const [balanceCache, setBalanceCache] = useState<{[key: string]: {usdt: number, dragon: number}}>({});
  const [pageLoading, setPageLoading] = useState(false);

  // Deposit/Withdraw history (admin)
  const [txLoading, setTxLoading] = useState(false);
  const [txData, setTxData] = useState<any>([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const txPerPage = 10;

  // Fetch all users once on component mount
  React.useEffect(() => {
    const fetchAllUsers = async () => {
      if (allUsersLoaded) return;

      try {
        setUsersLoading(true);
        const allUsersResponse = await fetch('/api/auth/list-user');
        const allUsersData = await allUsersResponse.json();

        if (allUsersData.statusCode === 'OK' && allUsersData.body) {
          // Filter out admin users, only show regular users
          const allRegularUsers = allUsersData.body.filter((user: User) => user.role.name === 'USER');

          setAllUsers(allRegularUsers);
          setTotalUsers(allRegularUsers.length);
          setTotalPages(Math.ceil(allRegularUsers.length / usersPerPage));
          setAllUsersLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchAllUsers();
  }, [allUsersLoaded, usersPerPage]);

  // Fetch balance for current page users
  React.useEffect(() => {
    const fetchCurrentPageUsers = async () => {
      if (!allUsersLoaded || allUsers.length === 0) return;

      try {
        setPageLoading(true);

        // Get users for current page
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const currentPageUsers = allUsers.slice(startIndex, endIndex);

        // Fetch balance for each user on current page (with caching)
        const usersWithBalance = await Promise.all(
          currentPageUsers.map(async (user: User) => {
            try {
              // Use referrerId if available, otherwise use user id
              const referrerId = user.referrerId || user.id.toString();

              // Check if balance is already cached
              if (balanceCache[referrerId]) {
                return {
                  ...user,
                  balance: balanceCache[referrerId]
                };
              }

              // Fetch balance from API
              const balanceResponse = await fetch(`/api/getBalance?referrerId=${referrerId}`);
              const balanceData = await balanceResponse.json();
              const balance = balanceData.balance || { usdt: 0, dragon: 0 };

              // Cache the balance
              setBalanceCache(prev => ({
                ...prev,
                [referrerId]: balance
              }));

              return {
                ...user,
                balance: balance
              };
            } catch (error) {
              console.error(`Error fetching balance for user ${user.id}:`, error);
              const defaultBalance = { usdt: 0, dragon: 0 };
              return {
                ...user,
                balance: defaultBalance
              };
            }
          })
        );

        setUsers(usersWithBalance);
      } catch (error) {
        console.error('Error fetching current page users:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCurrentPageUsers();
  }, [currentPage, allUsers, allUsersLoaded, usersPerPage]);

  // Fetch deposit/withdraw history for admin
  React.useEffect(() => {
    const fetchTx = async () => {
      try {
        setTxLoading(true);
        const res = await fetch('/api/auth/list-user');
        const data = await res.json();
        if (data?.statusCode === 'OK' && Array.isArray(data.body)) {
          // Sort newest first
          const sorted = [...data.body].sort((a,b)=> new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
          // Pagination client-side (API chưa có paging)
          const total = Math.ceil(sorted.length / txPerPage) || 1;
          setTxTotalPages(total);
          const start = (txPage - 1) * txPerPage;
          const end = start + txPerPage;
          setTxData(sorted.slice(start, end));
        } else {
          setTxData([]);
          setTxTotalPages(1);
        }
      } catch (e) {
        console.error('Fetch admin tx error', e);
        setTxData([]);
      } finally {
        setTxLoading(false);
      }
    };
    fetchTx();
  }, [txPage]);

  React.useEffect(() => {
    const fetchTx = async () => {
      try {
        setTxLoading(true);
        const res = await fetch('/api/admin-users/list-user');
        const data = await res.json();
        if (data?.statusCode === 'OK' && Array.isArray(data.body)) {
          setListUserDeposit(data?.body)
        } else {
          setListUserDeposit([])
        }
      } catch (e) {
        console.error('Fetch admin tx error', e);
        setTxData([]);
      } finally {
        setTxLoading(false);
      }
    };
    fetchTx();
  }, []);

  // Fetch BAM packages and config from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch BAM packages
        const packagesResponse = await fetch('/api/product/');
        const packagesData = await packagesResponse.json();
        if (packagesData.statusCode === 'OK' && packagesData.body) {
          setBamPackages(packagesData.body);
        }

        // Fetch admin configs
        const configResponse = await fetch('/api/admin-configs');
        const configData = await configResponse.json();
        if (Array.isArray(configData) && configData.length > 0) {
          // Find the withdraw config (id = 1)
          const withdrawConfigData = configData.find((config: AdminConfig) => config.id === 1);
          if (withdrawConfigData) {
            setWithdrawConfig(withdrawConfigData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setConfigLoading(false);
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

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin-users/delete-history?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Remove user from local state
        setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

        // Update total count
        setTotalUsers(prev => prev - 1);
        setTotalPages(Math.ceil((totalUsers - 1) / usersPerPage));

        alert('User deleted successfully');
      } else {
        console.error('Failed to delete user:', data);
        alert(`Failed to delete user: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const toggleWithdrawConfig = async (e?: React.MouseEvent) => {
    console.log('🔥 TOGGLE FUNCTION CALLED!!!');

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!withdrawConfig) {
      console.log('❌ No withdrawConfig found');
      return;
    }

    console.log('=== TOGGLE WITHDRAW CONFIG START ===');
    console.log('Current withdrawConfig:', withdrawConfig);

    try {
      const newStatus = withdrawConfig.status === 1 ? 0 : 1;
      console.log('New status:', newStatus);

      const response = await fetch(`/api/admin-configs/update-config?id=1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        // Update local state after successful API call
        setWithdrawConfig(prev => prev ? { ...prev, status: newStatus } : null);
        console.log('Withdraw config updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to update withdraw config:', errorText);
        alert('Không thể cập nhật cấu hình rút tiền. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating withdraw config:', error);
      alert('Lỗi khi cập nhật cấu hình rút tiền. Vui lòng thử lại.');
    }
    console.log('=== TOGGLE WITHDRAW CONFIG END ===');
  };

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - DRAGON</title>
      </Head>
      <div className="admin-page">
        <div className="admin-header">
          <div className="header-top">
            <h1>Admin Dashboard</h1>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
          <p>Welcome, admin</p>
        </div>

        <div className="admin-content">
          {/* System Configuration Section */}
          <div className="admin-section">
            <h2>Quản lý cấu hình hệ thống</h2>
            {configLoading ? (
              <div className="loading">Đang tải cấu hình...</div>
            ) : (
              <div className="config-container">
                <div className="config-card">
                  <div className="config-info">
                    <h3>{withdrawConfig?.name || 'Bật/Tắt rút tiền'}</h3>
                  </div>
                  <div className="config-controls">
                    <button
                      type="button"
                      className="switch"
                      onClick={toggleWithdrawConfig}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={withdrawConfig?.status === 1}
                        readOnly
                        style={{ pointerEvents: 'none' }}
                      />
                      <span className="slider"></span>
                    </button>
                    <span className="status-text">
                      {withdrawConfig?.status === 1 ? 'Bật rút tiền' : 'Tắt rút tiền'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Management Section */}
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="user-stats">
              <p>Total Users: {totalUsers} | Page {currentPage} of {totalPages}</p>
            </div>
            {usersLoading ? (
              <div className="loading">Loading users...</div>
            ) : (
              <>
                <div className="table-container">
                  {pageLoading && (
                    <div className="page-loading">
                      <div className="loading-spinner"></div>
                      <span>Loading page...</span>
                    </div>
                  )}
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>USDT Balance</th>
                        <th>Dragon Balance</th>
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
                            <span className="balance-amount usdt">
                              ${user.balance?.usdt?.toFixed(2) || '0.00'}
                            </span>
                          </td>
                          <td>
                            <span className="balance-amount dragon">
                              {user.balance?.dragon?.toFixed(2) || '0.00'} 🐉
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.status === 1 ? 'active' : 'inactive'}`}>
                              {user.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && renderPagination()}
              </>
            )}
          </div>

          {/* Deposit/Withdraw History Section */}
          <div className="admin-section">
            <h2>Deposit / Withdraw History</h2>
            {txLoading ? (
              <div className="loading">Loading history...</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUserDeposit?.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{textAlign:'center', opacity:0.7}}>No data</td>
                      </tr>
                    ) : (
                      listUserDeposit.map((row, idx) => (
                        <tr key={`${row.userName}-${idx}`}>
                          <td>{row.userName}</td>
                          <td>
                            <span className={`status-badge ${row.typeBalance === 1 ? 'active' : 'inactive'}`}>
                              {row.typeBalance === 1 ? 'Deposit' : 'Withdraw'}
                            </span>
                          </td>
                          <td style={{color: row.typeBalance === 1 ? '#52c41a' : '#ff4d4f'}}>
                            {row.typeBalance === 1 ? `+${row.amount}` : `-${row.amount}`}
                          </td>
                          <td>{new Date(row.createDate).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {txTotalPages > 1 && (
                  <div className="pagination" style={{marginTop: 10}}>
                    <button className="pagination-btn" onClick={() => setTxPage(Math.max(1, txPage-1))} disabled={txPage===1}>Previous</button>
                    {Array.from({length: txTotalPages}, (_,i)=>i+1).map(p=> (
                      <button key={p} className={`pagination-btn ${p===txPage?'active':''}`} onClick={()=>setTxPage(p)}>{p}</button>
                    ))}
                    <button className="pagination-btn" onClick={() => setTxPage(Math.min(txTotalPages, txPage+1))} disabled={txPage===txTotalPages}>Next</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BAM Package Management Section */}
          <div className="admin-section">
            <h2>DRAGON Package Management</h2>
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
