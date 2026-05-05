import { useState, useEffect } from 'react';
import { Group, Member, Loan, Contribution } from '../types';
import { MEMBERS, LOANS, CONTRIBUTIONS, MOCK_GROUPS } from '../app/config/dataConfig';

interface CurrentGroupState {
  currentGroup: Group | null;
  userGroups: Group[];
  currentGroupMembers: Member[];
  currentGroupLoans: Loan[];
  currentGroupContributions: Contribution[];
  isLoading: boolean;
}

/**
 * Hook for managing current group context and group-specific data
 * Implements group-first workflow for Motshelo groups
 */
export function useCurrentGroup() {
  const [state, setState] = useState<CurrentGroupState>({
    currentGroup: null,
    userGroups: [],
    currentGroupMembers: [],
    currentGroupLoans: [],
    currentGroupContributions: [],
    isLoading: false,
  });

  // Initialize with mock data (in real app, this would come from API)
  useEffect(() => {
    const userGroups = MOCK_GROUPS; // Use the new mock groups array

    setState(prev => ({
      ...prev,
      currentGroup: userGroups[0] || null, // Default to first group
      userGroups,
      currentGroupMembers: MEMBERS, // Filter by group in real app
      currentGroupLoans: LOANS, // Filter by group in real app
      currentGroupContributions: CONTRIBUTIONS, // Filter by group in real app
      isLoading: false,
    }));
  }, []);

  /**
   * Switch to a different group
   */
  const switchGroup = (groupId: number) => {
    const targetGroup = state.userGroups.find(g => g.id === groupId);
    if (targetGroup) {
      setState(prev => ({
        ...prev,
        currentGroup: targetGroup,
        currentGroupMembers: MEMBERS, // Filter by group in real app
        currentGroupLoans: LOANS, // Filter by group in real app
        currentGroupContributions: CONTRIBUTIONS, // Filter by group in real app
      }));
    }
  };

  /**
   * Add a new group to user's groups
   */
  const addGroup = (group: Group) => {
    setState(prev => ({
      ...prev,
      userGroups: [...prev.userGroups, group],
    }));
  };

  /**
   * Update current group data (after API calls)
   */
  const updateGroupData = () => {
    if (state.currentGroup) {
      setState(prev => ({
        ...prev,
        currentGroupMembers: MEMBERS, // Refresh from API
        currentGroupLoans: LOANS, // Refresh from API
        currentGroupContributions: CONTRIBUTIONS, // Refresh from API
      }));
    }
  };

  /**
   * Get group-specific summary data
   */
  const getGroupSummary = () => {
    if (!state.currentGroup) return null;

    const totalPool = state.currentGroupContributions.reduce((sum, c) => sum + c.amount, 0);
    const activeLoans = state.currentGroupLoans.filter(loan => loan.status === 'active').length;
    const pendingApprovals = [
      ...state.currentGroupLoans.filter(loan => loan.status === 'pending'),
      ...state.currentGroupContributions.filter(c => c.status === 'pending'),
    ].length;

    return {
      totalPool,
      activeLoans,
      pendingApprovals,
      memberCount: state.currentGroupMembers.length,
      monthlyContribution: state.currentGroup.monthlyContribution,
    };
  };

  return {
    ...state,
    switchGroup,
    addGroup,
    updateGroupData,
    getGroupSummary,
  };
}
