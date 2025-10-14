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
  const [totalCheckedDays, setTotalCheckedDays] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load checkin status from API when modal opens
  useEffect(() => {
    if (open) {
      fetchCheckinStatus();
    } else {
      // Reset loading state when modal closes
      setIsInitialLoading(true);
    }
  }, [open, userDetails]);

  const fetchCheckinStatus = async () => {
    try {
      setIsInitialLoading(true);
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      if (!referrerId) {
        setIsInitialLoading(false);
        return;
      }

      const response = await fetch(`/api/customers/total-check-in?ref=${referrerId}`);
      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        const checkedDays = data.body?.total || 0;
        const hasCheckedToday = data.body?.checkInDay || false;
        
        setTotalCheckedDays(checkedDays);
        setHasCheckedInToday(hasCheckedToday);
        
        // Update checkin status based on server data
        const newCheckinDays = [
          { day: 1, amount: 1.5, claimed: false },
          { day: 2, amount: 1.7, claimed: false },
          { day: 3, amount: 1.9, claimed: false },
          { day: 4, amount: 2.15, claimed: false },
          { day: 5, amount: 2.45, claimed: false },
          { day: 6, amount: 2.8, claimed: false },
          { day: 7, amount: 3.5, claimed: false },
          { day: 8, amount: 5, claimed: false },
          { day: 9, amount: 8, claimed: false },
        ].map((day, index) => ({
          ...day,
          claimed: (index + 1) <= checkedDays // Day 1 = index 0, Day 2 = index 1, etc.
        }));
        setCheckinDays(newCheckinDays);
        
        // Set current day (next day to checkin)
        setCurrentDay(Math.min(checkedDays + 1, 9));
        
        console.log('Checkin status updated:', {
          totalCheckedDays: checkedDays,
          hasCheckedInToday: hasCheckedToday,
          currentDay: Math.min(checkedDays + 1, 9),
          newCheckinDays
        });
      }
    } catch (error) {
      console.error('Failed to fetch checkin status:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleCheckin = async (day: number, amount: number) => {
    // Debug information
    console.log('Checkin attempt:', {
      day,
      currentDay,
      totalCheckedDays,
      hasCheckedInToday,
      canCheckin: day === currentDay && day > totalCheckedDays && !hasCheckedInToday
    });

    // Check if this day can be checked in and user hasn't checked in today
    if (day !== currentDay || day <= totalCheckedDays || hasCheckedInToday) {
      if (hasCheckedInToday) {
        alert(`You have already checked in today (Day ${totalCheckedDays}). Please wait until tomorrow!`);
      } else if (day <= totalCheckedDays) {
        alert(`Day ${day} has already been claimed!`);
      } else if (day !== currentDay) {
        alert(`Please check in for Day ${currentDay} first!`);
      }
      return;
    }

    setLoading(true);
    try {
      const referrerId = userDetails?.referrerId || userDetails?.refererCode;
      if (!referrerId) {
        alert('User referrer ID not found');
        return;
      }

      // Convert day 1-9 to API day 3-11 (day + 2)  
      const apiDay = day + 2;
      const response = await fetch(`/api/customers/check-in?ref=${referrerId}&amount=${amount}&day=${apiDay}`);
      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        // Refresh checkin status from server
        await fetchCheckinStatus();
        
        alert(`Successfully checked in Day ${day}! Received ${amount} DRAGON!`);
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
        
        {isInitialLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading check-in status...</div>
          </div>
        ) : (
          <>
            <div className="checkin-header">
              <div className="nft-logo">
                <img src="/img/nft.png" alt="NFT Logo" />
              </div>
              
              <div className="title-row">
                <div className="calendar-icon">📅</div>
                <div className="checkin-title" style={{ fontSize: '28px', fontWeight: 'bold' }}>Daily Check-in</div>
                <div className="dragon-icon">
                  <img src="/img/dragon/special-dragon-home.png" alt="Dragon" />
                </div>
              </div>
              
              <div className="checkin-subtitle" style={{ fontSize: '18px', fontWeight: '600' }}>Check in daily to earn DRAGON rewards!</div>
            </div>
        
        <div className="checkin-grid">
          {checkinDays.map((dayReward) => (
            <div 
              key={dayReward.day}
              className={`checkin-day ${dayReward.claimed ? 'claimed' : ''} ${dayReward.day === currentDay ? 'current' : ''} ${dayReward.day < currentDay ? 'missed' : ''}`}
              onClick={() => {
                if (dayReward.day === currentDay && !dayReward.claimed && !hasCheckedInToday) {
                  handleCheckin(dayReward.day, dayReward.amount);
                }
              }}
              style={{ cursor: dayReward.day === currentDay && !dayReward.claimed && !hasCheckedInToday ? 'pointer' : 'default' }}
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
              if (currentDayData && !currentDayData.claimed && currentDay > totalCheckedDays && !hasCheckedInToday) {
                handleCheckin(currentDay, currentDayData.amount);
              }
            }}
            disabled={loading || checkinDays[currentDay - 1]?.claimed || currentDay > 9 || currentDay <= totalCheckedDays || hasCheckedInToday}
          >
            {loading ? 'Checking...' : 
             hasCheckedInToday ? 'Already checked in today' :
             currentDay <= totalCheckedDays ? 'Already claimed' : 
             `Claim Day ${currentDay}`}
          </button>
        </div>
        </>
        )}
      </div>
    </ModalCustom>
  );
}
