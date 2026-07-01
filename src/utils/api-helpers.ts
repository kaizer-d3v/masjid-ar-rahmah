// Path: src/utils/api-helpers.ts — would be "Other" by path patterns
// Content: has fetch() calls — content-aware categorization promotes to "API"

export async function fetchJemaahList() {
  const res = await fetch("/api/jemaah");
  return res.json();
}

export async function fetchAnnouncements() {
  const res = await fetch("/api/announcements");
  return res.json();
}

export async function submitDonation(amount: number, method: string) {
  const res = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, method }),
  });
  return res.json();
}
