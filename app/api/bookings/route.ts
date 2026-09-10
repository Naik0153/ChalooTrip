import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// File-based persistent DB store in project directory
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'chaloo_db.json');

interface DatabaseSchema {
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    verified: boolean;
  }>;
  bookings: Array<any>;
  emergencyAlerts: Array<any>;
}

function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        users: [
          {
            id: 'u-1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '+91 98765 43210',
            createdAt: new Date().toISOString(),
            verified: true,
          }
        ],
        bookings: [],
        emergencyAlerts: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { users: [], bookings: [], emergencyAlerts: [] };
  }
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save to database:', e);
  }
}

// GET: Retrieve bookings from database
export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    bookings: db.bookings,
    count: db.bookings.length,
  });
}

// POST: Save confirmed booking with blockchain receipt to database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const newBooking = {
      ...body,
      id: body.id || `bkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: body.status || 'Confirmed',
    };

    db.bookings.unshift(newBooking);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Booking successfully secured and committed to persistent database',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Database error' },
      { status: 500 }
    );
  }
}
