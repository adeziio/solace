import { eq } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function DELETE(req: Request) {
  try {
    const rowsToDelete = await req.json();

    // Ensure the payload is an array
    if (!Array.isArray(rowsToDelete)) {
      throw new Error("Payload must be an array of rows to delete.");
    }

    const deletedRecords = [];
    for (const row of rowsToDelete) {
      const { id } = row;

      if (!id) {
        throw new Error("Each row must contain an 'id' field to delete.");
      }

      const deletedRow = await db
        .delete(advocates) // Use the delete method for row deletion
        .where(eq(advocates.id, id)) // Match the row based on the id
        .returning(); // Optionally return the deleted row

      deletedRecords.push(...deletedRow);
    }

    return new Response(JSON.stringify({ advocates: deletedRecords }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting rows:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to delete rows", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unknown error:", error);
    return new Response(
      JSON.stringify({ error: "An unknown error occurred while deleting the rows." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}