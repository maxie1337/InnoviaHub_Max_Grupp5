export type Tenant = { id: string; name: string; slug: string };

export type Device = {
  id: string;
  tenantId: string;
  model: string;
  serial: string;
  status: string;
};
