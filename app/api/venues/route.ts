import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Venue
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, capacity } = body;

    if (!name || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const venue = await prisma.venue.create({
      data: { name, address, capacity },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create venue" }, { status: 500 });
  }
}

// List Venues
export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      include: { events: true },
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
  }
}

