const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

export async function checkBackendHealth() {
  const response = await fetch(
    `${API_URL}/api/health`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to connect to Ostrin backend"
    );
  }

  return response.json();
}