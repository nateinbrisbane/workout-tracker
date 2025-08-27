// List of authorized email addresses
// Add email addresses here to allow access to the app
export const AUTHORIZED_EMAILS = [
  'me@nathanli.net', // Add your email here
  // Add more authorized emails as needed
].map(email => email.toLowerCase().trim())

// You can also use domain-based authorization
// e.g., allow all users from a specific domain
export const AUTHORIZED_DOMAINS: string[] = [
  // 'yourcompany.com', // Uncomment and add your domain
]

export function isAuthorizedUser(email: string | null | undefined): boolean {
  console.log('Checking authorization for email:', email)
  console.log('Authorized emails list:', AUTHORIZED_EMAILS)
  
  if (!email) {
    console.log('No email provided')
    return false
  }
  
  const normalizedEmail = email.toLowerCase().trim()
  console.log('Normalized email:', normalizedEmail)
  
  // Check if email is in the authorized list
  if (AUTHORIZED_EMAILS.includes(normalizedEmail)) {
    console.log('Email found in authorized list')
    return true
  }
  
  // Check if email domain is authorized
  const domain = normalizedEmail.split('@')[1]
  console.log('Checking domain:', domain)
  if (domain && AUTHORIZED_DOMAINS.includes(domain)) {
    console.log('Domain found in authorized list')
    return true
  }
  
  console.log('Email not authorized')
  return false
}