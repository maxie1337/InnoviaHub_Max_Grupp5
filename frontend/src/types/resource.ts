export type Resource = {
  resourceId: number;
  resourceTypeId: number;
  name: string;
  isBooked: boolean;
  resourceType?: {
    resourceTypeId: number;
    name: string;
  };
};