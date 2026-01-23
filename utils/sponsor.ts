// utils/sponsor.ts

/* ===== Form data (Modal / UI) ===== */
export type SponsorFormData = {
  orphanId: string;
  fullName: string;
  phone: string;
  email?: string;
  sponsorshipType?: string;
  sponsorshipCount?: string;
  status: string;
  isDeleted: boolean;
};

/* ===== API payload ===== */
export type SponsorPayload = {
  orphanId: string;
  name: string;
  phone: string;
  email?: string | null;
  sponsorshipType?: string;
  sponsorshipCount?: string | undefined;
  status?: string;
  note?: string;
};

/* ===== Update payload ===== */
export type UpdateSponsorPayload = SponsorPayload & {
  id: number;
};
