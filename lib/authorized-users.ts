// List of authorized email addresses
// Add email addresses here to allow access to the app
export const AUTHORIZED_EMAILS = [
  'me@nathanli.net', // Add your email here
  // Add more authorized emails as needed
]

// You can also use domain-based authorization
// e.g., allow all users from a specific domain
export const AUTHORIZED_DOMAINS = [
  // 'yourcompany.com', // Uncomment and add your domain
]

export function isAuthorizedUser(email: string | null | undefined): boolean {
  if (!email) return false
  
  // Check if email is in the authorized list
  if (AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
    return true
  }
  
  // Check if email domain is authorized
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && AUTHORIZED_DOMAINS.includes(domain)) {
    return true
  }
  
  return false
}