import React from 'react';
import { Users, Building2, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type DashboardHeaderProps = {
  stats?: {
    totalAgencies: number;
    totalCompanies: number;
    verifiedAgencies: number;
    unverifiedAgencies: number;
    uniqueIndustries?: number;
    agenciesGrowth?: string;
    companiesGrowth?: string;
  };
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ stats }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const defaultStats = {
    totalAgencies: 0,
    totalCompanies: 0,
    verifiedAgencies: 0,
    unverifiedAgencies: 0,
    uniqueIndustries: 0,
  };

  const displayStats = stats || defaultStats;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #1a2332 0%, #0f1824 100%)',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '8px'
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '24px'
    },
    statsContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap' as const,
      marginTop: '20px'
    },
    statCard: {
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(100, 116, 139, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      minWidth: '180px',
      flex: 1,
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px'
    },
    statIcon: {
      background: 'rgba(34, 211, 238, 0.1)',
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statTitle: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '500'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '4px'
    },
    statChange: {
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    statChangePositive: {
      color: '#10b981'
    },
    verifiedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      marginTop: '4px'
    },
    unverifiedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(251, 191, 36, 0.1)',
      color: '#fbbf24',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      marginTop: '4px'
    }
  };

  return (
    <div style={styles.header}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
          <p style={styles.headerSubtitle}>Manage agencies and companies accounts</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div style={styles.statsContainer}>
        {/* Total Agencies Card */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>
              <Building2 size={20} color="#22d3ee" />
            </div>
            <div style={styles.statTitle}>Total Agencies</div>
          </div>
          <div style={styles.statValue}>{displayStats.totalAgencies}</div>
          <div style={{ ...styles.statChange, ...styles.statChangePositive }}>            
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <span style={styles.verifiedBadge}>
              <CheckCircle size={12} />
              {displayStats.verifiedAgencies} verified
            </span>
            <span style={styles.unverifiedBadge}>
              <XCircle size={12} />
              {displayStats.unverifiedAgencies} pending
            </span>
          </div>
        </div>

        {/* Total Companies Card */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, background: 'rgba(168, 85, 247, 0.1)' }}>
              <Users size={20} color="#a855f7" />
            </div>
            <div style={styles.statTitle}>Total Companies</div>
          </div>
          <div style={styles.statValue}>{displayStats.totalCompanies}</div>
          <div style={{ ...styles.statChange, ...styles.statChangePositive }}>            
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
            Across {displayStats.uniqueIndustries} industries
          </div>
        </div>

        {/* Verification Rate Card */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div style={styles.statTitle}>Verification Rate</div>
          </div>
          <div style={styles.statValue}>
            {displayStats.totalAgencies > 0 
              ? ((displayStats.verifiedAgencies / displayStats.totalAgencies) * 100).toFixed(1)
              : '0.0'
            }%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            {displayStats.verifiedAgencies} of {displayStats.totalAgencies} agencies verified
          </div>
          <div style={{ 
            height: '4px', 
            background: '#1e293b', 
            borderRadius: '2px', 
            marginTop: '12px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: displayStats.totalAgencies > 0 
                ? `${(displayStats.verifiedAgencies / displayStats.totalAgencies) * 100}%` 
                : '0%', 
              height: '100%', 
              background: 'linear-gradient(90deg, #10b981, #22d3ee)',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;