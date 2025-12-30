import { NextResponse } from "next/server";
import { aboutMeDB } from "@/Data/aboutMeDB";

export async function GET() {
  return NextResponse.json(aboutMeDB);
}
