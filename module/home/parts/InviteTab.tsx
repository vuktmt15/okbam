import React, {useState, useEffect} from "react";
import {CopyOutlined, SearchOutlined} from "@ant-design/icons";
// import InviteTree from "./InviteTree";
import {ModalCustom} from "@components/ModalCustom";
import {useAuth} from "../../../contexts/AuthContext";

interface TeamMember {
  name: string;
  level: number;
}

interface TeamStaticsApi {
  numberOfRegistrations: Record<string, number>; // F1..F5
  levelDistribution: Record<string, number>; // F1..F5
  teamSize: Record<string, number>; // F1..F5
}

export default function InviteTab(): JSX.Element {
  const [active, setActive] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [memberTab, setMemberTab] = useState<"members" | "stats">("members");
  const [openAgency, setOpenAgency] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [staticsLoading, setStaticsLoading] = useState(false);
  const [teamStatics, setTeamStatics] = useState<TeamStaticsApi | null>(null);
  const { user, userDetails } = useAuth();
  const referralCode = userDetails?.refererCode || user?.refererCode || "";
  
  const handleCopyReferralCode = () => {
    if (referralCode) navigator.clipboard.writeText(referralCode);
    // Optional: add toast notification
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
      const response = await fetch(`http://159.223.91.231:8866/api/investment-history/team-size?referrerId=${referrerId}`);
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
    }
  }, [userDetails]);

  // Fetch team statistics from API
  const fetchTeamStatics = async () => {
    if (!userDetails?.referrerId && !userDetails?.refererCode) return;
    setStaticsLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      const res = await fetch(`http://159.223.91.231:8866/api/investment-history/team-statics?referrerId=${referrerId}`);
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

  useEffect(() => {
    if (userDetails?.referrerId || userDetails?.refererCode) {
      fetchTeamStatics();
    }
  }, [userDetails]);

  // Filter team members by level and search term
  const filteredMembers = teamMembers.filter(member => {
    const matchesLevel = member.level === active;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
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
            <span className="coin">T</span>
            <span className="amount">0 USDT</span>
          </div>
          <button className="btn-claim">Claim</button>
        </div>
        <div className="rows">
          <div className="row">
            <span className="label">Referral Code</span>
            <span className="value">{referralCode || '—'}</span>
            <button className="icon" onClick={handleCopyReferralCode}><CopyOutlined /></button>
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
                  <option value={1}>Lv1 ({teamStats.levelCounts[1] || 0})</option>
                  <option value={2}>Lv2 ({teamStats.levelCounts[2] || 0})</option>
                  <option value={3}>Lv3 ({teamStats.levelCounts[3] || 0})</option>
                  <option value={4}>Lv4 ({teamStats.levelCounts[4] || 0})</option>
                  <option value={5}>Lv5 ({teamStats.levelCounts[5] || 0})</option>
                </select>
              </div>
              <div className="search">
                <input 
                  placeholder="Search member name" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-level">Level {member.level}</div>
                    </div>
                    <div className="member-status">
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="stats">
            <div className="stat-section">
              <div className="section-title">Number Of Registrations</div>
              <div className="stat-row"><span>F1</span><b>{teamStats.regs[1] || 0}</b></div>
              <div className="stat-row"><span>F2</span><b>{teamStats.regs[2] || 0}</b></div>
              <div className="stat-row"><span>F3</span><b>{teamStats.regs[3] || 0}</b></div>
              <div className="stat-row"><span>F4</span><b>{teamStats.regs[4] || 0}</b></div>
              <div className="stat-row"><span>F5</span><b>{teamStats.regs[5] || 0}</b></div>
            </div>
            
            <div className="stat-section">
              <div className="section-title">Level Distribution</div>
              <div className="stat-row"><span>F1</span><b>{teamStats.levelCounts[1] || 0}</b></div>
              <div className="stat-row"><span>F2</span><b>{teamStats.levelCounts[2] || 0}</b></div>
              <div className="stat-row"><span>F3</span><b>{teamStats.levelCounts[3] || 0}</b></div>
              <div className="stat-row"><span>F4</span><b>{teamStats.levelCounts[4] || 0}</b></div>
              <div className="stat-row"><span>F5</span><b>{teamStats.levelCounts[5] || 0}</b></div>
            </div>
            
            <div className="stat-section">
              <div className="section-title">Team Size</div>
              <div className="stat-row"><span>F1</span><b>{teamStats.teamSize[1] || 0}</b></div>
              <div className="stat-row"><span>F2</span><b>{teamStats.teamSize[2] || 0}</b></div>
              <div className="stat-row"><span>F3</span><b>{teamStats.teamSize[3] || 0}</b></div>
              <div className="stat-row"><span>F4</span><b>{teamStats.teamSize[4] || 0}</b></div>
              <div className="stat-row"><span>F5</span><b>{teamStats.teamSize[5] || 0}</b></div>
            </div>

            {staticsLoading && <div className="loading">Loading statistics...</div>}
          </div>
        )}
      </div>

      <ModalCustom open={openAgency} onCancel={() => setOpenAgency(false)} footer={false} width="100%" style={{maxWidth: 520}} bodyStyle={{padding: 0}}>
        <div className="agency-modal">
          <div className="agency-title">Agency Rules</div>
          <div className="agency-list">
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $8 investment: reward $5</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $18 investment: reward $13</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 10 direct F1 with $42 investment: reward $25</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 7 direct F1 with $355 investment: reward $88</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 4 direct F1 with $3000 investment: reward $299</div>
              <div className="rule-badge">0/10</div>
            </div>
            <div className="rule-row">
              <div className="rule-text">Invite 1 direct F1 with $12,000 investment: reward $499</div>
              <div className="rule-badge">0/10</div>
            </div>
          </div>
          <button className="agency-close" onClick={() => setOpenAgency(false)}>Close</button>
        </div>
      </ModalCustom>
    </div>
  );
}


