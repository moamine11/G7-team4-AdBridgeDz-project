import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (filter: string) => void;
  showStatusFilter?: boolean;
}

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  showStatusFilter = false,
}: SearchFilterProps) => {
  const styles = {
    searchContainer: {
      position: 'relative' as const,
      marginBottom: '16px'
    },
    searchInput: {
      width: '100%',
      background: '#151d2e',
      border: '1px solid #1e293b',
      borderRadius: '8px',
      padding: '12px 12px 12px 40px',
      fontSize: '14px',
      color: '#cbd5e1',
      outline: 'none' as const
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#475569'
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    filterSelect: {
      background: '#151d2e',
      border: '1px solid #1e293b',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13px',
      color: '#cbd5e1',
      cursor: 'pointer',
      outline: 'none' as const
    },
  };

  return (
    <>
      <div style={styles.searchContainer}>
        <Search style={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {showStatusFilter && onStatusFilterChange && (
        <div style={styles.filterContainer}>
          <Filter size={16} color="#475569" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      )}
    </>
  );
};

export default SearchFilter;