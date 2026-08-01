import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // Only allow running this locally in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {
    const { image } = await request.json();
    if (!image || !image.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filePath = path.join(process.cwd(), "public", "logo-blue.png");
    fs.writeFileSync(filePath, buffer);

    console.log("Successfully generated public/logo-blue.png!");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to save logo-blue.png:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
