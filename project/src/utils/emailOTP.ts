import emailjs from '@emailjs/browser';

// Initialize EmailJS with environment variable or fallback
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "k_PN9aS9-31BP4uLF";
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_isfjsjn";
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_13m7iaf";

emailjs.init({
  publicKey: emailjsPublicKey
});

let otpCode = "";
let expiryTime = "";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

export function getExpiryTime(): string {
  const future = new Date(Date.now() + 15 * 60 * 1000); // 15 min ahead
  return future.toLocaleTimeString(); // Example format: 4:30:12 PM
}

export async function sendOTP(email: string): Promise<{ success: boolean; message: string }> {
  if (!email) {
    return { success: false, message: "⚠️ Please enter a valid email address." };
  }

  otpCode = generateOTP();
  expiryTime = getExpiryTime();

  const templateParams = {
    email: email,          // Matches {{email}} in your EmailJS template
    passcode: otpCode,     // Matches {{passcode}}
    time: expiryTime       // Matches {{time}}
  };

  try {
    await emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams);
    return { success: true, message: "✅ OTP sent to your email!" };
  } catch (error) {
    console.error("EmailJS Error:", error);
    return { success: false, message: "❌ Failed to send OTP. Please try again." };
  }
}

export function verifyOTP(enteredOTP: string): { success: boolean; message: string } {
  if (enteredOTP === otpCode) {
    return { success: true, message: "🎉 Email verified successfully!" };
  } else {
    return { success: false, message: "❌ Incorrect OTP. Please try again." };
  }
}

export function getStoredOTP(): string {
  return otpCode;
} 