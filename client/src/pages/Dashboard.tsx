import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Code, 
  Shield,
  Activity,
  Clock,
  Award
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useUsers'
import { cn } from '@/utils/cn'

const StatsCard: React.FC<{
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}> = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-gradient-to-r text-white",
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

const ActivityFeed: React.FC = () => {
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
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg bg-gray-50", activity.color)}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const SkillsShowcase: React.FC<{ skills: string[] }> = ({ skills }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Senior Developer Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-full shadow-sm"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { data: profileData } = useProfile()

  const stats = [
    {
      title: 'Projects Completed',
      value: '42',
      icon: <Code className="h-6 w-6" />,
      trend: '+12% this month',
      color: 'blue' as const
    },
    {
      title: 'Team Members',
      value: '8',
      icon: <Users className="h-6 w-6" />,
      color: 'green' as const
    },
    {
      title: 'Code Reviews',
      value: '156',
      icon: <Shield className="h-6 w-6" />,
      trend: '+5% this week',
      color: 'purple' as const
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: <Activity className="h-6 w-6" />,
      color: 'orange' as const
    },
  ]

  const seniorSkills = [
    'TypeScript', 'React', 'Node.js', 'System Design', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'Microservices', 'CI/CD', 'Testing', 'Performance'
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, {user?.profile?.firstName || user?.username}!
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          Senior Full Stack Developer
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2 text-yellow-600">
          <Award className="h-5 w-5" />
          <span className="font-medium">Senior Level Architecture</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <SkillsShowcase skills={seniorSkills} />
      </div>

      {/* Real-time System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['API', 'Database', 'Cache', 'WebSocket'].map((system) => (
            <div key={system} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">{system}</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard