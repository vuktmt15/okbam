import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Redirect ngay sang trang đăng nhập mới
    router.replace("/signin");
  }, [router]);

  return null;
}
