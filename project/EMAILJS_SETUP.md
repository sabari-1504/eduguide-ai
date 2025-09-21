# EmailJS Setup Guide

## Configuration

Your EmailJS OTP authentication is now integrated! Here's how to configure it:

### Environment Variables (Optional)

Create a `.env` file in the project root with the following variables:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
```

### Current Configuration

The system is currently configured with your provided EmailJS credentials:

- **Public Key**: `k_PN9aS9-31BP4uLF`
- **Service ID**: `service_isfjsjn`
- **Template ID**: `template_13m7iaf`

### How It Works

1. **Registration Flow**:
   - User fills out registration form
   - System sends OTP via EmailJS to user's email
   - User enters OTP for verification
   - Upon successful verification, Firebase account is created
   - User is redirected to the main application

2. **OTP Features**:
   - 6-digit numeric OTP
   - 15-minute expiration time
   - Resend functionality
   - Real email delivery via EmailJS

3. **Security**:
   - OTP is generated server-side
   - Email verification before account creation
   - Firebase authentication integration

### Testing

To test the OTP system:

1. Start the development server: `npm run dev`
2. Navigate to the About page (default landing page)
3. Click "Sign Up" and fill out the registration form
4. Check your email for the OTP
5. Enter the OTP to complete registration

### Troubleshooting

If OTP emails are not being received:

1. Check your EmailJS dashboard for service status
2. Verify your EmailJS template variables match:
   - `{{email}}` - User's email address
   - `{{passcode}}` - 6-digit OTP
   - `{{time}}` - Expiration time
3. Check browser console for any EmailJS errors
4. Ensure your EmailJS service is active and properly configured 