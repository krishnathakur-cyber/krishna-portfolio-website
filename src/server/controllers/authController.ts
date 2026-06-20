import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminModel } from "../models/Admin";
import { connectDB, getFallbackStore } from "../config/db";

const OWNER_EMAIL = "krishnathakur222w@gmail.com";
const LEGACY_USERNAMES = ["krishna", "krish"];

function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}

function getConfiguredUsername(): string {
  return (process.env.ADMIN_USERNAME || "admin").toLowerCase();
}

function getConfiguredEmailUser(): string {
  return (process.env.EMAIL_USER || "").toLowerCase().trim();
}

function getConfiguredPassword(): string {
  return (process.env.ADMIN_PASSWORD || "secure-default-password").trim();
}

function getAllowedAdminUsernames(): string[] {
  const allowed = new Set<string>([
    getConfiguredUsername(),
    OWNER_EMAIL,
    getConfiguredEmailUser(),
    ...LEGACY_USERNAMES,
  ]);
  allowed.delete("");
  return Array.from(allowed);
}

function isAllowedDefaultUsername(inputUsername: string): boolean {
  return getAllowedAdminUsernames().includes(inputUsername);
}

function signAdminToken(
  adminId: string,
  username: string,
  secret: string,
): string {
  return jwt.sign({ id: adminId, username }, secret, { expiresIn: "12h" });
}

async function verifyPasswordWithEnvSync(
  storedHash: string,
  password: string,
  allowEnvSync: boolean,
  onSync?: (newHash: string) => Promise<void>,
): Promise<boolean> {
  const trimmedPassword = password.trim();
  const configuredPassword = getConfiguredPassword();

  if (await bcrypt.compare(trimmedPassword, storedHash)) {
    return true;
  }

  if (allowEnvSync && trimmedPassword === configuredPassword) {
    const newHash = await bcrypt.hash(trimmedPassword, 10);
    if (onSync) {
      await onSync(newHash);
    }
    return true;
  }

  return false;
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Username and password fields are required." });
    return;
  }

  const inputUsername = normalizeUsername(username);
  const isConnected = await connectDB();
  const secret =
    process.env.JWT_SECRET || "fallback-portfolio-jwt-secret-string-2026";
  const allowEnvSync = isAllowedDefaultUsername(inputUsername);

  let processedDb = false;
  if (isConnected) {
    try {
      let admin = await (AdminModel as any).findOne({
        username: inputUsername,
      });

      if (!admin && allowEnvSync) {
        const hashPass = await bcrypt.hash(getConfiguredPassword(), 10);
        admin = await AdminModel.create({
          username: inputUsername,
          password: hashPass,
        });
      }

      if (admin) {
        const authenticated = await verifyPasswordWithEnvSync(
          admin.password,
          password,
          allowEnvSync,
          async (newHash) => {
            admin.password = newHash;
            await admin.save();
          },
        );

        if (!authenticated) {
          res
            .status(401)
            .json({ error: "Incorrect password for this admin account." });
          return;
        }

        res.json({
          token: signAdminToken(String(admin._id), admin.username, secret),
          username: admin.username,
        });
        processedDb = true;
      }
    } catch (error: any) {
      console.error(
        "Login database error, falling back to local sandbox validation:",
        error?.message || error,
      );
    }
  }

  if (!processedDb) {
    const store = getFallbackStore();
    const sandboxAdmin = store.admins.find(
      (entry) => entry.username === inputUsername,
    );

    if (sandboxAdmin) {
      const authenticated = await verifyPasswordWithEnvSync(
        sandboxAdmin.password,
        password,
        allowEnvSync,
        async (newHash) => {
          sandboxAdmin.password = newHash;
        },
      );

      if (authenticated) {
        res.json({
          token: signAdminToken(
            sandboxAdmin._id,
            sandboxAdmin.username,
            secret,
          ),
          username: sandboxAdmin.username,
          isSandbox: true,
        });
        return;
      }

      res
        .status(401)
        .json({ error: "Incorrect password for this admin account." });
      return;
    }

    const configuredPassword = getConfiguredPassword();
    if (allowEnvSync && password === configuredPassword) {
      res.json({
        token: signAdminToken("mock-admin-id-999", inputUsername, secret),
        username: inputUsername,
        isSandbox: true,
      });
      return;
    }

    if (!isAllowedDefaultUsername(inputUsername)) {
      res.status(401).json({
        error: `Unknown username. Use "${getConfiguredUsername()}", "${OWNER_EMAIL}", or "krishna".`,
      });
      return;
    }

    res.status(401).json({
      error:
        "Incorrect password. Use the value configured in ADMIN_PASSWORD (.env).",
    });
  }
}

/**
 * Custom register route used to establish and protect primary admin accounts
 */
export async function registerAdmin(
  req: Request,
  res: Response,
): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  const normalizedUsername = normalizeUsername(username);
  const isConnected = await connectDB();

  try {
    const hashPass = await bcrypt.hash(password, 10);

    let processedDb = false;
    if (isConnected) {
      try {
        const existing = await (AdminModel as any).findOne({
          username: normalizedUsername,
        });
        if (existing) {
          res.status(400).json({
            error: "Administrator already exists with that username.",
          });
          return;
        }

        await AdminModel.create({
          username: normalizedUsername,
          password: hashPass,
        });

        res
          .status(201)
          .json({ status: "success", message: "Admin account provisioned." });
        processedDb = true;
      } catch (dbErr: any) {
        console.error(
          "⚠️ Database error during registerAdmin, falling back to sandbox storage:",
          dbErr?.message || dbErr,
        );
      }
    }

    if (!processedDb) {
      const store = getFallbackStore();
      const existing = store.admins.find(
        (entry) => entry.username === normalizedUsername,
      );
      if (existing) {
        res.status(400).json({
          error: "Administrator already exists in transient sandbox.",
        });
        return;
      }

      store.admins.push({
        _id: "sandbox-" + Math.random().toString(36).substr(2, 9),
        username: normalizedUsername,
        password: hashPass,
        createdAt: new Date(),
      });

      res.status(201).json({
        status: "success",
        message: "Admin account provisioned in transient sandbox cache.",
      });
    }
  } catch (error: any) {
    console.error("Register database error:", error);
    res.status(500).json({ error: "Database system fault during enrolment." });
  }
}
