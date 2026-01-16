export const isUserAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  
  const adminEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  
  const allowedAdmins = adminEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e !== ""); 

  
  return allowedAdmins.includes(email.trim().toLowerCase());
};  