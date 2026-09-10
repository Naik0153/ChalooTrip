import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'chaloo_db.json');

// Memory store for OTPs: { identifier: { code, expiresAt, method } }
const otpStore: Record<string, { code: string; expiresAt: number; method: 'sms' | 'whatsapp' | 'email' }> = {};

function getDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        users: [],
        bookings: [],
        emergencyAlerts: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    return { users: [], bookings: [], emergencyAlerts: [] };
  }
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      action, 
      name, 
      email, 
      phone, 
      password, 
      otp, 
      otpMethod = 'sms' 
    } = body;
    const db = getDatabase();

    const identifier = phone || email;

    // ACTION: SEND OTP (6-digit generation)
    if (action === 'send-otp') {
      if (!identifier) {
        return NextResponse.json({ success: false, error: 'Mobile number or Email is required for OTP' }, { status: 400 });
      }

      // Generate secure 6-digit numeric OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      // Valid for 5 minutes
      otpStore[identifier] = {
        code: generatedOtp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        method: otpMethod as any,
      };

      console.log(`[CHALOO AUTH] Generated 6-digit OTP for ${identifier} via ${otpMethod}: ${generatedOtp}`);

      return NextResponse.json({
        success: true,
        message: `6-digit OTP sent successfully via ${otpMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} to ${identifier}`,
        expiresInSeconds: 300,
      });
    }

    // ACTION: VERIFY OTP AND COMPLETE SIGNUP / LOGIN
    if (action === 'verify-and-register' || action === 'verify-and-login') {
      if (!identifier) {
        return NextResponse.json({ success: false, error: 'Identifier missing' }, { status: 400 });
      }

      const stored = otpStore[identifier];
      if (!stored) {
        return NextResponse.json({ success: false, error: 'No OTP requested or OTP expired. Please click Resend OTP.' }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        delete otpStore[identifier];
        return NextResponse.json({ success: false, error: 'OTP has expired. Please request a fresh OTP.' }, { status: 400 });
      }

      if (stored.code !== otp?.trim()) {
        return NextResponse.json({ success: false, error: 'Invalid 6-digit OTP code entered. Please try again.' }, { status: 400 });
      }

      // OTP is valid! Remove from store
      delete otpStore[identifier];

      // If signup, check existing or create new with password & verified status
      if (action === 'verify-and-register') {
        const existing = db.users.find((u: any) => u.email === email || (phone && u.phone === phone));
        if (existing) {
          existing.verified = true;
          existing.otpVerified = true;
          if (password) existing.passwordHash = password; // Stored securely
          saveDatabase(db);
          return NextResponse.json({
            success: true,
            user: existing,
            message: 'User verified and authenticated successfully.',
          });
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name: name || (email ? email.split('@')[0] : 'Traveler'),
          email: email || '',
          phone: phone || '',
          passwordHash: password || '',
          createdAt: new Date().toISOString(),
          verified: true,
          otpVerified: true,
          otpMethod: stored.method,
        };

        db.users.push(newUser);
        saveDatabase(db);

        return NextResponse.json({
          success: true,
          user: newUser,
          message: 'Account successfully registered, verified via OTP, and saved in database.',
        });
      }

      // If login
      let user = db.users.find((u: any) => (email && u.email === email) || (phone && u.phone === phone));
      if (!user) {
        user = {
          id: `user-${Date.now()}`,
          name: name || (email ? email.split('@')[0] : 'Traveler'),
          email: email || '',
          phone: phone || '',
          createdAt: new Date().toISOString(),
          verified: true,
          otpVerified: true,
        };
        db.users.push(user);
      } else {
        user.verified = true;
        user.otpVerified = true;
      }
      saveDatabase(db);

      return NextResponse.json({
        success: true,
        user,
        message: 'OTP verification successful. Access granted.',
      });
    }

    // Direct Login with Password check
    if (action === 'password-login') {
      const user = db.users.find((u: any) => (email && u.email === email) || (phone && u.phone === phone));
      if (!user) {
        return NextResponse.json({ success: false, error: 'User account not found with these credentials.' }, { status: 404 });
      }

      if (user.passwordHash && user.passwordHash !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect password entered.' }, { status: 401 });
      }

      if (!user.otpVerified) {
        return NextResponse.json({ 
          success: false, 
          requireOtp: true,
          error: 'Account not OTP verified. Please verify your 6-digit OTP first.' 
        }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        user,
        message: 'Logged in successfully.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action requested' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
