export const ADMIN_EMAILS: string[] = ["sameben0123@gmail.com"];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
