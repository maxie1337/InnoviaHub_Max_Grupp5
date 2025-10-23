import type { Tenant, Device } from "@/types/iot"

const REG_BASE = import.meta.env.VITE_INNOVIA_REG_BASE;

export async function getTenantBySlug(slug: string): Promise<Tenant> {
  const res = await fetch(`${REG_BASE}/api/tenants/by-slug/${slug}`);
  if (!res.ok) throw new Error(`Tenant '${slug}' not found`);
  return res.json();
}

export async function listDevices(tenantId: string): Promise<Device[]> {
  const res = await fetch(`${REG_BASE}/api/tenants/${tenantId}/devices`);
  if (!res.ok) throw new Error(`Failed to list devices for ${tenantId}`);
  return res.json();
}