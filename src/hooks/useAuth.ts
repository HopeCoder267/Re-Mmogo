import { useState, useEffect } from 'react';
import { Member } from '../types';
import { MEMBERS } from '../app/config/dataConfig';

interface AuthState {
  user: Member | null;
  isAuthenticated: boolean;
  role: 'Member' | 'Signatory' | 'Treasurer' | null;
  isLoading: boolean;
}

/**
 * Custom hook for authentication state and role-based access control
 * Handles member vs signatory permissions and access control
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    role: null,
    isLoading: false,
  });

  // Initialize auth state from localStorage (in real app, this would validate JWT)
  useEffect(() => {
    const storedUser = localStorage.getItem('remmogo_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // Clear invalid stored data
        localStorage.removeItem('remmogo_user');
      }
    }
  }, []);

  /**
   * Login function - in real app, this would call auth API
   */
  const login = async (credentials: { email: string; password: string }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // FEATURE PENDING: Replace with real API call
      console.log('Login attempt:', credentials);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data (in real app, this would be API response)
      const user = MEMBERS.find(m => m.email === credentials.email);
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
        });
        
        // Store in localStorage
        localStorage.setItem('remmogo_user', JSON.stringify(user));
        
        return { success: true, user };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed' };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });
    
    // Clear localStorage
    localStorage.removeItem('remmogo_user');
  };

  /**
   * Check if current user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }

    const { role } = authState.user;

    // Define permissions for each role
    const rolePermissions = {
      'Member': [
        'view_dashboard',
        'request_loan',
        'record_contribution',
        'view_reports'
      ],
      'Signatory': [
        'view_dashboard',
        'request_loan',
        'record_contribution',
        'approve_loans',
        'approve_contributions',
        'approve_repayments',
        'view_reports'
      ],
      'Treasurer': [
        'view_dashboard',
        'request_loan',
        'record_contribution',
        'manage_payments',
        'view_reports'
      ]
    };

    return rolePermissions[role]?.includes(permission) || false;
  };

  /**
   * Check if current user is a signatory
   */
  const isSignatory = (): boolean => {
    return authState.role === 'Signatory';
  };

  /**
   * Check if current user is a treasurer
   */
  const isTreasurer = (): boolean => {
    return authState.role === 'Treasurer';
  };

  /**
   * Check if current user is a regular member
   */
  const isMember = (): boolean => {
    return authState.role === 'Member';
  };

  /**
   * Get current user ID
   */
  const getCurrentUserId = (): number | null => {
    return authState.user?.id || null;
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission,
    isSignatory,
    isTreasurer,
    isMember,
    getCurrentUserId,
  };
}
