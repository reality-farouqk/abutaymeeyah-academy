"use client";

import { useState, useEffect } from "react";
import { PROGRAMMES, formatNaira } from "@/lib/programmes";

interface RegistrationFormProps {
  initialProgrammeId?: string;
  onSuccess?: (registrationData: any) => void;
  submitButtonText?: string;
}

export default function RegistrationForm({
  initialProgrammeId = "beginners",
  onSuccess,
  submitButtonText = "Continue to Payment",
}: RegistrationFormProps) {
  const [programmeId, setProgrammeId] = useState(initialProgrammeId);
  const [feePlanId, setFeePlanId] = useState("");
  const [schedule, setSchedule] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [nationality, setNationality] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProgramme = PROGRAMMES.find((p) => p.id === programmeId) || PROGRAMMES[0];

  // Only offer Nigerians-only plans once nationality is confirmed as Nigerian.
  const availableFeePlans = selectedProgramme.feePlans?.filter(
    (p) => !p.nigeriansOnly || nationality === "Nigerian"
  );
  const selectedFeePlan = availableFeePlans?.find((p) => p.id === feePlanId);
  const displayFee = selectedFeePlan ? selectedFeePlan.fee : selectedProgramme.fee;
  const displayBillingCycle = selectedFeePlan ? selectedFeePlan.billingCycle : selectedProgramme.billingCycle;

  // Keep the chosen fee plan valid as the programme or nationality changes
  // (e.g. switching away from "Nigerian" should drop a Nigerians-only plan).
  useEffect(() => {
    if (availableFeePlans && availableFeePlans.length > 0) {
      if (!availableFeePlans.find((p) => p.id === feePlanId)) {
        setFeePlanId(availableFeePlans[0].id);
      }
    } else if (feePlanId) {
      setFeePlanId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmeId, nationality]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/registration/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programmeId,
          feePlanId: feePlanId || undefined,
          schedule: schedule || selectedProgramme.scheduleOptions[0],
          studentName,
          studentAge: Number(studentAge),
          gender,
          nationality,
          previousExperience,
          parentName,
          email,
          phone,
          whatsapp,
          address,
          emergencyContact,
          notes,
          promoCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      if (onSuccess) {
        onSuccess(data.registration);
      } else {
        window.location.href = `/enroll?step=2&ref=${data.registration.reference}`;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Student Details Section */}
      <div>
        <h3 className="font-display text-lg text-navy border-b border-navy/10 pb-2 mb-4">
          1. Student Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="text-sm font-medium text-navy/80">
            Student Full Name *
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Abdallah Umar"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-navy/80">
              Age *
              <input
                type="number"
                required
                min="4"
                max="80"
                value={studentAge}
                onChange={(e) => setStudentAge(e.target.value)}
                placeholder="Age"
                className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
              />
            </label>

            <label className="text-sm font-medium text-navy/80">
              Gender *
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

          <label className="text-sm font-medium text-navy/80">
            Nationality *
            <select
              required
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            >
              <option value="">Select nationality…</option>
              <option value="Nigerian">Nigerian</option>
              <option value="Other">Other (International)</option>
            </select>
          </label>

          <label className="text-sm font-medium text-navy/80">
            Programme *
            <select
              value={programmeId}
              onChange={(e) => {
                setProgrammeId(e.target.value);
                setSchedule("");
              }}
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none font-medium"
            >
              {PROGRAMMES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.billingCycle})
                </option>
              ))}
            </select>
          </label>

          {availableFeePlans && availableFeePlans.length > 0 && (
            <label className="sm:col-span-2 text-sm font-medium text-navy/80">
              Fee Plan *
              <select
                required
                value={feePlanId}
                onChange={(e) => setFeePlanId(e.target.value)}
                className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
              >
                {availableFeePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {formatNaira(p.fee)} / {p.billingCycle.toLowerCase()}
                  </option>
                ))}
              </select>
              {selectedProgramme.feePlans?.some((p) => p.nigeriansOnly) && nationality !== "Nigerian" && (
                <span className="mt-1.5 block text-xs text-navy/50 font-normal">
                  A discounted monthly plan is available to students with Nigerian nationality.
                </span>
              )}
            </label>
          )}

          <div className="sm:col-span-2 flex items-baseline justify-between rounded-sm bg-mist border border-navy/10 px-4 py-3">
            <span className="text-xs font-medium text-navy/60">
              Selected: {selectedFeePlan ? selectedFeePlan.label : `${selectedProgramme.name} (${displayBillingCycle})`}
            </span>
            <span className="font-mono text-sm font-semibold text-navy">
              {formatNaira(displayFee)} <span className="text-xs font-normal text-navy/50">/ {displayBillingCycle.toLowerCase()}</span>
            </span>
          </div>

          <label className="text-sm font-medium text-navy/80">
            Preferred Schedule Slot
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            >
              {selectedProgramme.scheduleOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Parent/Guardian Details Section */}
      <div>
        <h3 className="font-display text-lg text-navy border-b border-navy/10 pb-2 mb-4">
          2. Parent / Guardian Contact Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="text-sm font-medium text-navy/80">
            Parent / Guardian Name *
            <input
              type="text"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g., Suleiman Mailafiya"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <label className="text-sm font-medium text-navy/80">
            Email Address (for receipt & updates) *
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <label className="text-sm font-medium text-navy/80">
            Phone Number *
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 08012345678"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <label className="text-sm font-medium text-navy/80">
            WhatsApp Number
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g., 08012345678"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-navy/80">
            Home Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street Address, City, State"
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>
        </div>
      </div>

      {/* Additional Learning Background */}
      <div>
        <h3 className="font-display text-lg text-navy border-b border-navy/10 pb-2 mb-4">
          3. Learning Background & Special Notes
        </h3>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-navy/80">
            Previous Qur&apos;anic Learning / Memorization Level
            <textarea
              rows={2}
              value={previousExperience}
              onChange={(e) => setPreviousExperience(e.target.value)}
              placeholder="e.g., Has completed Qa'idah Nooraniyyah, currently memorizing Juz 29."
              className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-navy/80">
              Emergency Contact Name & Phone
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g., Uncle Usman - 08098765432"
                className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
              />
            </label>

            <label className="text-sm font-medium text-navy/80">
              Promo / Scholarship Code
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g., BISMILLAH10"
                className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm font-mono text-navy focus-ring outline-none uppercase"
              />
            </label>
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-navy/75 pt-2">
        <input type="checkbox" required className="mt-1 focus-ring" />
        <span>
          I confirm that the details provided above are accurate and I agree to Abu Taymeeyah Academy&apos;s code of conduct and registration terms.
        </span>
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-navy px-8 py-4 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Creating Registration...
            </span>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}
