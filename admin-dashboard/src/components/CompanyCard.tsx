import { Trash2, CheckCircle } from 'lucide-react';

interface Company {
  _id: string;
  name: string;
  email: string;
  industrySector?: string;
  createdAt?: string;
  daysLeftInSubscription?: number;
}

interface CompanyCardProps {
  company: Company;
  mode: 'request' | 'account';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const CompanyCard = ({ company, mode, onAccept, onReject }: CompanyCardProps) => {
  const styles = {
    card: {
      background: '#151d2e',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      transition: 'border 0.2s'
    },
    cardContent: { flex: 1 },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    cardTitle: { fontSize: '16px', fontWeight: '600', color: '#ffffff' },
    badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' },
    email: { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' },
    meta: { fontSize: '12px', color: '#64748b', marginTop: '6px' },
    deleteBtn: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      marginLeft: '16px'
    },
    acceptBtn: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 14px',
      color: '#10b981',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'background 0.2s',
    }
  };

  const industryColors: Record<string, { bg: string; color: string }> = {
    'Technology': { bg: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' },
    'Energy': { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
    'Fashion': { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' },
    'Food & Beverage': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    'Automotive': { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
  };

  const industry = company.industrySector || 'Unknown';
  const color = industryColors[industry] || { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{company.name}</h3>
          <span style={{ ...styles.badge, background: color.bg, color: color.color }}>
            {industry}
          </span>
        </div>
        <p style={styles.email}>{company.email}</p>
        {mode === 'account' && (
          <div style={styles.meta}>
            Subscription: {typeof company.daysLeftInSubscription === 'number' ? `${company.daysLeftInSubscription} day(s) left` : 'N/A'}
          </div>
        )}
      </div>
      {mode === 'request' && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => onAccept?.(company._id)}
            style={styles.acceptBtn}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)')}
          >
            <CheckCircle size={16} /> Accept
          </button>
          <button
            onClick={() => onReject?.(company._id)}
            style={styles.deleteBtn}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;