import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const item_id = searchParams.get("id");

    if (!item_id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const result = await db.query(
      `SELECT item_id, image, box_location, lost_at, description, found_when, finder_details, valid_code 
       FROM items WHERE item_id = $1`,
      [item_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Return the first (and only) item
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("[EDIT_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      item_id,
      image,
      box_location,
      lost_at,
      description,
      found_when,
      finder_details,
      valid_code,
    } = body;

    if (
      !item_id ||
      !image ||
      !box_location ||
      !lost_at ||
      !description ||
      !found_when ||
      !finder_details ||
      !valid_code
    ) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE items SET 
        image = $1,
        box_location = $2,
        lost_at = $3,
        description = $4,
        found_when = $5,
        finder_details = $6,
        valid_code = $7
       WHERE item_id = $8`,
      [image, box_location, lost_at, description, found_when, finder_details, valid_code, item_id]
    );

    // Optional: check if update affected a row
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated successfully!" });
  } catch (error) {
    console.error("[EDIT_PUT_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
