import { db } from "@/database";
import { blocks } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") as string;
    const block = await db.query.blocks.findFirst({
      with: { files: { with: { modules: true } } },
      where: eq(blocks.name, name),
    });
    return NextResponse.json(block);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
};
