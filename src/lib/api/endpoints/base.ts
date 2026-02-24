export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    console.warn(
        "Warning: NEXT_PUBLIC_API_URL is not defined in environment variables."
    );
}
