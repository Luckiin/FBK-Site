// ============================================================
// Middleware FBK — gerencia sessão Supabase e protege rotas
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rotas que exigem login de atleta
const ATLETA_ROUTES = ["/atleta"];
// Rotas que exigem login de filial
const FILIAL_ROUTES = ["/filial"];
// Rotas exclusivas para admins
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Busca role do usuário ──────────────────────────────────
  let role = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();
    role = profile?.role ?? "atleta";
  }

  const isAdmin = role === "admin";

  // ── Redirect: auth pages quando já logado ──────────────────
  if (user && pathname.startsWith("/auth/")) {
    const dest = isAdmin ? "/admin" : role === "filial" ? "/filial" : "/atleta";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── Redirect: rotas protegidas sem login ───────────────────
  const isProtected = [...ATLETA_ROUTES, ...FILIAL_ROUTES, ...ADMIN_ROUTES]
    .some(p => pathname.startsWith(p));

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/auth/entrar", request.url));
  }

  // ── Redirect: admin sem permissão ──────────────────────────
  if (ADMIN_ROUTES.some(p => pathname.startsWith(p)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
