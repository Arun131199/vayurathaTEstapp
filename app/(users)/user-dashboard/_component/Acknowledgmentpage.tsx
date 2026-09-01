"use client"

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type TestDetails = {
    testName: string
    testDate: string
    reportingTime: string
    startTime: string
    durationMinutes: number
    officeLocationUrl?: string
    whatsappSupport?: string
}

// Swap these values per test — nothing below is hard-coded to a specific event.
const DEFAULT_DETAILS: TestDetails = {
    testName: "Scholarship Test",
    testDate: "TBA",
    reportingTime: "10:45 AM",
    startTime: "11:00 AM",
    durationMinutes: 45,
    officeLocationUrl: "https://maps.app.goo.gl/NtH8woXRbfc9BkEe6",
    whatsappSupport: "+91 93848 06205",
}

export default function AcknowledgmentPage({ details = DEFAULT_DETAILS }: { details?: TestDetails }) {
    const router = useRouter()
    const [agreed, setAgreed] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const endTime = details.startTime // display only; portal auto-closes after duration

    const handleContinue = async () => {
        if (!agreed) return
        setSubmitting(true)
        try {
            // Persist acknowledgment server-side here if needed, e.g.:
            // await acknowledgeRulesAction()
            router.push("/user-dashboard")
            router.refresh()
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150 md:p-10">
            <header className="mb-8">
                <p className="text-sm font-semibold tracking-wide text-white/60">
                    Rules &amp; Regulations
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                    Before you begin the {details.testName}
                </h1>
                <p className="mt-2 text-sm text-white/70">
                    Please read the points below carefully. You'll need to confirm you understand
                    them before the test portal unlocks for you.
                </p>
            </header>

            <div className="space-y-6 text-sm text-white/80">
                <Section title="Test schedule">
                    <Row label="Date">{details.testDate}</Row>
                    <Row label="Reporting time">{details.reportingTime}</Row>
                    <Row label="Start time">Sharp at {details.startTime}</Row>
                    <Row label="Duration">{details.durationMinutes} minutes</Row>
                    <p className="mt-2 text-white/60">
                        The portal is only active during the test window and closes automatically
                        once it ends — there's no way to restart it after that.
                    </p>
                </Section>

                <Section title="Login details">
                    <ul className="list-disc space-y-1.5 pl-5">
                        <li>Use the same registered email and 10-digit mobile number you signed up with.</li>
                        <li>Access instructions are shared in the meeting chat shortly before the test starts.</li>
                    </ul>
                </Section>

                <Section title="During the test">
                    <ul className="list-disc space-y-1.5 pl-5">
                        <li>Join a few minutes before the reporting time for attendance and verification.</li>
                        <li>Keep your camera on for the full duration if you're taking the test online.</li>
                        <li>A laptop or desktop is strongly recommended; a phone should only be a last resort.</li>
                        <li>Make sure your device is charged and your internet connection is stable.</li>
                        <li>Sit somewhere quiet, and stay connected for the entire test.</li>
                    </ul>
                </Section>

                <Section title="Fair-use monitoring">
                    <ul className="list-disc space-y-1.5 pl-5">
                        <li>Don't switch browsers, browser tabs, or open other applications.</li>
                        <li>Don't seek outside help, or copy, share, or capture test content.</li>
                        <li>Don't let anyone else take the test on your behalf.</li>
                    </ul>
                    <p className="mt-2 rounded-xl bg-white/5 p-3 text-white/70">
                        Switching applications or tabs may trigger an automatic submission. Once
                        that happens, the attempt can't be restarted or retaken, and it may be
                        marked invalid — so please treat this window as a one-shot attempt.
                    </p>
                </Section>

                <Section title="Technical issues">
                    <p>
                        Flag any genuine technical problem to the invigilator immediately. It'll be
                        reviewed case by case, but a retest isn't guaranteed.
                    </p>
                </Section>

                {(details.officeLocationUrl || details.whatsappSupport) && (
                    <Section title="Need help?">
                        {details.whatsappSupport && (
                            <Row label="WhatsApp support">{details.whatsappSupport}</Row>
                        )}
                        {details.officeLocationUrl && (
                            <a
                                href={details.officeLocationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-[#f5a623] underline underline-offset-2 hover:text-[#e8a229]"
                            >
                                Office location
                            </a>
                        )}
                    </Section>
                )}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-white/80">
                    <Checkbox
                        checked={agreed}
                        onCheckedChange={(v) => setAgreed(v === true)}
                        className="mt-0.5"
                    />
                    <span>
                        I've read and understood the rules above, and I agree to follow them for
                        the duration of the test.
                    </span>
                </label>

                <Button
                    type="button"
                    disabled={!agreed || submitting}
                    onClick={handleContinue}
                    className="mt-6 h-12.5 w-full bg-[#e8a229] font-semibold text-[#0c2d24] transition hover:bg-[#0c2d24] hover:text-[#e8a229] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Continuing..." : "I Agree, Continue"}
                </Button>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="mb-2 text-base font-semibold text-white">{title}</h2>
            <div className="text-white/80">{children}</div>
        </section>
    )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <p className="flex justify-between gap-4 py-0.5">
            <span className="text-white/60">{label}</span>
            <span className="font-medium text-white">{children}</span>
        </p>
    )
}