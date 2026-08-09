export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  CLINIC_OWNER: 2,
  DENTIST: 3,
  RECEPTIONIST: 4,
  PATIENT: 5,
} as const;

// Roles that are allowed to self-register as a "clinic member".
// clinic_owner is created via /register (clinic registration flow).
// super_admin and patient are never created through this form.
export const CLINIC_MEMBER_ROLES = [
  { id: ROLE_IDS.DENTIST, label: "Dentist" },
  { id: ROLE_IDS.RECEPTIONIST, label: "Receptionist" },
] as const;

export const ALL_ROLES = [
  { id: ROLE_IDS.SUPER_ADMIN, label: "Super Admin" },
  { id: ROLE_IDS.CLINIC_OWNER, label: "Clinic Owner" },
  { id: ROLE_IDS.DENTIST, label: "Dentist" },
  { id: ROLE_IDS.RECEPTIONIST, label: "Receptionist" },
  { id: ROLE_IDS.PATIENT, label: "Patient" },
] as const;
