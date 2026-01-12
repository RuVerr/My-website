import { NextResponse } from "next/server";
import { contactsDB } from "@/Data/contactsDB";

export async function GET() {
  return NextResponse.json(contactsDB);
}
