import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import SearchFilter from "../components/SearchFilter";
import AgencyCard from "../components/AgencyCard";
import CompanyCard from "../components/CompanyCard";
import { motion, AnimatePresence } from "framer-motion";

type Agency = {
  _id: string;
  agencyName: string;
  email: string;
  isVerified: boolean;
  logo?: string;
  userType?: string;
  verificationToken?: string;
  rcDocument?: string;
  country: string;
  city: string;
  phoneNumber: number;
  businessRegistrationNumber: string;
  industry?: string;
  companySize?: string;
  yearEstablished?: number;
  websiteUrl?: string;
  fullName: string;
  jobTitle: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  servicesOffered: Array<{ _id: string; name: string }>;
  posts: Array<{ _id: string; title: string; createdAt: string; isActive: boolean }>;
  dateCreated: string;
  signUpMethod: "local" | "google";
};

type Company = {
  id: string;
  name: string;
  industry: string;
  email: string;
  joinedDate: string;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"agencies" | "companies">(
    "companies"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(true);

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        const response = await fetch(
          "http://localhost:5000/api/companies/test"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.status}`);
        }

        const data = await response.json();

        const formattedCompanies = data.map((company: any) => ({
          id: company._id.toString(),
          name: company.name || company.companyName || "Unnamed Company",
          industry: company.industry || company.category || "Unknown Industry",
          email:
            company.email || company.contactEmail || "no-email@company.com",
          joinedDate: company.createdAt
            ? new Date(company.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));

        setCompanies(formattedCompanies);
      } catch (error: any) {
        console.error("Error fetching companies:", error.message);
        setCompanies([]);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoadingAgencies(true);
        const response = await fetch("http://localhost:5000/api/agencies/test");

        if (!response.ok) {
          throw new Error(`Failed to fetch agencies: ${response.status}`);
        }

        const data = await response.json();
        setAgencies(data);
      } catch (error: any) {
        console.error("Error fetching agencies:", error.message);
        setAgencies([]);
      } finally {
        setIsLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, []);

  const verifiedAgenciesCount = agencies.filter(
    (a) => a.isVerified
  ).length;
  const unverifiedAgenciesCount = agencies.filter(
    (a) => !a.isVerified
  ).length;
  const uniqueIndustriesCount = new Set(companies.map((c) => c.industry)).size;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/companies/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Delete failed" }));
        throw new Error(
          errorData.message || `Delete failed: ${response.status}`
        );
      }

      setCompanies(companies.filter((c) => c.id !== id));
      alert("Company deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting company:", error);
      alert(`Failed to delete company: ${error.message}`);
    }
  };

  const handleDeleteAgency = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this agency?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/agencies/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Delete failed" }));
        throw new Error(
          errorData.message || `Delete failed: ${response.status}`
        );
      }

      setAgencies(agencies.filter((a) => a._id !== id));
      alert("Agency deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting agency:", error);
      alert(`Failed to delete agency: ${error.message}`);
    }
  };

  const handleToggleVerification = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/agencies/${id}/verify`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Toggle failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      setAgencies(
        agencies.map((a) =>
          a._id === id
            ? { ...a, isVerified: data.verified }
            : a
        )
      );

      alert(data.message || "Verification status updated!");
    } catch (error: any) {
      console.error("Error toggling verification:", error);
      alert(`Failed to update verification status: ${error.message}`);
    }
  };

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agency.userType && agency.userType.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && agency.isVerified) ||
      (statusFilter === "unverified" && !agency.isVerified);
    return matchesSearch && matchesStatus;
  });

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#0a0e1a",
      padding: "32px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    wrapper: { maxWidth: "900px", margin: "0 auto" },
    tabContainer: {
      display: "flex",
      gap: "32px",
      borderBottom: "1px solid #1e293b",
      marginBottom: "24px",
    },
    tab: {
      padding: "12px 4px",
      fontSize: "14px",
      fontWeight: "500",
      background: "none",
      border: "none",
      cursor: "pointer",
      position: "relative" as const,
      transition: "all 0.2s",
    },
    tabActive: { color: "#22d3ee" },
    tabInactive: { color: "#64748b" },
    tabIndicator: {
      position: "absolute" as const,
      bottom: "-1px",
      left: 0,
      right: 0,
      height: "2px",
      background: "#22d3ee",
      borderRadius: "2px",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "64px 0",
      color: "#475569",
      fontSize: "14px",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const tabSwitchVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  if (isLoading || isLoadingCompanies || isLoadingAgencies) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardHeader />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ textAlign: "center", padding: "100px 0" }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "3px solid #1e293b",
                borderTopColor: "#22d3ee",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ color: "#94a3b8" }}>
              {isLoadingCompanies
                ? "Loading companies from backend..."
                : isLoadingAgencies
                ? "Loading agencies from backend..."
                : "Loading dashboard..."}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader
            stats={{
              totalAgencies: agencies.length,
              totalCompanies: companies.length,
              verifiedAgencies: verifiedAgenciesCount,
              unverifiedAgencies: unverifiedAgenciesCount,
              uniqueIndustries: uniqueIndustriesCount,
              agenciesGrowth: "+12.5%",
              companiesGrowth: "+4.2%",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div style={styles.tabContainer}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("agencies")}
              style={{
                ...styles.tab,
                ...(activeTab === "agencies"
                  ? styles.tabActive
                  : styles.tabInactive),
              }}
            >
              Agencies ({agencies.length})
              {activeTab === "agencies" && (
                <motion.div
                  layoutId="tabIndicator"
                  style={styles.tabIndicator}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("companies")}
              style={{
                ...styles.tab,
                ...(activeTab === "companies"
                  ? styles.tabActive
                  : styles.tabInactive),
              }}
            >
              Companies ({companies.length})
              {activeTab === "companies" && (
                <motion.div
                  layoutId="tabIndicator"
                  style={styles.tabIndicator}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            showStatusFilter={activeTab === "agencies"}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabSwitchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === "agencies" ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredAgencies.length > 0 ? (
                  <AnimatePresence>
                    {filteredAgencies.map((agency, index) => (
                      <motion.div
                        key={agency._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        custom={index}
                      >
                        <AgencyCard
                          agency={agency}
                          onDelete={handleDeleteAgency}
                          onToggleVerification={() =>
                            handleToggleVerification(agency._id)
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={styles.emptyState}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        transition: {
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        },
                      }}
                      style={{ fontSize: "40px", marginBottom: "16px" }}
                    >
                      🔍
                    </motion.div>
                    <p>No agencies found</p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "8px",
                      }}
                    >
                      Try adjusting your search or filter
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredCompanies.length > 0 ? (
                  <AnimatePresence>
                    {filteredCompanies.map((company, index) => (
                      <motion.div
                        key={company.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        custom={index}
                      >
                        <CompanyCard
                          company={company}
                          onDelete={handleDeleteCompany}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={styles.emptyState}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        transition: {
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        },
                      }}
                      style={{ fontSize: "40px", marginBottom: "16px" }}
                    >
                      🔍
                    </motion.div>
                    <p>No companies found</p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "8px",
                      }}
                    >
                      Try adjusting your search criteria
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


export default AdminDashboard;
