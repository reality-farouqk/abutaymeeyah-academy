import fs from "fs";
import path from "path";

export interface StudentRegistration {
  reference: string;
  programmeId: string;
  programmeName: string;
  billingCycle: string;
  schedule: string;
  feePlanId?: string;
  feePlanLabel?: string;

  // Student Details
  studentName: string;
  studentAge: number;
  gender: "Male" | "Female";
  nationality?: string;
  previousExperience?: string;

  // Parent / Guardian Details
  parentName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;

  // Financial Breakdown
  tuitionFee: number;
  registrationFee: number;
  discountAmount: number;
  promoCode?: string;
  totalFee: number;

  // Payment Status
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentGateway: "Paystack" | "Flutterwave" | "Bank Transfer" | "Pending";
  transactionReference?: string;
  paidAt?: string;

  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

// In-memory fallback
const inMemoryStore = new Map<string, StudentRegistration>();

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
    }
  } catch {
    // Edge/serverless fallback
  }
}

function loadRegistrations(): StudentRegistration[] {
  ensureDataFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data || "[]");
    }
  } catch {
    // Return values from in-memory fallback
  }
  return Array.from(inMemoryStore.values());
}

function saveRegistrations(items: StudentRegistration[]) {
  ensureDataFile();
  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
    }
  } catch {
    // Keep in memory
  }
  inMemoryStore.clear();
  items.forEach((item) => inMemoryStore.set(item.reference, item));
}

export function saveRegistration(reg: StudentRegistration): StudentRegistration {
  const items = loadRegistrations();
  const index = items.findIndex((i) => i.reference === reg.reference);
  if (index >= 0) {
    items[index] = reg;
  } else {
    items.unshift(reg);
  }
  saveRegistrations(items);
  return reg;
}

export function getRegistrationByReference(reference: string): StudentRegistration | null {
  const items = loadRegistrations();
  const found = items.find(
    (i) => i.reference.toLowerCase() === reference.trim().toLowerCase()
  );
  return found || null;
}

export function getRegistrationsByEmail(email: string): StudentRegistration[] {
  const items = loadRegistrations();
  return items.filter(
    (i) => i.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function getAllRegistrations(): StudentRegistration[] {
  return loadRegistrations();
}

export function updatePaymentStatus(
  reference: string,
  status: "PAID" | "FAILED" | "PENDING",
  gateway: "Paystack" | "Flutterwave" | "Bank Transfer",
  txRef?: string
): StudentRegistration | null {
  const reg = getRegistrationByReference(reference);
  if (!reg) return null;

  const updated: StudentRegistration = {
    ...reg,
    paymentStatus: status,
    paymentGateway: gateway,
    transactionReference: txRef || reg.transactionReference,
    paidAt: status === "PAID" ? new Date().toISOString() : reg.paidAt,
    updatedAt: new Date().toISOString(),
  };

  return saveRegistration(updated);
}

export function generateRegistrationReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ATA-${random}`;
}
