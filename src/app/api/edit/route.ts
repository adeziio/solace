import { eq } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function POST(req: Request) {
  try {
    const rowsToUpdate = await req.json();

    // Ensure the payload is an array
    if (!Array.isArray(rowsToUpdate)) {
      throw new Error("Payload must be an array of rows to update.");
    }

    const updatedRecords = [];
    for (const row of rowsToUpdate) {
      // Exclude `createdAt` from the update fields
      const { id, createdAt, ...fieldsToUpdate } = row;

      if (!id) {
        throw new Error("Each row must contain an 'id' field to update.");
      }

      const updatedRow = await db
        .update(advocates)
        .set(fieldsToUpdate) // Do not include `createdAt` here
        .where(eq(advocates.id, id))
        .returning();

      updatedRecords.push(...updatedRow);
    }

    return new Response(JSON.stringify({ advocates: updatedRecords }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating rows:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to update rows", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unknown error:", error);
    return new Response(
      JSON.stringify({ error: "An unknown error occurred while updating the rows." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}