import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function POST(req: Request) {
  try {
    const rowsToCreate = await req.json();

    if (!Array.isArray(rowsToCreate)) {
      throw new Error("Payload must be an array of rows to create.");
    }

    const createdRecords = await db.insert(advocates).values(rowsToCreate).returning();

    return new Response(JSON.stringify({ advocates: createdRecords }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating rows:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to create rows", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unknown error:", error);
    return new Response(
      JSON.stringify({ error: "An unknown error occurred while creating rows." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}