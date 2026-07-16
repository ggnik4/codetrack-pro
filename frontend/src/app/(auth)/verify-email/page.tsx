"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useVerifyEmail } from "@/hooks/use-auth";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const params = useSearchParams();
  const uid = params.get("uid") ?? "";
  const token = params.get("token") ?? "";
  const verify = useVerifyEmail();

  useEffect(() => {
    if (uid && token) {
      verify.mutate({ uid, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in rounded-lg border border-border bg-card p-8 text-center">
        {verify.isPending && <p className="text-sm text-muted-foreground">Verifying...</p>}

        {verify.isSuccess && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Email verified</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Your email is confirmed. You can now log in.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Go to login
            </Link>
          </>
        )}

        {verify.isError && (
          <>
            <h1 className="mb-2 text-xl font-semibold">Link invalid or expired</h1>
            <p className="text-sm text-muted-foreground">
              Log in and request a new verification email from your account settings.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
