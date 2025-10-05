import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleIcon } from 'lucide-react';

export default function AuthCodeError() {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentication Error
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sorry, we couldn't sign you in. This could be due to an invalid or expired authentication link.
        </p>
        <div className="mt-6 text-center">
          <Button asChild className="rounded-full">
            <Link href="/sign-in">
              Try signing in again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}