import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { TrendingUp, Users, Code, Shield, Activity, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUsers';
import { cn } from '@/utils/cn';
const StatsCard = ({ title, value, icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: title }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: value }), trend && (_jsxs("p", { className: "text-sm text-green-600 mt-1 flex items-center", children: [_jsx(TrendingUp, { className: "h-4 w-4 mr-1" }), trend] }))] }), _jsx("div", { className: cn("p-3 rounded-lg bg-gradient-to-r text-white", colorClasses[color]), children: icon })] }) }));
};
const ActivityFeed = () => {
    const activities = [
        {
            id: 1,
            action: 'Deployed new feature',
            time: '2 minutes ago',
            icon: Code,
            color: 'text-green-600'
        },
        {
            id: 2,
            action: 'Code review completed',
            time: '1 hour ago',
            icon: Shield,
            color: 'text-blue-600'
        },
        {
            id: 3,
            action: 'Team meeting',
            time: '3 hours ago',
            icon: Users,
            color: 'text-purple-600'
        },
        {
            id: 4,
            action: 'Performance optimization',
            time: '1 day ago',
            icon: TrendingUp,
            color: 'text-orange-600'
        },
    ];
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Activity" }), _jsx("div", { className: "space-y-4", children: activities.map((activity) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: cn("p-2 rounded-lg bg-gray-50", activity.color), children: _jsx(activity.icon, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.action }), _jsx("p", { className: "text-xs text-gray-500", children: activity.time })] })] }, activity.id))) })] }));
};
const SkillsShowcase = ({ skills }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Senior Developer Skills" }), _jsx("div", { className: "flex flex-wrap gap-2", children: skills.map((skill, index) => (_jsx(motion.span, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1 * index }, className: "px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-full shadow-sm", children: skill }, skill))) })] }));
};
const Dashboard = () => {
    const { user } = useAuth();
    const { data: profileData } = useProfile();
    const stats = [
        {
            title: 'Projects Completed',
            value: '42',
            icon: _jsx(Code, { className: "h-6 w-6" }),
            trend: '+12% this month',
            color: 'blue'
        },
        {
            title: 'Team Members',
            value: '8',
            icon: _jsx(Users, { className: "h-6 w-6" }),
            color: 'green'
        },
        {
            title: 'Code Reviews',
            value: '156',
            icon: _jsx(Shield, { className: "h-6 w-6" }),
            trend: '+5% this week',
            color: 'purple'
        },
        {
            title: 'Uptime',
            value: '99.9%',
            icon: _jsx(Activity, { className: "h-6 w-6" }),
            color: 'orange'
        },
    ];
    const seniorSkills = [
        'TypeScript', 'React', 'Node.js', 'System Design', 'AWS', 'Docker',
        'Kubernetes', 'GraphQL', 'Microservices', 'CI/CD', 'Testing', 'Performance'
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center", children: [_jsxs("h1", { className: "text-4xl font-bold text-gray-900", children: ["Welcome back, ", user?.profile?.firstName || user?.username, "!"] }), _jsx("p", { className: "text-xl text-gray-600 mt-2", children: "Senior Full Stack Developer" }), _jsxs("div", { className: "flex items-center justify-center mt-4 space-x-2 text-yellow-600", children: [_jsx(Award, { className: "h-5 w-5" }), _jsx("span", { className: "font-medium", children: "Senior Level Architecture" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat, index) => (_jsx(StatsCard, { ...stat }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ActivityFeed, {}), _jsx(SkillsShowcase, { skills: seniorSkills })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "System Status" }), _jsxs("div", { className: "flex items-center space-x-2 text-green-600", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-sm font-medium", children: "All Systems Operational" })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: ['API', 'Database', 'Cache', 'WebSocket'].map((system) => (_jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: system }), _jsx("p", { className: "text-xs text-gray-500", children: "Operational" })] }, system))) })] })] }));
};
export default Dashboard;
