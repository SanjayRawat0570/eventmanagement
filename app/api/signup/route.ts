import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, role } = body as {
      fullName: string;
      email: string;
      password: string;
      role: Role;
    };

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashed,
        role: role || "STAFF_MEMBER",
      },
      select: { id: true, fullName: true, email: true, role: true },
    });

    const token = signJwt({ id: user.id, role: user.role });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
