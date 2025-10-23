import React, {useState, useEffect} from "react";
import {CopyOutlined, SearchOutlined} from "@ant-design/icons";
// import InviteTree from "./InviteTree";
import {ModalCustom} from "@components/ModalCustom";
import {useAuth} from "../../../contexts/AuthContext";

interface TeamMember {
  name: string;
  level: number;
  uid?: string | number; // uid can be string or number from API response
  id?: string; // Added id field from API response
  email?: string; // Added email field from API response
}

interface TeamStaticsApi {
  totalRegistrations: number;
  f1Registrations: number;
  totalSystemInvestment: number;
  totalF1Investment: number;
  totalSystemCommission: number;
  totalF1Commission: number;
  numberOfRegistrations: Record<string, number>; // F1..F5
  levelDistribution: Record<string, number>; // F1..F5
  teamSize: Record<string, number>; // F1..F5
}

interface AgencyRewardRule {
  rule: {
    requiredCount: number;
    minInvestment: number;
    rewardAmount: number;
  };
  currentCount: number;
  claimable: boolean;
}

export default function InviteTab(): JSX.Element {
  const [active, setActive] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [memberTab, setMemberTab] = useState<"members" | "stats">("members");
  const [openAgency, setOpenAgency] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [staticsLoading, setStaticsLoading] = useState(false);
  const [teamStatics, setTeamStatics] = useState<TeamStaticsApi | null>(null);
  const [showCopiedCode, setShowCopiedCode] = useState(false);
  const [showCopiedUrl, setShowCopiedUrl] = useState(false);
  const [agencyRewards, setAgencyRewards] = useState<AgencyRewardRule[]>([]);
  const [agencyLoading, setAgencyLoading] = useState(false);
  const [totalClaim, setTotalClaim] = useState<number>(0);
  const [totalClaimLoading, setTotalClaimLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<boolean>(false);
  
  // State for managing claim button disabled status
  const [dragonClaimDisabled, setDragonClaimDisabled] = useState<boolean>(false);
  const [agencyClaimDisabled, setAgencyClaimDisabled] = useState<boolean[]>([]);
  
  const { user, userDetails } = useAuth();
  const referralCode = userDetails?.refererCode || user?.refererCode || "";
  
  // Function to truncate referral code for display
  const getTruncatedReferralCode = (code: string) => {
    if (!code) return '—';
    if (code.length <= 20) return code;
    return `${code.substring(0, 17)}...`;
  };
  
  // Check if claim was disabled today and reset at midnight
  useEffect(() => {
    const checkAndResetClaimStatus = () => {
      const today = new Date().toDateString();
      const lastClaimDate = localStorage.getItem('lastDragonClaimDate');
      
      // Reset dragon claim if it's a new day (only for dragon claim)
      if (lastClaimDate !== today) {
        setDragonClaimDisabled(false);
        localStorage.removeItem('lastDragonClaimDate');
      } else {
        setDragonClaimDisabled(true);
      }
      
      // Agency claims remain permanently disabled - no reset
      const permanentAgencyClaimDisabled = JSON.parse(localStorage.getItem('permanentAgencyClaimDisabled') || '{}');
      const newAgencyDisabled = agencyRewards.map((_, index) => {
        return !!permanentAgencyClaimDisabled[index];
      });
      setAgencyClaimDisabled(newAgencyDisabled);
    };
    
    checkAndResetClaimStatus();
    
    // Set up interval to check at midnight (only affects dragon claim)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      checkAndResetClaimStatus();
      // Set up daily interval
      const intervalId = setInterval(checkAndResetClaimStatus, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msUntilMidnight);
    
    return () => clearTimeout(timeoutId);
  }, [agencyRewards]);
  
  const handleCopyReferralCode = async () => {
    const codeToCopy = userDetails?.refererCode || user?.refererCode || "";
    console.log('Copying referral code:', codeToCopy);
    
    if (codeToCopy) {
      try {
        // Check if navigator.clipboard is available
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(codeToCopy);
          setShowCopiedCode(true);
          setTimeout(() => setShowCopiedCode(false), 1000);
        } else {
          throw new Error('Clipboard API not available');
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers or when clipboard API is not available
        try {
          const textArea = document.createElement('textarea');
          textArea.value = codeToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setShowCopiedCode(true);
          setTimeout(() => setShowCopiedCode(false), 1000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
          // Last resort - show alert with text to copy manually
          alert(`Please copy this code manually: ${codeToCopy}`);
        }
      }
    } else {
      console.log('No referral code to copy');
      // Show notification anyway for testing
      setShowCopiedCode(true);
      setTimeout(() => setShowCopiedCode(false), 1000);
    }
  };

  const handleCopyReferralUrl = async () => {
    const urlToCopy = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode || '')}`;
    
    if (urlToCopy) {
      try {
        // Check if navigator.clipboard is available
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(urlToCopy);
          setShowCopiedUrl(true);
          setTimeout(() => setShowCopiedUrl(false), 1000);
        } else {
          throw new Error('Clipboard API not available');
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers or when clipboard API is not available
        try {
          const textArea = document.createElement('textarea');
          textArea.value = urlToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setShowCopiedUrl(true);
          setTimeout(() => setShowCopiedUrl(false), 1000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
          // Last resort - show alert with text to copy manually
          alert(`Please copy this URL manually: ${urlToCopy}`);
        }
      }
    }
  };

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) {
      console.error('Referrer ID not found');
      return;
    }

    setLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const response = await fetch(`/api/investment-history/team-size?referrerId=${referrerId}`);
      const data = await response.json();
      
      if (data.statusCode === 'OK' && data.body) {
        setTeamMembers(data.body);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members when component mounts
  useEffect(() => {
    if (userDetails?.referrerId || userDetails?.refererCode) {
      fetchTeamMembers();
      fetchTotalClaim();
    }
  }, [userDetails]);

  // Fetch team statistics from API
  const fetchTeamStatics = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) return;
    setStaticsLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const res = await fetch(`/api/investment-history/team-statics?referrerId=${referrerId}`);
      const data = await res.json();
      if (data?.statusCode === 'OK' && data?.body) {
        setTeamStatics(data.body as TeamStaticsApi);
      }
    } catch (e) {
      console.error('Error fetching team statics:', e);
    } finally {
      setStaticsLoading(false);
    }
  };

  // Fetch total claim amount from API
  const fetchTotalClaim = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) return;
    setTotalClaimLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const res = await fetch(`/api/investment-history/total-claim?referrerId=${referrerId}`);
      const data = await res.json();
      console.log('Total claim API response:', data);
      if (data?.statusCode === 'OK' && data?.body) {
        // Update to handle new response structure
        const amount = data.body.amount || 0;
        const status = data.body.status || false;
        console.log('Setting totalClaim:', amount, 'claimStatus:', status);
        setTotalClaim(amount);
        setClaimStatus(status);
      }
    } catch (e) {
      console.error('Error fetching total claim:', e);
    } finally {
      setTotalClaimLoading(false);
    }
  };

  // Handle claim reward
  const handleClaimReward = async (rewardIndex: number) => {
    const reward = agencyRewards[rewardIndex];
    if (!reward.claimable) return;
    
    if (agencyClaimDisabled[rewardIndex]) {
      alert('This reward has already been claimed.');
      return;
    }
    
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      if (!referrerId) {
        alert('User referrer ID not found');
        return;
      }
      
      // regisDone is 1-indexed (1 to 6) based on position in array
      const regisDone = rewardIndex + 1;
      
      console.log(`Claiming reward ${regisDone} for referrer ${referrerId}`);
      
      // Call done-regis-dragon API
      const response = await fetch(`/api/investment-history/done-regis-dragon?referrerId=${referrerId}&regisDone=${regisDone}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.statusCode === 'OK') {
        alert(`Successfully claimed reward of $${reward.rule.rewardAmount}!`);
        
        // Permanently disable this specific agency claim button
        const newAgencyDisabled = [...agencyClaimDisabled];
        newAgencyDisabled[rewardIndex] = true;
        setAgencyClaimDisabled(newAgencyDisabled);
        
        // Save permanently to localStorage (no reset)
        const permanentAgencyClaimDisabled = JSON.parse(localStorage.getItem('permanentAgencyClaimDisabled') || '{}');
        permanentAgencyClaimDisabled[rewardIndex] = true;
        localStorage.setItem('permanentAgencyClaimDisabled', JSON.stringify(permanentAgencyClaimDisabled));
        
        // Refresh data after successful claim
        await fetchAgencyRewards();
      } else {
        alert('Failed to claim reward: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward. Please try again.');
    }
  };

  // Handle claim dragon button  
  const handleClaimDragon = async () => {
    console.log('=== CLAIM BUTTON CLICKED ===');
    
    if (dragonClaimDisabled) {
      alert('You have already claimed today. Please wait until midnight to claim again.');
      return;
    }
    
    const referrerId = userDetails?.referrerId || userDetails?.refererCode;
    console.log('ReferrerId:', referrerId);
    console.log('Total Claim Amount:', totalClaim);
    
    if (!referrerId) {
      alert('ReferrerId not found');
      return;
    }
    
    if (!totalClaim || totalClaim <= 0) {
      alert('Claim amount must be greater than 0');
      return;
    }
    
    try {
      const apiUrl = `/api/investment-history/history-claim?referrerId=${referrerId}&amount=${totalClaim}`;
      console.log('Calling API:', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.statusCode === 'OK') {
        alert(`Successfully claimed ${totalClaim} DRAGON!`);
        
        // Disable the button and save to localStorage
        setDragonClaimDisabled(true);
        const today = new Date().toDateString();
        localStorage.setItem('lastDragonClaimDate', today);
        
        // Disable nút bằng cách set claimStatus = false
        setClaimStatus(false);
        // Refresh data
        await fetchTotalClaim();
      } else {
        alert('Failed to claim dragon reward: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error claiming:', error);
      alert('Error claiming. Please try again.');
    }
  };

  // Fetch agency rewards from API
  const fetchAgencyRewards = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) return;
    setAgencyLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const res = await fetch(`/api/investment-history/check-regis-dragon?referrerId=${referrerId}`);
      const data = await res.json();
      if (data?.statusCode === 'OK' && data?.body && Array.isArray(data.body)) {
        setAgencyRewards(data.body as AgencyRewardRule[]);
      }
    } catch (e) {
      console.error('Error fetching agency rewards:', e);
    } finally {
      setAgencyLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.referrerId || userDetails?.refererCode) {
      fetchTeamStatics();
    }
  }, [userDetails]);

  // Fetch team statistics when switching to stats tab
  useEffect(() => {
    if (memberTab === 'stats' && (userDetails?.referrerId || userDetails?.refererCode)) {
      fetchTeamStatics();
    }
  }, [memberTab, userDetails]);

  // Fetch agency rewards when modal opens
  useEffect(() => {
    if (openAgency && (userDetails?.referrerId || userDetails?.refererCode)) {
      fetchAgencyRewards();
    }
  }, [openAgency, userDetails]);

  // Filter team members by level and search term
  const filteredMembers = teamMembers.filter(member => {
    const matchesLevel = member.level === active;
    const searchTermSafe = searchTerm || '';
    const uidString = member.uid ? String(member.uid).toLowerCase() : '';
    const matchesSearch = uidString.includes(searchTermSafe.toLowerCase()) || false;
    return matchesLevel && matchesSearch;
  });

  // Get team statistics
  const getTeamStats = () => {
    if (teamStatics) {
      const levelCounts: {[key: number]: number} = {
        1: teamStatics.levelDistribution?.F1 || 0,
        2: teamStatics.levelDistribution?.F2 || 0,
        3: teamStatics.levelDistribution?.F3 || 0,
        4: teamStatics.levelDistribution?.F4 || 0,
        5: teamStatics.levelDistribution?.F5 || 0,
      };
      const regs: {[key: number]: number} = {
        1: teamStatics.numberOfRegistrations?.F1 || 0,
        2: teamStatics.numberOfRegistrations?.F2 || 0,
        3: teamStatics.numberOfRegistrations?.F3 || 0,
        4: teamStatics.numberOfRegistrations?.F4 || 0,
        5: teamStatics.numberOfRegistrations?.F5 || 0,
      };
      const teamSize: {[key: number]: number} = {
        1: teamStatics.teamSize?.F1 || 0,
        2: teamStatics.teamSize?.F2 || 0,
        3: teamStatics.teamSize?.F3 || 0,
        4: teamStatics.teamSize?.F4 || 0,
        5: teamStatics.teamSize?.F5 || 0,
      };
      const totalMembers = Object.values(levelCounts).reduce((a, b) => a + b, 0);
      return { totalMembers, levelCounts, regs, teamSize };
    }
    // fallback từ danh sách members nếu chưa có statics
    const totalMembers = teamMembers.length;
    const levelCounts = teamMembers.reduce((acc, member) => {
      acc[member.level] = (acc[member.level] || 0) + 1;
      return acc;
    }, {} as {[key: number]: number});
    return { totalMembers, levelCounts, regs: levelCounts, teamSize: {1:0,2:0,3:0,4:0,5:0} };
  };

  const teamStats = getTeamStats();
  const commission = [
    {level: "F1", rate: "25%"},
    {level: "F2", rate: "5%"},
    {level: "F3", rate: "5%"},
    {level: "F4", rate: "5%"},
    {level: "F5", rate: "5%"},
  ];
  return (
    <div className="okbam-invite">
      <div className="invite-hero">
        <div className="title-row">
          <div className="title">My Team</div>
        </div>
        <div className="subtitle">
          <span className="group-icon">👥</span>
          Team Commission Rewards
        </div>
        <div className="reward-row">
          <div className="reward-badge">
            <span className="amount">
              {totalClaimLoading ? 'Loading...' : (
                <>
                  <img src="/img/dragon/special-dragon-home.png" alt="dragon egg" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle', display: 'inline-block'}} />
                  {totalClaim} DRAGON
                </>
              )}
            </span>
          </div>
          <button 
            className="btn-claim"
            onClick={handleClaimDragon}
            disabled={!claimStatus || dragonClaimDisabled}
            style={{
              background: (claimStatus && !dragonClaimDisabled) ? '#a56a46' : '#666',
              color: (claimStatus && !dragonClaimDisabled) ? '#fff' : '#999',
              cursor: (claimStatus && !dragonClaimDisabled) ? 'pointer' : 'not-allowed',
              opacity: (claimStatus && !dragonClaimDisabled) ? 1 : 0.6,
              border: 'none',
              borderRadius: '10px',
              padding: '6px 10px',
              marginTop: '2px'
            }}
          >
            {dragonClaimDisabled ? 'Claimed Today' : 'Claim'}
          </button>
        </div>
        <div className="rows">
          <div className="row">
            <span className="label">Referral Code</span>
            <span className="url">{getTruncatedReferralCode(referralCode)}</span>
            <button className="icon" onClick={handleCopyReferralCode}>
              <CopyOutlined />
              {showCopiedCode && <span className="copied-notification">Copied</span>}
            </button>
          </div>
          <div className="row">
            <span className="label">Referral URL</span>
            <span className="url">{`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${encodeURIComponent(referralCode || '')}`}</span>
            <button className="icon" onClick={handleCopyReferralUrl}>
              <CopyOutlined />
              {showCopiedUrl && <span className="copied-notification">Copied</span>}
            </button>
          </div>
        </div>
      </div>

      {/* <InviteTree /> */}

      <div className="commission-card">
        <div className="commission-title-row">
          <div className="commission-title">Agency Commission</div>
          <button className="commission-detail" onClick={() => setOpenAgency(true)}>Detail &gt;</button>
        </div>
        <div className="commission-grid header">
          <div>Level</div>
          <div>Commission</div>
        </div>
        {commission.map((row) => (
          <div key={row.level} className="commission-grid">
            <div>{row.level}</div>
            <div>{row.rate}</div>
          </div>
        ))}
      </div>

      <div className="member-box">
        <div className="member-switch">
          <button
            className={`switch ${memberTab === "members" ? "active" : ""}`}
            onClick={() => setMemberTab("members")}
          >
            Team Members
          </button>
          <button
            className={`switch ${memberTab === "stats" ? "active" : ""}`}
            onClick={() => setMemberTab("stats")}
          >
            Team Statistics
          </button>
        </div>

        {memberTab === "members" ? (
          <>
            <div className="filters">
              <div className="level-select">
                <select
                  value={active}
                  onChange={(e) => setActive(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                >
                  {/* <option value={1}>Lv1 ({teamStats.levelCounts[1] || 0})</option>
                  <option value={2}>Lv2 ({teamStats.levelCounts[2] || 0})</option>
                  <option value={3}>Lv3 ({teamStats.levelCounts[3] || 0})</option>
                  <option value={4}>Lv4 ({teamStats.levelCounts[4] || 0})</option>
                  <option value={5}>Lv5 ({teamStats.levelCounts[5] || 0})</option> */}
                  <option value={1}>Lv1</option>
                  <option value={2}>Lv2</option>
                  <option value={3}>Lv3</option>
                  <option value={4}>Lv4</option>
                  <option value={5}>Lv5</option>
                </select>
              </div>
              <div className="search">
                <input 
                  placeholder="Search member UID" 
                  value={searchTerm || ""}
                  onChange={(e) => setSearchTerm(e.target.value || "")}
                />
                <button><SearchOutlined /></button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading team members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="empty">
                {searchTerm ? 'No members found matching your search' : `No team members at level ${active} yet`}
              </div>
            ) : (
              <div className="members-list">
                {filteredMembers.map((member, index) => (
                  <div key={index} className="member-item">
                    <div className="member-id">{member.uid || 'N/A'}</div>
                    <div className="member-level">Level {member.level}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="stats">
            <div className="stats-summary">
              <div className="summary-row">
                <div className="summary-item">
                  <div className="summary-label">Total Registrations</div>
                  <div className="summary-value">{teamStatics?.totalRegistrations || 0}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">F1</div>
                  <div className="summary-value">{teamStatics?.f1Registrations || 0}</div>
                </div>
              </div>
              
              <div className="summary-row">
                <div className="summary-item">
                  <div className="summary-label">Total System</div>
                  <div className="summary-value">{teamStatics?.totalSystemInvestment || 0} USDT</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">F1 Quantity</div>
                  <div className="summary-value">{teamStatics?.totalF1Investment || 0} USDT</div>
                </div>
              </div>
              
              <div className="summary-row">
                <div className="summary-item">
                  <div className="summary-label">Total System Commission</div>
                  <div className="summary-value">{teamStatics?.totalSystemCommission || 0} DRAGON</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">F1 Commission</div>
                  <div className="summary-value">{teamStatics?.totalF1Commission || 0} DRAGON</div>
                </div>
              </div>
            </div>

            {staticsLoading && <div className="loading">Loading statistics...</div>}
          </div>
        )}
      </div>

      <ModalCustom open={openAgency} onCancel={() => setOpenAgency(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0}}>
        <div className="agency-modal">
          <div className="agency-title">Agency Reward Rules</div>
          <div className="agency-list">
            {agencyLoading ? (
              <div className="loading">Loading agency rewards...</div>
            ) : (
              agencyRewards.map((reward, index) => (
                <div key={index} className="rule-row">
                  <div className="rule-text">
                    Invite {reward.rule.requiredCount} direct F1 with ${reward.rule.minInvestment} investment
                    <div className="rule-sub">Reward ${reward.rule.rewardAmount}</div>
                  </div>
                  <div className={`rule-badge ${reward.claimable ? 'success' : 'danger'}`}>
                    {reward.currentCount}/{reward.rule.requiredCount}
                  </div>
                  <button 
                    className={`rule-claim ${(reward.claimable && !agencyClaimDisabled[index]) ? 'success' : 'disabled'}`}
                    disabled={!reward.claimable || agencyClaimDisabled[index]}
                    onClick={() => handleClaimReward(index)}
                  >
                    {agencyClaimDisabled[index] ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              ))
            )}
          </div>
          <button className="agency-close" onClick={() => setOpenAgency(false)}>Close</button>
        </div>
      </ModalCustom>
    </div>
  );
}


