export interface FeePlan {
  id: string;
  label: string;
  fee: number; // in NGN (₦)
  billingCycle: "Termly" | "Monthly" | "Annual";
  nigeriansOnly?: boolean; // restricted to students with Nigerian nationality
}

export interface Programme {
  id: string;
  name: string;
  subtitle: string;
  category: "O'Level" | "Advanced" | "Private";
  fee: number; // in NGN (₦) — default/standard plan, used where a single price is shown
  billingCycle: "Termly" | "Monthly" | "Annual";
  registrationFee: number; // in NGN (₦)
  scheduleOptions: string[];
  description: string;
  features: string[];
  popular?: boolean;
  // Optional alternate pricing plans a student can choose between at
  // registration (e.g. a discounted local-resident rate). When present,
  // the registration form lets the applicant pick one instead of the
  // default fee/billingCycle above.
  feePlans?: FeePlan[];
}

export const PROGRAMMES: Programme[] = [
  {
    id: "beginners",
    name: "Beginners Classes",
    subtitle: "Qa'idah & Introductory Qur'an",
    category: "O'Level",
    fee: 25000,
    billingCycle: "Termly",
    registrationFee: 5000,
    scheduleOptions: [
      "Mon - Thu (4:00 PM - 6:00 PM)",
      "Sat - Sun (9:00 AM - 1:00 PM)",
    ],
    description: "Designed for beginners starting from Arabic alphabet pronunciation (Qa'idah) through to fluent recitation of Juz 'Amma. Every new student begins with a 2-month Tajweed onboarding phase before progressing into memorization.",
    features: [
      "2-month Tajweed onboarding phase",
      "Onboarding assessment (70% pass mark, 80% target)",
      "Direct progression into memorization training",
      "Makharij & Tajweed fundamentals",
      "One-on-one reading correction",
      "Basic Islamic studies & Adab",
      "Termly assessment & progress report",
    ],
    feePlans: [
      {
        id: "termly-standard",
        label: "Termly (Standard)",
        fee: 25000,
        billingCycle: "Termly",
      },
      {
        id: "monthly-ng",
        label: "Monthly — Nigerian Residents Only",
        fee: 7000,
        billingCycle: "Monthly",
        nigeriansOnly: true,
      },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate Classes",
    subtitle: "Qur'an Recitation & Hifzh Foundation",
    category: "O'Level",
    fee: 35000,
    billingCycle: "Termly",
    registrationFee: 5000,
    scheduleOptions: [
      "Mon - Thu (4:30 PM - 6:30 PM)",
      "Sat - Sun (9:00 AM - 1:30 PM)",
    ],
    popular: true,
    description: "For students who can read Qur'an and want to master Tajweed rules and begin structured memorization of short Surahs.",
    features: [
      "Applied Tajweed rules & Ahkam",
      "Memorization of Juz 28 - 30",
      "Daily revision (Muraajah) system",
      "Monthly recitation evaluations",
    ],
  },
  {
    id: "advanced",
    name: "Advanced Classes",
    subtitle: "Full Hifzh & Qira'at Specialization",
    category: "Advanced",
    fee: 45000,
    billingCycle: "Termly",
    registrationFee: 5000,
    scheduleOptions: [
      "Mon - Fri (6:00 AM - 8:00 AM)",
      "Mon - Thu (5:00 PM - 7:30 PM)",
      "Sat - Sun (8:00 AM - 2:00 PM)",
    ],
    description: "Intensive memorization program aiming for full Qur'an completion with strong retention, precision, and certification prep.",
    features: [
      "Customized daily Hifzh quota",
      "Rigorous dual-cycle Muraajah",
      "Tafseer & Vocabulary highlights",
      "Preparation for Ijazah certification",
    ],
  },
  {
    id: "private",
    name: "Private Classes",
    subtitle: "1-on-1 Dedicated Tutor",
    category: "Private",
    fee: 60000,
    billingCycle: "Monthly",
    registrationFee: 10000,
    scheduleOptions: [
      "Flexible Weekday Evening Slots",
      "Flexible Weekend Morning Slots",
      "Custom Schedule (3 Sessions / week)",
    ],
    description: "Individual 1-on-1 coaching customized to your exact learning speed, availability, and specific memorization targets.",
    features: [
      "100% Personal student attention",
      "Customized learning pace & timetable",
      "Direct tutor feedback & recording review",
      "Parent/Guardian weekly progress calls",
    ],
  },
  {
    id: "muraajah",
    name: "Muraajah Classes",
    subtitle: "Qur'an Revision & Retention",
    category: "Advanced",
    fee: 30000,
    billingCycle: "Termly",
    registrationFee: 5000,
    scheduleOptions: [
      "Mon - Wed (5:00 PM - 7:00 PM)",
      "Sat - Sun (10:00 AM - 1:00 PM)",
    ],
    description: "Tailored specifically for Huffaz (memorizers) needing structured, disciplined revision to consolidate and strengthen past Hifzh.",
    features: [
      "Systematic Mutashabihat (similar verses) review",
      "High-volume daily recitation target",
      "Weak area diagnostic & tracking",
      "Mock exams & speed drills",
    ],
  },
  {
    id: "tajweed-private",
    name: "Private Tajweed Masterclass",
    subtitle: "Theoretical & Practical Tajweed Mastery",
    category: "Private",
    fee: 50000,
    billingCycle: "Monthly",
    registrationFee: 10000,
    scheduleOptions: [
      "Tue & Thu (7:00 PM - 8:30 PM)",
      "Sat (3:00 PM - 6:00 PM)",
    ],
    description: "In-depth study of Tajweed texts (Jazariyyah, Tuhfatul Atfal) paired with precise practical voice and articulation coaching.",
    features: [
      "Classical Tajweed poem commentary",
      "Precise Sifat & Makharij training",
      "Voice recording assessment",
      "Ijazah readiness evaluation",
    ],
  },
];

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  BISMILLAH10: {
    code: "BISMILLAH10",
    discountPercentage: 10,
    description: "10% Welcome Discount for new students",
  },
  ACADEMY20: {
    code: "ACADEMY20",
    discountPercentage: 20,
    description: "20% Early Bird Scholarship Discount",
  },
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
