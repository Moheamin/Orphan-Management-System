// utils/sponsor.ts

/* ===== Form data (Modal / UI) ===== */
export type SponsorFormData = {
  fullName: string;
  phone: string;
  email?: string;
  sponsorshipType?: string;
  sponsorshipCount?: string;
  status: string;
};

/* ===== API payload ===== */
export type SponsorPayload = {
  name: string;
  phone: string;
  email?: string | null;
  sponsorshipType?: string;
  sponsorshipCount?: string | undefined;
  status: string;
};

/* ===== Update payload ===== */
export type UpdateSponsorPayload = SponsorPayload & {
  id: number;
};
