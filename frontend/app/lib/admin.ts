export const isUserAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  // 1. Read the variable (Now accessible because of NEXT_PUBLIC_)
  const adminEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  // 2. Clean up the list (remove spaces, handle empty strings from trailing commas)
  const allowedAdmins = adminEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e !== ""); // Remove empty entries

  // 3. Check exact match (case insensitive)
  return allowedAdmins.includes(email.trim().toLowerCase());
};  