# **CloudLock**: AI-Secured Password Manager

## Overview
CloudLock is a next-generation password manager that leverages AI technology, zero-trust authentication, and multi-cloud backup to provide unprecedented security for your digital credentials. With advanced features like AI-powered phishing detection and dark web monitoring, CloudLock ensures your passwords remain secure in an increasingly complex digital landscape.

![CloudLock Dashboard](https://raw.githubusercontent.com/LemonmadeDesigns/cloudlock/main/screenshots/dashboard-dark.png)

<details>
<summary><strong>🚀 Deployment & Local Setup Guide</strong></summary>

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/LemonmadeDesigns/cloudlock.git
   cd cloudlock
   ```

2. **Environment Variables**
   - Create a `.env` file in the root directory
   - Copy the following variables and replace with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   > ⚠️ Never commit your `.env` file to version control!

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Environment Setup**
   - When deploying to platforms like Netlify or Vercel:
     - Add the following environment variables in your deployment platform:
       - `VITE_SUPABASE_URL`
       - `VITE_SUPABASE_ANON_KEY`

2. **Build Configuration**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: 18.x or higher

3. **Supabase Configuration**
   - No additional Supabase configuration is needed
   - The project will continue using the same Supabase instance
   - Ensure your Supabase project's URL is allowed in CORS settings:
     1. Go to your Supabase Dashboard
     2. Project Settings → API
     3. Add your deployment URL to "Additional Allowed URLs"

4. **Security Considerations**
   - Enable RLS (Row Level Security) in Supabase
   - Configure proper CORS settings
   - Use environment variables for sensitive data
   - Never expose admin keys in client-side code

5. **Deployment Platforms**
   
   **Netlify**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy
   ```

   **Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

6. **Post-Deployment**
   - Verify environment variables are set
   - Test authentication flow
   - Confirm database connections
   - Check CORS settings if needed

### Troubleshooting

Common issues and solutions:

1. **Database Connection Issues**
   - Verify environment variables are correct
   - Check Supabase project status
   - Confirm CORS settings in Supabase dashboard

2. **Authentication Problems**
   - Clear browser cache and local storage
   - Verify Supabase URL and anon key
   - Check for proper email configurations in Supabase

3. **Build Failures**
   - Ensure all dependencies are installed
   - Verify Node.js version compatibility
   - Check for any environment variable issues

### Maintenance

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor Supabase dashboard for issues
   - Review security policies regularly

2. **Backup Strategy**
   - Supabase handles database backups
   - Consider additional backup solutions for critical data
   - Document recovery procedures

3. **Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor API usage in Supabase
   - Track authentication attempts

</details>

## 🔐 Key Features

### Core Security
- **Zero-Trust Authentication**: Multi-layered security approach with no implicit trust
- **End-to-End Encryption**: AES-256 and RSA-4096 encryption standards
- **Multi-Cloud Backup**: Redundant storage across AWS, Google Cloud, and Azure
- **Self-Destruct Mode**: Emergency credential wiping across all devices and cloud storage

![CloudLock Landing](https://raw.githubusercontent.com/LemonmadeDesigns/cloudlock/main/screenshots/landing.png)

### AI-Powered Protection
- **Intelligent Phishing Detection**: Real-time protection against malicious websites
- **Password Strength Analysis**: AI-driven password evaluation and suggestions
- **Dark Web Monitoring**: Immediate alerts if credentials are compromised
- **Adaptive Security**: Learning from new threat patterns

![CloudLock Auth](https://raw.githubusercontent.com/LemonmadeDesigns/cloudlock/main/screenshots/auth.png)

## 💡 Use Cases

### Individual Users
- Secure password storage and management
- Automatic strong password generation
- Cross-device synchronization
- Dark web monitoring for personal credentials
- Emergency access for trusted contacts

### Business Users
- Team password sharing and management
- Role-based access control
- Audit logging and compliance reporting
- Enterprise-grade security policies
- Integration with existing security infrastructure

## 🚀 Getting Started

### 1. Sign Up
1. Visit the CloudLock website or download the mobile app
2. Create an account with your email
3. Set up your master password and multi-factor authentication
4. Complete the security questionnaire for emergency recovery

### 2. First-Time Setup
1. Import existing passwords (supports all major password managers)
2. Install browser extensions
3. Enable cloud backup preferences
4. Configure security settings and alerts

### 3. Daily Usage
1. Access your vault through the app or browser extension
2. Add new passwords automatically when creating accounts
3. Use the password generator for new credentials
4. Monitor security alerts and recommendations

## 🛡️ Security Features

### Authentication Methods
- Biometric authentication (fingerprint, face ID)
- Hardware security keys (YubiKey, FIDO2)
- Time-based one-time passwords (TOTP)
- SMS/email verification codes

### Emergency Access
- Self-destruct capability for compromised vaults
- Trusted contact recovery system
- Offline access protocols
- Legal compliance support

## 📱 Supported Platforms
- Web interface (all major browsers)
- Mobile apps (iOS, Android)
- Desktop applications (Windows, macOS, Linux)
- Browser extensions (Chrome, Firefox, Safari, Edge)

## 🔧 Technical Stack
- **Frontend**: Next.js, React Native
- **Backend**: Node.js, Express.js, Django
- **Cloud Services**: AWS, Azure, Google Cloud
- **AI/ML**: TensorFlow, PyTorch, OpenAI APIs
- **Authentication**: OAuth 2.0, WebAuthn
- **Database**: PostgreSQL, MongoDB

## 🌟 Best Practices

### Password Management
1. Use the password generator for all new accounts
2. Enable multi-factor authentication wherever possible
3. Regularly review and update stored credentials
4. Maintain different passwords for each account
5. Use the security score feature to identify weak passwords

### Security Measures
1. Keep your master password secure and unique
2. Enable biometric authentication when available
3. Regularly review active sessions and devices
4. Set up emergency access procedures
5. Keep the application and extensions updated

## 📖 Documentation
- [User Guide](docs/user-guide.md)
- [Security Whitepaper](docs/security.md)
- [API Documentation](docs/api.md)
- [Enterprise Setup](docs/enterprise.md)

## 🤝 Support
- 24/7 technical support
- Security incident response team
- Community forums
- Regular security advisories
- Training resources

## 🔄 Updates and Maintenance
- Automatic security updates
- Regular feature additions
- Vulnerability patches
- Performance optimizations
- User feedback implementation

## 📈 Future Roadmap
- Blockchain integration for enhanced security
- Advanced AI threat detection
- Hardware security module support
- Enhanced enterprise features
- Expanded third-party integrations
- Add Google Authentication support
- Biometric authentication enhancements
- Cross-platform sync improvements

## 👥 Contributors

This project was developed as part of a school project by the following contributors:

- Carson Christensen
- Zhengyao Huang
- Terrell D Lemons
- Chaitanya Talluri
- Christian Ward

## 📝 Repository and Deployment

- Repository: [github.com/LemonmadeDesigns/cloudlock](https://github.com/LemonmadeDesigns/cloudlock)
- Production Site: [cloud-lock.org](http://cloud-lock.org)
- Development Site: [cozy-heliotrope-2865ec.netlify.app](https://cozy-heliotrope-2865ec.netlify.app)

---

For more information, visit our [website](http://cloud-lock.org) or contact our [support team](mailto:support@cloud-lock.org).

*CloudLock - Securing Your Digital Identity with AI-Powered Protection*