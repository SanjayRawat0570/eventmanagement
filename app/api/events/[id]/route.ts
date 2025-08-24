import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: "Event deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
