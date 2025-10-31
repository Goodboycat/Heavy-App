import { useQuery, useMutation, useQueryClient } from './api';
import { usersAPI } from '@/services/api';
export const useUsers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['users', page, limit],
        queryFn: () => usersAPI.getUsers(page, limit),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
export const useUser = (id) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => usersAPI.getUser(id),
        enabled: !!id,
    });
};
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }) => usersAPI.updateRole(id, role),
        onSuccess: (data, variables) => {
            // Update the user in the cache
            queryClient.setQueryData(['user', variables.id], (old) => ({ ...old, user: data.data.user }));
            // Invalidate users list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User role updated successfully');
        },
    });
};
export const useProfile = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['profile', user?.id],
        queryFn: () => authAPI.getCurrentUser(),
        enabled: !!user,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
