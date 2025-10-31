import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI, authAPI } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import type { UserRole } from '@/types/auth'

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersAPI.getUsers(page, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getUser(id),
    enabled: !!id,
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersAPI.updateRole(id, role),
    onSuccess: (data: any, variables: any) => {
      // Update the user in the cache
      queryClient.setQueryData(
        ['user', variables.id],
        (old: any) => ({ ...old, user: data.data.user })
      )

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast.success('User role updated successfully')
    },
  })
}

export const useProfile = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
