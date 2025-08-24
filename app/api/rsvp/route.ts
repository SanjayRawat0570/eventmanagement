import { NextResponse } from "next/server";
import { PrismaClient, RSVPStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Create/Update RSVP
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, userId, status } = body;

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing eventId or userId" }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.upsert({
      where: {
        eventId_userId: { eventId, userId }, // unique RSVP
      },
      update: { status: status || RSVPStatus.PENDING },
      create: {
        eventId,
        userId,
        status: status || RSVPStatus.PENDING,
      },
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to manage RSVP" }, { status: 500 });
  }
}

// List RSVPs for an event
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    return NextResponse.json(rsvps);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

