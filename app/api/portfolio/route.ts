import { NextResponse } from "next/server";
import { portfolioDB } from "@/Data/portfolioDB";

export async function GET() {
  return NextResponse.json(portfolioDB);
}
