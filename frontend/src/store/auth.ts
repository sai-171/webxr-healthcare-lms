import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Demo users for testing (same as before)
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'demo@medar.com',
    name: 'Sairam',
    avatar: '/avatars/student.jpg',
    role: 'student',
    enrolledCourses: ['1', '2', '3'],
    progress: { '1': 75, '2': 30, '3': 90 },
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first lesson',
        icon: '🎯',
        category: 'completion',
        points: 10,
        rarity: 'common',
        requirements: [],
        unlockedAt: new Date('2024-01-15')
      }
    ],
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'instructor@medar.com',
    name: 'Dr. Smith',
    avatar: '/avatars/instructor.jpg',
    role: 'instructor',
    enrolledCourses: [],
    progress: {},
    achievements: [],
    createdAt: new Date('2023-12-01'),
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'admin@medar.com',
    name: 'Saravana Sairam C',
    avatar: '/avatars/admin.jpg',
    role: 'admin',
    enrolledCourses: [],
    progress: {},
    achievements: [],
    createdAt: new Date('2023-11-15'),
    lastLogin: new Date()
  }
];

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Find user by email and password
          const user = DEMO_USERS.find(
            u => u.email === credentials.email && 
            (credentials.password === 'demo123' || credentials.password === 'password')
          );

          if (!user) {
            set({ 
              error: 'Invalid email or password',
              isLoading: false 
            });
            return false;
          }

          // Update last login
          user.lastLogin = new Date();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return true;
        } catch (error) {
          set({
            error: 'Login failed. Please try again.',
            isLoading: false
          });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if user already exists
          const existingUser = DEMO_USERS.find(u => u.email === data.email);
          if (existingUser) {
            set({
              error: 'An account with this email already exists',
              isLoading: false
            });
            return false;
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
            role: data.role,
            enrolledCourses: [],
            progress: {},
            achievements: [],
            createdAt: new Date(),
            lastLogin: new Date()
          };

          // Add to demo users (in real app, this would be an API call)
          DEMO_USERS.push(newUser);

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return true;
        } catch (error) {
          set({
            error: 'Registration failed. Please try again.',
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates }
          });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Helper hooks for role-based access
export const useIsStudent = () => {
  const user = useAuth(state => state.user);
  return user?.role === 'student';
};

export const useIsInstructor = () => {
  const user = useAuth(state => state.user);
  return user?.role === 'instructor';
};

export const useIsAdmin = () => {
  const user = useAuth(state => state.user);
  return user?.role === 'admin';
};
