export const UserRole = {
  MEMBER: "MEMBER",
  OWNER: "OWNER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
