"use client";

import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Clock3,
    Plane,
} from "lucide-react";

import { useRouter } from "next/navigation";
import {
    useEffect,
    useState,
    useCallback,
    useRef,
} from "react";

import { toast } from "sonner";

import {
    getQuestionByIndex,
    saveAnswer,
    submitExam,
    registerViolation,
} from "@/lib/actions/exam";

import { BackendQuestion } from "@/types/exam";


export default function Exam() {

    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);

    const [totalQuestions, setTotalQuestions] =
        useState(0);

    const [question, setQuestion] =
        useState<BackendQuestion | null>(null);

    const [selectedOption, setSelectedOption] =
        useState<string | null>(null);

    const [answeredMap, setAnsweredMap] =
        useState<Record<number, string>>({});

    const [examEndTime, setExamEndTime] =
        useState<string | null>(null);

    const [timeLeft, setTimeLeft] =
        useState(0);

    const [violations, setViolations] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const submittedRef =
        useRef(false);

    const options = question
        ? [
            {
                letter: "A",
                text: question.optionA,
            },
            {
                letter: "B",
                text: question.optionB,
            },
            {
                letter: "C",
                text: question.optionC,
            },
            {
                letter: "D",
                text: question.optionD,
            },
        ]
        : [];

    const handleSubmit = useCallback(
        async (auto = false) => {
            if (submittedRef.current) {
                return;
            }

            try {

                submittedRef.current = true;

                await submitExam();

                toast.success(
                    auto
                        ? "Time's up! Exam auto-submitted."
                        : "Exam submitted successfully"
                );

                router.push(
                    "/user-dashboard/result"
                );

            } catch (error) {
                submittedRef.current = false;
                console.error(
                    "SUBMIT EXAM ERROR:",
                    error
                );

                toast.error(
                    "Failed to submit exam"
                );
            }
        },
        [router]
    );


    // ==========================================
    // LOAD QUESTION
    // ==========================================

    const loadQuestion = useCallback(
        async (index: number) => {

            try {

                setLoading(true);

                console.log(
                    "Loading question index:",
                    index
                );
                const data =await getQuestionByIndex(index);

                console.log(
                    "QUESTION RESPONSE:",
                    data
                );

                setQuestion(data.question);
                setCurrentIndex(data.index);
                setTotalQuestions(
                    data.totalQuestions
                );
                setExamEndTime(
                    data.examEndTime
                );

                setSelectedOption(
                    data.selectedOption ?? null
                );

                if (
                    data.selectedOption &&
                    data.question?.id
                ) {

                    setAnsweredMap(
                        (prev) => ({
                            ...prev,
                            [data.question.id]:
                                data.selectedOption,
                        })
                    );
                }

            } catch (error: any) {

                console.error(
                    "LOAD QUESTION ERROR:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to load question"
                );

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ==========================================
    // INITIAL QUESTION
    // ==========================================

    useEffect(() => {

        loadQuestion(0);

    }, [loadQuestion]);


    // ==========================================
    // TIMER
    // ==========================================

    useEffect(() => {

        if (!examEndTime) {
            return;
        }

        const calculateTime = () => {

            const end =
                new Date(examEndTime).getTime();

            const now =
                Date.now();

            const diff = Math.max(
                0,
                Math.floor(
                    (end - now) / 1000
                )
            );

            setTimeLeft(diff);

            if (
                diff <= 0 &&
                !submittedRef.current
            ) {

                handleSubmit(true);
            }
        };


        calculateTime();

        const interval =
            setInterval(
                calculateTime,
                1000
            );


        return () => {
            clearInterval(interval);
        };

    }, [
        examEndTime,
        handleSubmit,
    ]);


    // ==========================================
    // TAB SWITCH / MINIMIZE
    // ==========================================

    useEffect(() => {

        const handleVisibility = async () => {

            if (
                document.hidden &&
                !submittedRef.current
            ) {

                try {

                    const updated =
                        await registerViolation();

                    setViolations(
                        updated.violationCount
                    );


                    if (
                        updated.status !==
                        "IN_PROGRESS"
                    ) {

                        submittedRef.current =
                            true;

                        toast.error(
                            "Exam auto-submitted due to violations"
                        );

                        router.push(
                            "/user-dashboard/result"
                        );
                    }

                } catch (error) {

                    console.error(
                        "VIOLATION ERROR:",
                        error
                    );
                }
            }
        };


        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );


        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );

        };

    }, [router]);


    // ==========================================
    // ANSWER
    // ==========================================

    const handleAnswer = async (
        letter: string
    ) => {

        if (!question) {
            return;
        }

        setSelectedOption(letter);

        setAnsweredMap(
            (prev) => ({
                ...prev,
                [question.id]: letter,
            })
        );


        try {

            await saveAnswer(
                question.id,
                letter
            );

        } catch (error) {

            console.error(
                "SAVE ANSWER ERROR:",
                error
            );

            toast.error(
                "Failed to save answer"
            );
        }
    };


    // ==========================================
    // NEXT
    // ==========================================

    const goNext = () => {

        if (
            currentIndex <
            totalQuestions - 1
        ) {

            loadQuestion(
                currentIndex + 1
            );
        }
    };


    // ==========================================
    // PREVIOUS
    // ==========================================

    const goPrevious = () => {

        if (currentIndex > 0) {

            loadQuestion(
                currentIndex - 1
            );
        }
    };


    // ==========================================
    // QUESTION PALETTE CLICK
    // ==========================================

    const goToQuestion = (
        index: number
    ) => {

        if (
            index < 0 ||
            index >= totalQuestions
        ) {
            return;
        }

        loadQuestion(index);
    };


    // ==========================================
    // FORMAT TIMER
    // ==========================================

    const formatTime = (
        seconds: number
    ) => {

        const m =
            Math.floor(
                seconds / 60
            )
                .toString()
                .padStart(2, "0");

        const s =
            (seconds % 60)
                .toString()
                .padStart(2, "0");

        return `${m}:${s}`;
    };


    // ==========================================
    // ANSWER COUNT
    // ==========================================

    const answeredCount =
        Object.keys(answeredMap).length;


    // ==========================================
    // LOADING
    // ==========================================

    if (
        loading ||
        !question
    ) {

        return (
            <div className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-[#063528]
                text-white
            ">
                Loading question...
            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="
            min-h-screen
            bg-[#063528]
            text-white
        ">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <header className="
                fixed
                inset-x-0
                top-0
                z-50
                h-[72px]
                border-b
                border-[#174d3e]
                bg-[#0b4435]
            ">

                <div className="
                    flex
                    h-full
                    items-center
                    justify-between
                    px-7
                ">

                    {/* Logo */}

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-[#f9a825]
                        ">

                            <Plane
                                size={21}
                                className="
                                    -rotate-12
                                    text-[#07372a]
                                "
                                strokeWidth={2}
                            />

                        </div>

                        <div>

                            <h1 className="
                                text-[15px]
                                font-bold
                                leading-5
                                text-white
                            ">
                                {question.category}
                            </h1>

                            <p className="
                                text-[10px]
                                text-[#6d9589]
                            ">
                                Vayuratha Test Portal
                            </p>

                        </div>

                    </div>


                    {/* Header Right */}

                    <div className="
                        flex
                        items-center
                        gap-5
                    ">

                        {/* Violations */}

                        <div className="
                            flex
                            h-9
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#285d4d]
                            bg-[#0d4939]
                            px-4
                            text-xs
                            font-semibold
                            text-[#7d9e95]
                        ">

                            <AlertTriangle
                                size={16}
                            />

                            <span>
                                Violations:
                                {" "}
                                {violations}/3
                            </span>

                        </div>


                        {/* Progress */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <span className="
                                text-xs
                                text-[#7c9b92]
                            ">
                                Q
                                {currentIndex + 1}
                                /
                                {totalQuestions}
                            </span>

                            <div className="
                                h-[5px]
                                w-24
                                overflow-hidden
                                rounded-full
                                bg-[#27584a]
                            ">

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-[#f9a825]
                                    "
                                    style={{
                                        width:
                                            `${totalQuestions
                                                ? (
                                                    (
                                                        currentIndex + 1
                                                    ) /
                                                    totalQuestions
                                                ) * 100
                                                : 0
                                            }%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* Timer */}

                        <div className="
                            flex
                            h-10
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#315f50]
                            bg-[#0d4939]
                            px-4
                            text-sm
                            font-bold
                        ">

                            <Clock3
                                size={18}
                            />

                            <span>
                                {formatTime(
                                    timeLeft
                                )}
                            </span>

                        </div>


                        {/* Submit */}

                        <button
                            type="button"
                            onClick={() =>
                                handleSubmit(false)
                            }
                            className="
                                h-10
                                rounded-full
                                bg-[#f9a825]
                                px-5
                                text-sm
                                font-bold
                                text-[#07372a]
                                shadow-[0_8px_20px_rgba(249,168,37,0.2)]
                                transition
                                hover:bg-[#ffb52e]
                            "
                        >
                            Submit Exam
                        </button>

                    </div>

                </div>

            </header>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main className="pt-[72px]">

                <div className="
                    flex
                    min-h-[calc(100vh-72px)]
                ">


                    {/* ================================= */}
                    {/* QUESTION AREA */}
                    {/* ================================= */}

                    <section className="
                        flex
                        flex-1
                        justify-center
                        px-8
                        py-10
                    ">

                        <div className="
                            w-full
                            max-w-[805px]
                        ">

                            {/* Question Card */}

                            <div className="
                                rounded-[19px]
                                border
                                border-[#205746]
                                bg-[#0d4939]
                                px-[34px]
                                py-[34px]
                            ">

                                {/* Question Header */}

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <span className="
                                        text-[12px]
                                        font-bold
                                        tracking-[1px]
                                        text-[#f9a825]
                                    ">
                                        QUESTION
                                        {" "}
                                        {currentIndex + 1}
                                    </span>

                                    <span className="
                                        rounded-full
                                        border
                                        border-[#7b671e]
                                        bg-[#f9a825]/10
                                        px-3
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-[#f9a825]
                                    ">
                                        {question.category}
                                    </span>

                                </div>


                                {/* Question */}

                                <h2 className="
                                    mt-7
                                    text-[19px]
                                    font-semibold
                                    leading-7
                                    text-white
                                ">
                                    {question.questionText}
                                </h2>


                                {/* Options */}

                                <div className="
                                    mt-8
                                    flex
                                    flex-col
                                    gap-3
                                ">

                                    {options.map(
                                        (opt) => {

                                            const isSelected =
                                                selectedOption ===
                                                opt.letter;

                                            return (

                                                <button
                                                    key={
                                                        opt.letter
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleAnswer(
                                                            opt.letter
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        min-h-[79px]
                                                        w-full
                                                        items-center
                                                        gap-5
                                                        rounded-[18px]
                                                        border
                                                        px-6
                                                        text-left
                                                        transition-all

                                                        ${isSelected
                                                            ? `
                                                                    border-[#f9a825]
                                                                    bg-[#f9a825]/10
                                                                    shadow-[0_0_0_1px_rgba(249,168,37,0.2)]
                                                                `
                                                            : `
                                                                    border-[#275d4d]
                                                                    bg-white/[0.025]
                                                                    hover:border-[#47796a]
                                                                    hover:bg-white/[0.045]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            flex
                                                            h-[39px]
                                                            w-[39px]
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            text-[15px]
                                                            font-bold

                                                            ${isSelected
                                                                ? `
                                                                        bg-[#f9a825]
                                                                        text-[#07372a]
                                                                    `
                                                                : `
                                                                        bg-[#276051]
                                                                        text-[#91aaa3]
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            opt.letter
                                                        }
                                                    </span>

                                                    <span
                                                        className={`
                                                            text-[16px]
                                                            font-medium

                                                            ${isSelected
                                                                ? "text-white"
                                                                : "text-[#9ab7af]"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            opt.text
                                                        }
                                                    </span>

                                                </button>

                                            );
                                        }
                                    )}

                                </div>

                            </div>


                            {/* Previous / Next */}

                            <div className="
                                mt-6
                                flex
                                items-center
                                justify-between
                            ">

                                <button
                                    type="button"
                                    onClick={
                                        goPrevious
                                    }
                                    disabled={
                                        currentIndex ===
                                        0
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-sm
                                        font-semibold
                                        text-[#55776d]
                                        transition
                                        hover:text-white
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    <ArrowLeft
                                        size={17}
                                    />

                                    Previous

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        goNext
                                    }
                                    disabled={
                                        currentIndex ===
                                        totalQuestions - 1
                                    }
                                    className="
                                        flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-[#f9a825]
                                        px-6
                                        text-sm
                                        font-bold
                                        text-[#07372a]
                                        shadow-[0_8px_20px_rgba(249,168,37,0.16)]
                                        transition
                                        hover:bg-[#ffb52e]
                                        disabled:opacity-40
                                    "
                                >

                                    Next

                                    <ArrowRight
                                        size={17}
                                    />

                                </button>

                            </div>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* QUESTION PALETTE */}
                    {/* ================================= */}

                    <aside className="
                        hidden
                        w-[305px]
                        shrink-0
                        border-l
                        border-[#174d3e]
                        bg-[#063326]
                        px-6
                        py-6
                        lg:block
                    ">

                        <h3 className="
                            text-[10px]
                            font-bold
                            tracking-[1.5px]
                            text-[#76988f]
                        ">
                            QUESTION PALETTE
                        </h3>


                        {/* Legend */}

                        <div className="
                            mt-5
                            flex
                            items-center
                            gap-4
                            text-[11px]
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <span className="
                                    h-3
                                    w-3
                                    rounded-full
                                    bg-[#f9a825]"
                                />

                                <span className="text-[#77998f]">
                                    Answered
                                </span>

                            </div>


                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <span className="
                                    h-3
                                    w-3
                                    rounded-full
                                    bg-[#294f44]"
                                />

                                <span className="
                                    text-[#77998f]
                                ">
                                    Pending
                                </span>

                            </div>

                        </div>


                        {/* Question Numbers */}

                        <div className="
                            mt-5
                            grid
                            grid-cols-5
                            gap-4
                        ">

                            {Array.from({
                                length:
                                    totalQuestions,
                            }).map(
                                (_, index) => {

                                    const isCurrent =
                                        currentIndex ===
                                        index;

                                    const isAnswered =
                                        question &&
                                        answeredMap[
                                        question.id
                                        ];


                                    return (

                                        <button
                                            key={
                                                index
                                            }
                                            type="button"
                                            onClick={() =>
                                                goToQuestion(
                                                    index
                                                )
                                            }
                                            className={`
                                                flex
                                                h-[47px]
                                                w-[47px]
                                                items-center
                                                justify-center
                                                rounded-[14px]
                                                text-sm
                                                font-semibold
                                                transition

                                                ${isCurrent
                                                    ? `
                                                            border-2
                                                            border-[#f9a825]
                                                            bg-[#f9a825]
                                                            text-[#07372a]
                                                        `
                                                    : isAnswered
                                                        ? `
                                                                border
                                                                border-[#f9a825]
                                                                bg-[#f9a825]/15
                                                                text-[#f9a825]
                                                            `
                                                        : `
                                                                bg-[#174a3b]
                                                                text-[#708f87]
                                                                hover:bg-[#215442]
                                                            `
                                                }
                                            `}
                                        >
                                            {index + 1}
                                        </button>

                                    );

                                }
                            )}

                        </div>


                        {/* Summary */}

                        <div className="
                            mt-7
                            rounded-[18px]
                            border
                            border-[#28594b]
                            bg-white/[0.035]
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <span className="
                                    text-sm
                                    text-[#71968c]
                                ">
                                    Answered
                                </span>

                                <span className="
                                    text-sm
                                    font-bold
                                    text-[#f9a825]
                                ">
                                    {answeredCount}
                                </span>

                            </div>


                            <div className="
                                mt-5
                                flex
                                items-center
                                justify-between
                            ">

                                <span className="
                                    text-sm
                                    text-[#71968c]
                                ">
                                    Pending
                                </span>

                                <span className="
                                    text-sm
                                    font-bold
                                    text-[#71968c]
                                ">
                                    {
                                        Math.max(
                                            0,
                                            totalQuestions -
                                            answeredCount
                                        )
                                    }
                                </span>

                            </div>

                        </div>

                    </aside >

                </div >

            </main >

        </div >
    );
}