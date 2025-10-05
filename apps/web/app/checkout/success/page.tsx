import { redirect } from 'next/navigation'
import { getUser } from '@/lib/db/queries'

export default async function CheckoutSuccessPage() {
  // Check if user is logged in and has active subscription
  const user = await getUser()
  
  if (user) {
    // Redirect to dashboard after successful payment
    redirect('/dashboard')
  }
  
  // If not logged in, redirect to sign in
  redirect('/sign-in')
}