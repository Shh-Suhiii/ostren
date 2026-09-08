import { checkBackendHealth } from "@/lib/api";

type HealthData = {
  success: boolean;
  message: string;
  service: string;
};

export default async function ApiTestPage() {
  let data: HealthData | null = null;
  let error = false;

  try {
    data = await checkBackendHealth();
  } catch {
    error = true;
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf8]">
        <div className="text-center">
          <p className="text-sm font-medium text-red-500">
            Backend connection failed
          </p>

          <p className="mt-3 text-sm text-black/40">
            Make sure Flask is running on port 5000.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafaf8]">
      <div className="text-center">
        <p className="text-sm font-medium text-green-600">
          Backend connected ✓
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#022a46]">
          {data.message}
        </h1>

        <p className="mt-3 text-sm text-black/40">
          {data.service}
        </p>
      </div>
    </main>
  );
}