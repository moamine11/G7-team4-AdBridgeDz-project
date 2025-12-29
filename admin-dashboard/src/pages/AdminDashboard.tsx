import React, { useEffect, useMemo, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import AgencyCard from "../components/AgencyCard";
import CompanyCard from "../components/CompanyCard";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";

type Agency = {
  _id: string;
  agencyName: string;
  email: string;
  isVerified: boolean;
  daysLeftInSubscription?: number;
};

type Company = {
  _id: string;
  name: string;
  email: string;
  industrySector?: string;
  daysLeftInSubscription?: number;
};

type TopAgency = Agency & { bookingCount: number };
type TopCompany = Company & { bookingCount: number };

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#0a0e1a",
    padding: "32px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  wrapper: { maxWidth: "900px", margin: "0 auto" },
  tabContainer: {
    display: "flex",
    gap: "18px",
    borderBottom: "1px solid #1e293b",
    marginBottom: "16px",
  },
  tab: {
    padding: "10px 4px",
    fontSize: "14px",
    fontWeight: 600,
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  tabActive: { color: "#22d3ee" },
  tabInactive: { color: "#64748b" },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "14px",
    marginTop: "30px",
  },
  emptyState: {
    color: "#94a3b8",
    fontSize: "14px",
    padding: "18px 0",
  },
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

function AdminDashboard() {
  const [signupTab, setSignupTab] = useState<"companies" | "agencies">("companies");
  const [accountsTab, setAccountsTab] = useState<"companies" | "agencies">("companies");

  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [pendingAgencies, setPendingAgencies] = useState<Agency[]>([]);
  const [accountsCompanies, setAccountsCompanies] = useState<Company[]>([]);
  const [accountsAgencies, setAccountsAgencies] = useState<Agency[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [topAgencies, setTopAgencies] = useState<TopAgency[]>([]);

  const [loading, setLoading] = useState({
    pendingCompanies: true,
    pendingAgencies: true,
    accountsCompanies: true,
    accountsAgencies: true,
    topCompanies: true,
    topAgencies: true,
  });

  const uniqueIndustriesCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of [...pendingCompanies, ...accountsCompanies]) {
      if (c.industrySector) set.add(c.industrySector);
    }
    return set.size;
  }, [pendingCompanies, accountsCompanies]);

  const verifiedAgenciesCount = useMemo(
    () => accountsAgencies.filter((a) => a.isVerified).length,
    [accountsAgencies]
  );

  const unverifiedAgenciesCount = useMemo(
    () => pendingAgencies.length,
    [pendingAgencies]
  );

  const refreshPendingCompanies = async () => {
    setLoading((s) => ({ ...s, pendingCompanies: true }));
    try {
      const data = await fetchJson<Company[]>(`${API_BASE_URL}/admin/companies/pending`);
      setPendingCompanies(data);
    } catch (e) {
      console.error(e);
      setPendingCompanies([]);
    } finally {
      setLoading((s) => ({ ...s, pendingCompanies: false }));
    }
  };

  const refreshPendingAgencies = async () => {
    setLoading((s) => ({ ...s, pendingAgencies: true }));
    try {
      const data = await fetchJson<Agency[]>(`${API_BASE_URL}/admin/agencies/pending`);
      setPendingAgencies(data);
    } catch (e) {
      console.error(e);
      setPendingAgencies([]);
    } finally {
      setLoading((s) => ({ ...s, pendingAgencies: false }));
    }
  };

  const refreshAccountsCompanies = async () => {
    setLoading((s) => ({ ...s, accountsCompanies: true }));
    try {
      const data = await fetchJson<Company[]>(`${API_BASE_URL}/admin/companies/verified`);
      setAccountsCompanies(data);
    } catch (e) {
      console.error(e);
      setAccountsCompanies([]);
    } finally {
      setLoading((s) => ({ ...s, accountsCompanies: false }));
    }
  };

  const refreshAccountsAgencies = async () => {
    setLoading((s) => ({ ...s, accountsAgencies: true }));
    try {
      const data = await fetchJson<Agency[]>(`${API_BASE_URL}/admin/agencies/verified`);
      setAccountsAgencies(data);
    } catch (e) {
      console.error(e);
      setAccountsAgencies([]);
    } finally {
      setLoading((s) => ({ ...s, accountsAgencies: false }));
    }
  };

  const refreshTopCompanies = async () => {
    setLoading((s) => ({ ...s, topCompanies: true }));
    try {
      const data = await fetchJson<TopCompany[]>(`${API_BASE_URL}/admin/companies/top-by-bookings?limit=5`);
      setTopCompanies(data);
    } catch (e) {
      console.error(e);
      setTopCompanies([]);
    } finally {
      setLoading((s) => ({ ...s, topCompanies: false }));
    }
  };

  const refreshTopAgencies = async () => {
    setLoading((s) => ({ ...s, topAgencies: true }));
    try {
      const data = await fetchJson<TopAgency[]>(`${API_BASE_URL}/admin/agencies/top-by-bookings?limit=5`);
      setTopAgencies(data);
    } catch (e) {
      console.error(e);
      setTopAgencies([]);
    } finally {
      setLoading((s) => ({ ...s, topAgencies: false }));
    }
  };

  useEffect(() => {
    void refreshPendingCompanies();
    void refreshPendingAgencies();
    void refreshAccountsCompanies();
    void refreshAccountsAgencies();
    void refreshTopCompanies();
    void refreshTopAgencies();
  }, []);

  const acceptCompany = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/companies/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      await Promise.all([refreshPendingCompanies(), refreshAccountsCompanies()]);
    }
  };

  const rejectCompany = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/companies/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    } finally {
      await Promise.all([refreshPendingCompanies(), refreshAccountsCompanies()]);
    }
  };

  const acceptAgency = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/agencies/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      await Promise.all([refreshPendingAgencies(), refreshAccountsAgencies()]);
    }
  };

  const rejectAgency = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/agencies/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    } finally {
      await Promise.all([refreshPendingAgencies(), refreshAccountsAgencies()]);
    }
  };

  const renderSignupRequests = () => {
    if (signupTab === "companies") {
      if (loading.pendingCompanies) return <div style={styles.emptyState}>Loading…</div>;
      if (pendingCompanies.length === 0) return <div style={styles.emptyState}>No company signup requests</div>;
      return pendingCompanies.map((c) => (
        <CompanyCard key={c._id} company={c} mode="request" onAccept={acceptCompany} onReject={rejectCompany} />
      ));
    }

    if (loading.pendingAgencies) return <div style={styles.emptyState}>Loading…</div>;
    if (pendingAgencies.length === 0) return <div style={styles.emptyState}>No agency signup requests</div>;
    return pendingAgencies.map((a) => (
      <AgencyCard key={a._id} agency={a} mode="request" onAccept={acceptAgency} onReject={rejectAgency} />
    ));
  };

  const renderAccounts = () => {
    if (accountsTab === "companies") {
      if (loading.accountsCompanies) return <div style={styles.emptyState}>Loading…</div>;
      if (accountsCompanies.length === 0) return <div style={styles.emptyState}>No companies found</div>;
      return accountsCompanies.map((c) => <CompanyCard key={c._id} company={c} mode="account" />);
    }

    if (loading.accountsAgencies) return <div style={styles.emptyState}>Loading…</div>;
    if (accountsAgencies.length === 0) return <div style={styles.emptyState}>No agencies found</div>;
    return accountsAgencies.map((a) => <AgencyCard key={a._id} agency={a} mode="account" />);
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <DashboardHeader
            stats={{
              totalAgencies: pendingAgencies.length + accountsAgencies.length,
              totalCompanies: pendingCompanies.length + accountsCompanies.length,
              verifiedAgencies: verifiedAgenciesCount,
              unverifiedAgencies: unverifiedAgenciesCount,
              uniqueIndustries: uniqueIndustriesCount,
            }}
          />
        </motion.div>

        <h2 style={{ ...styles.sectionTitle, marginTop: 0 }}>New signup requests</h2>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setSignupTab("companies")}
            style={{
              ...styles.tab,
              ...(signupTab === "companies" ? styles.tabActive : styles.tabInactive),
            }}
          >
            Companies ({pendingCompanies.length})
          </button>
          <button
            onClick={() => setSignupTab("agencies")}
            style={{
              ...styles.tab,
              ...(signupTab === "agencies" ? styles.tabActive : styles.tabInactive),
            }}
          >
            Agencies ({pendingAgencies.length})
          </button>
        </div>
        <div>{renderSignupRequests()}</div>

        <h2 style={styles.sectionTitle}>All accounts</h2>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setAccountsTab("companies")}
            style={{
              ...styles.tab,
              ...(accountsTab === "companies" ? styles.tabActive : styles.tabInactive),
            }}
          >
            Companies ({accountsCompanies.length})
          </button>
          <button
            onClick={() => setAccountsTab("agencies")}
            style={{
              ...styles.tab,
              ...(accountsTab === "agencies" ? styles.tabActive : styles.tabInactive),
            }}
          >
            Agencies ({accountsAgencies.length})
          </button>
        </div>
        <div>{renderAccounts()}</div>

        <h2 style={styles.sectionTitle}>Top 5 Companies</h2>
        {loading.topCompanies ? (
          <div style={styles.emptyState}>Loading…</div>
        ) : topCompanies.length === 0 ? (
          <div style={styles.emptyState}>No top companies found</div>
        ) : (
          topCompanies.map((c, index) => (
            <div
              key={c._id}
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "12px",
                border: "1px solid #334155",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: 700 }}>
                    #{index + 1} {c.name}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>{c.email}</div>
                </div>
                <div style={{ color: "#22d3ee", fontWeight: 800 }}>{c.bookingCount}</div>
              </div>
            </div>
          ))
        )}

        <h2 style={styles.sectionTitle}>Top 5 Agencies</h2>
        {loading.topAgencies ? (
          <div style={styles.emptyState}>Loading…</div>
        ) : topAgencies.length === 0 ? (
          <div style={styles.emptyState}>No top agencies found</div>
        ) : (
          topAgencies.map((a, index) => (
            <div
              key={a._id}
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "12px",
                border: "1px solid #334155",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: 700 }}>
                    #{index + 1} {a.agencyName}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>{a.email}</div>
                </div>
                <div style={{ color: "#22d3ee", fontWeight: 800 }}>{a.bookingCount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;