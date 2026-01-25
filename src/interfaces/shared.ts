// Shared / Reusable Types

export interface SubmitBtnAuth {
  isSubmitting: boolean;
  title: string;
  className?: string;
}

export type CreatedBy {
  _id: string;
  userName: string;
};

export interface IFacility {
  _id: string;
  name: string;
}
