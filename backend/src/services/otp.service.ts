const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getOtpExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);
  return expiry;
};

const sendOtp = async (phone: string, otp: string): Promise<void> => {
  // TODO: Integrate SMS provider (e.g., MSG91, Twilio)
  console.log(`[OTP] Phone: ${phone} | Code: ${otp}`);
};

export const otpService = { generateOtp, getOtpExpiry, sendOtp };
