import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ApprovalItem {
  id: string;
  type: 'loan' | 'contribution' | 'repayment';
  memberId: number;
  memberName: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  signatoryApprovals?: {
    signatoryId: number;
    signatoryName: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: string;
  }[];
}

export interface ApprovalState {
  pendingApprovals: ApprovalItem[];
  memberNotifications: {
    id: string;
    type: 'info' | 'success' | 'warning';
    message: string;
    timestamp: string;
    read: boolean;
  }[];
}

export const useApprovalState = () => {
  const [state, setState] = useState<ApprovalState>({
    pendingApprovals: [],
    memberNotifications: [],
  });

  // Mock approval items that need signatory action
  const mockApprovalItems: ApprovalItem[] = [
    {
      id: 'loan-001',
      type: 'loan',
      memberId: 1,
      memberName: 'Hope Kenosi',
      amount: 10000,
      description: 'Business expansion loan',
      status: 'pending',
      requestedAt: '2024-12-01T10:00:00Z',
      signatoryApprovals: [
        {
          signatoryId: 3,
          signatoryName: 'Anna Kgosing',
          status: 'approved',
          approvedAt: '2024-12-01T14:00:00Z',
        },
        {
          signatoryId: 2,
          signatoryName: 'Bokao Member',
          status: 'pending',
        },
      ],
    },
    {
      id: 'contribution-001',
      type: 'contribution',
      memberId: 2,
      memberName: 'Victor Coder',
      amount: 1500,
      description: 'Monthly contribution - December',
      status: 'pending',
      requestedAt: '2024-12-01T09:00:00Z',
      signatoryApprovals: [
        {
          signatoryId: 3,
          signatoryName: 'Anna Kgosing',
          status: 'pending',
        },
        {
          signatoryId: 2,
          signatoryName: 'Bokao Member',
          status: 'pending',
        },
      ],
    },
  ];

  // Initialize with mock data
  useEffect(() => {
    setState(prev => ({
      ...prev,
      pendingApprovals: mockApprovalItems,
    }));
  }, []);

  const addApprovalItem = (item: Omit<ApprovalItem, 'id' | 'requestedAt'>) => {
    const newItem: ApprovalItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      signatoryApprovals: [],
    };

    setState(prev => ({
      ...prev,
      pendingApprovals: [...prev.pendingApprovals, newItem],
    }));

    // Notify signatories
    addNotification({
      type: 'info',
      message: `New ${item.type} request from ${item.memberName} for P${item.amount}`,
    });
  };

  const updateApprovalStatus = (
    itemId: string,
    signatoryId: number,
    status: 'approved' | 'rejected'
  ) => {
    setState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            signatoryApprovals: item.signatoryApprovals?.map(approval =>
              approval.signatoryId === signatoryId
                ? { ...approval, status, approvedAt: new Date().toISOString() }
                : approval
            ) || [],
          };
        }
        return item;
      }),
    }));

    // Check if all signatories have approved
    const updatedItem = state.pendingApprovals.find(item => item.id === itemId);
    if (updatedItem?.signatoryApprovals?.every(approval => approval.status === 'approved')) {
      setState(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals.map(item =>
          item.id === itemId ? { ...item, status: 'approved' } : item
        ),
      }));

      // Notify member
      addNotification({
        type: 'success',
        message: `Your ${updatedItem.type} request for P${updatedItem.amount} has been approved!`,
      });
    }
  };

  const addNotification = (notification: Omit<ApprovalState['memberNotifications'][0], 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setState(prev => ({
      ...prev,
      memberNotifications: [newNotification, ...prev.memberNotifications],
    }));

    toast.success(notification.message);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setState(prev => ({
      ...prev,
      memberNotifications: prev.memberNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      ),
    }));
  };

  const getUnreadCount = () => {
    return state.memberNotifications.filter(notification => !notification.read).length;
  };

  const getPendingApprovalsForSignatory = (signatoryId: number) => {
    return state.pendingApprovals.filter(item =>
      item.signatoryApprovals?.some(approval =>
        approval.signatoryId === signatoryId && approval.status === 'pending'
      )
    );
  };

  return {
    ...state,
    addApprovalItem,
    updateApprovalStatus,
    addNotification,
    markNotificationAsRead,
    getUnreadCount,
    getPendingApprovalsForSignatory,
  };
};
