import { Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Agency {
  _id: string;
  agencyName: string;
  email: string;
  isVerified: boolean;
  logo?: string;
  userType?: string;
  verificationToken?: string;
}

interface AgencyCardProps {
  agency: Agency;
  onDelete: (id: string) => void;
  onToggleVerification: () => void;
}

const AgencyCard = ({ agency, onDelete, onToggleVerification }: AgencyCardProps) => {
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
    badge: { 
      padding: '4px 10px', 
      borderRadius: '6px', 
      fontSize: '12px', 
      fontWeight: '500',
      background: agency.isVerified 
        ? 'rgba(16, 185, 129, 0.1)' 
        : 'rgba(251, 191, 36, 0.1)',
      color: agency.isVerified ? '#10b981' : '#fbbf24'
    },
    email: { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' },
    verifyBtn: {
      background: agency.isVerified
        ? 'rgba(16, 185, 129, 0.15)'
        : 'rgba(251, 191, 36, 0.15)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 14px',
      color: agency.isVerified ? '#10b981' : '#fbbf24',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'background 0.2s',
      marginRight: '8px'
    },
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
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{agency.agencyName}</h3>
          <span style={styles.badge}>
            {agency.isVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
        <p style={styles.email}>{agency.email}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onToggleVerification}
          style={styles.verifyBtn}
          onMouseOver={(e) => {
            e.currentTarget.style.background = agency.isVerified
              ? 'rgba(16, 185, 129, 0.25)'
              : 'rgba(251, 191, 36, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = agency.isVerified
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(251, 191, 36, 0.15)';
          }}
        >
          {agency.isVerified ? <><XCircle size={16} /> Unverify</> : <><CheckCircle size={16} /> Verify</>}
        </button>
        <button
          onClick={() => onDelete(agency._id)}
          style={styles.deleteBtn}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default AgencyCard;