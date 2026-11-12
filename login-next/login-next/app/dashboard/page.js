import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getUserById, countUsers } from "@/lib/users";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    redirect("/login");
  }

  const user = getUserById(session.sub);
  if (!user) {
    redirect("/login");
  }

  const totalUsers = countUsers();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ color: "#4c7a5e", fontWeight: 600, fontSize: 13, margin: "0 0 10px" }}>
          Berhasil masuk
        </p>
        <h1 style={{ margin: "0 0 10px", fontSize: 26 }}>Halo, {user.name}</h1>
        <p style={{ color: "#6b6b6b", margin: "0 0 4px" }}>{user.email}</p>
        <p style={{ color: "#9e9e9e", fontSize: 13, margin: "0 0 24px" }}>
          Total pengguna terdaftar: {totalUsers}
        </p>
        <LogoutButton />
      </div>
    </main>
  );
}
