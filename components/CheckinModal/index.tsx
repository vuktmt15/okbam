import React, { useState, useEffect } from 'react';
import { ModalCustom } from '@components/ModalCustom';
import { useAuth } from '../../contexts/AuthContext';

interface CheckinModalProps {
  open: boolean;
  onCancel: () => void;
}

interface DayReward {
  day: number;
  amount: number;
  claimed: boolean;
}

export default function CheckinModal({ open, onCancel }: CheckinModalProps): JSX.Element {
  const { userDetails } = useAuth();
  const [checkinDays, setCheckinDays] = useState<DayReward[]>([
    { day: 1, amount: 1.5, claimed: false },
    { day: 2, amount: 1.7, claimed: false },
    { day: 3, amount: 1.9, claimed: false },
    { day: 4, amount: 2.15, claimed: false },
    { day: 5, amount: 2.45, claimed: false },
    { day: 6, amount: 2.8, claimed: false },
    { day: 7, amount: 3.5, claimed: false },
    { day: 8, amount: 5, claimed: false },
    { day: 9, amount: 8, claimed: false },
  ]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(null);

  // Load checkin status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCheckinData = localStorage.getItem('checkinData');
      const savedLastCheckinDate = localStorage.getItem('lastCheckinDate');
      
      if (savedCheckinData) {
        const data = JSON.parse(savedCheckinData);
        setCheckinDays(data.checkinDays || checkinDays);
        setCurrentDay(data.currentDay || 1);
      }
      
      if (savedLastCheckinDate) {
        setLastCheckinDate(savedLastCheckinDate);
        
        // Check if it's a new day
        const today = new Date().toDateString();
        if (savedLastCheckinDate !== today) {
          // New day, user can checkin the next day
          // Don't automatically advance currentDay here, let them checkin manually
        }
      }
    }
  }, []);

  // Save checkin data to localStorage
  const saveCheckinData = (newCurrentDay?: number) => {
    if (typeof window !== 'undefined') {
      const data = { 
        checkinDays, 
        currentDay: newCurrentDay !== undefined ? newCurrentDay : currentDay 
      };
      localStorage.setItem('checkinData', JSON.stringify(data));
    }
  };

  // Check if user can checkin today
  const canCheckinToday = () => {
    const today = new Date().toDateString();
    return lastCheckinDate !== today;
  };

  const handleCheckin = async (day: number, amount: number) => {
    // Check if it's the correct day and user hasn't already checked in today
    if (day !== currentDay || checkinDays[day - 1].claimed || !canCheckinToday()) {
      return;
    }

    setLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      if (!referrerId) {
        alert('User referrer ID not found');
        return;
      }

      const response = await fetch(`/api/customers/check-in?ref=${referrerId}&amount=${amount}`);
      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        // Mark current day as claimed
        const newCheckinDays = [...checkinDays];
        newCheckinDays[day - 1].claimed = true;
        setCheckinDays(newCheckinDays);

        // Save today's checkin date
        const today = new Date().toDateString();
        setLastCheckinDate(today);
        localStorage.setItem('lastCheckinDate', today);

        // Move to next day if not the last day
        const newCurrentDay = currentDay < 9 ? currentDay + 1 : currentDay;
        if (currentDay < 9) {
          setCurrentDay(newCurrentDay);
        }

        // Save updated data
        saveCheckinData(newCurrentDay);
        alert(`Successfully checked in! Received ${amount} DRAGON!`);
      } else {
        alert('Check-in failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom 
      open={open} 
      onCancel={onCancel} 
      footer={false} 
      width="100%" 
      style={{ maxWidth: 520 }} 
      bodyStyle={{ padding: 0 }}
    >
      <div className="checkin-modal">
        <button className="close-btn" onClick={onCancel}>×</button>
        
        <div className="checkin-header">
          <div className="nft-logo">
            <img src="/img/nft.png" alt="NFT Logo" />
          </div>
          
          <div className="title-row">
            <div className="calendar-icon">📅</div>
            <div className="checkin-title">Daily Check-in</div>
            <div className="dragon-icon">
              <img src="/img/dragon/special-dragon-home.png" alt="Dragon" />
            </div>
          </div>
          
          <div className="checkin-subtitle">Check in daily to earn DRAGON rewards!</div>
        </div>
        
        <div className="checkin-grid">
          {checkinDays.map((dayReward) => (
            <div 
              key={dayReward.day}
              className={`checkin-day ${dayReward.claimed ? 'claimed' : ''} ${dayReward.day === currentDay ? 'current' : ''} ${dayReward.day < currentDay ? 'missed' : ''}`}
            >
              <div className="day-number">Day {dayReward.day}</div>
              
              <div className="reward-section">
                <span className="reward-amount">{dayReward.amount}</span>
                <img src="/img/dragon/special-dragon-home.png" alt="Dragon" className="reward-dragon" />
              </div>
              
              {dayReward.claimed && (
                <div className="claimed-overlay">
                  <div className="check-mark">✓</div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="checkin-actions">
          <button 
            className="claim-btn"
            onClick={() => {
              const currentDayData = checkinDays[currentDay - 1];
              if (currentDayData && !currentDayData.claimed && canCheckinToday()) {
                handleCheckin(currentDay, currentDayData.amount);
              }
            }}
            disabled={loading || checkinDays[currentDay - 1]?.claimed || currentDay > 9 || !canCheckinToday()}
          >
            {loading ? 'Checking...' : 
             !canCheckinToday() ? 'Already checked in today' : 
             `Claim Day ${currentDay}`}
          </button>
        </div>
      </div>
    </ModalCustom>
  );
}
