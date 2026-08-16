import { FaUserFriends, FaBriefcase, FaRegClock, FaShieldAlt } from "react-icons/fa";

const dashboardStats = [
  {
    id: 1,
    title: "Total Candidates",
    value: "2,400",
    trend: "+ 5.78%",
    isPositive: true,
    icon: <FaUserFriends />,
    bg: "#EFF6FF",
    color: "#3B82F6"
  },
  {
    id: 2,
    title: "Job Applicants",
    value: "1,200",
    trend: "+ 2.11%",
    isPositive: true,
    icon: <FaBriefcase />,
    bg: "#ECFDF5",
    color: "#10B981"
  },
  {
    id: 3,
    title: "Pending Review",
    value: "800",
    trend: "- 4.12%",
    isPositive: false,
    icon: <FaRegClock />,
    bg: "#FFFBEB",
    color: "#F59E0B"
  },
  {
    id: 4,
    title: "Rejected Candidates",
    value: "400",
    trend: "- 3.52%",
    isPositive: false,
    icon: <FaShieldAlt />,
    bg: "#FEF2F2",
    color: "#EF4444"
  }
];

export default dashboardStats;