// Authentication & User Forms

export interface RegisterProps {
  userName: string;
  email: string;
  password: string;
  country: string;
  phoneNumber: string;
  confirmPassword: string;
  profileImage: File | null;
  role: "user";
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface ForgetProps {
  email: string;
  password: string;
}

export interface ResetPasswordProps {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string;
}

export interface ChangePasswordProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Register Form (Frontend)
export interface IRegisterForm {
  userName: string;
  email: string;
  password: string;
  country: CountryType;
  phoneNumber: string;
  confirmPassword: string;
  profileImage: File | null;
}

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}
