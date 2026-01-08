export type UserRole = 'USER' | 'INSTRUCTOR' | 'ADMIN';

// Legacy types for backward compatibility
export type LegacyUserRole = 'student' | 'instructor' | 'admin' | 'teaching_assistant' | 'corporate_admin' | 'support_agent' | 'content_reviewer';

// Mapping for display purposes
export const USER_ROLE_DISPLAY: Record<UserRole, string> = {
  USER: 'Student',
  INSTRUCTOR: 'Instructor', 
  ADMIN: 'Administrator',
};

// Helper functions
export const isUserRole = (role: string): role is UserRole => {
  return ['USER', 'INSTRUCTOR', 'ADMIN'].includes(role);
};

export const getUserRoleDisplay = (role: UserRole): string => {
  return USER_ROLE_DISPLAY[role] || role;
};

export interface RolePermissions {
  canCreateCourse: boolean;
  canModerateContent: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canProcessPayments: boolean;
  canManageSupport: boolean;
  canReviewContent: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  USER: {
    canCreateCourse: false,
    canModerateContent: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canProcessPayments: false,
    canManageSupport: false,
    canReviewContent: false,
  },
  INSTRUCTOR: {
    canCreateCourse: true,
    canModerateContent: false,
    canManageUsers: false,
    canViewAnalytics: true,
    canProcessPayments: false,
    canManageSupport: false,
    canReviewContent: false,
  },
  ADMIN: {
    canCreateCourse: true,
    canModerateContent: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canProcessPayments: true,
    canManageSupport: true,
    canReviewContent: true,
  },
};

// Helper function to check permissions
export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
};
