import { ExamAttempt } from "@/types/examAttempt";

export const examAttempts: ExamAttempt[] = [
    {
        id: 1,
        student: "Arjun Mehta",
        exam: "DGCA Part 1 – Regulations",
        score: 87,
        date: "2026-08-01",
        status: "PASS",

        answered: 30,
        totalQuestions: 30,
        correct: 26,
        timeTaken: 38,
        violations: 0,
    },

    {
        id: 2,
        student: "Priya Nair",
        exam: "Weather & Meteorology",
        score: 62,
        date: "2026-08-02",
        status: "FAIL",

        answered: 28,
        totalQuestions: 30,
        correct: 19,
        timeTaken: 42,
        violations: 1,
    },

    {
        id: 3,
        student: "Rahul Singh",
        exam: "Air Traffic Procedures",
        score: 91,
        date: "2026-08-03",
        status: "PASS",

        answered: 30,
        totalQuestions: 30,
        correct: 27,
        timeTaken: 35,
        violations: 0,
    },

    {
        id: 4,
        student: "Deepa Varma",
        exam: "UAV Systems & Maintenance",
        score: 74,
        date: "2026-08-04",
        status: "PASS",

        answered: 29,
        totalQuestions: 30,
        correct: 22,
        timeTaken: 41,
        violations: 0,
    },

    {
        id: 5,
        student: "Vikram Patel",
        exam: "Emergency Protocols",
        score: 55,
        date: "2026-08-05",
        status: "FAIL",

        answered: 27,
        totalQuestions: 30,
        correct: 16,
        timeTaken: 46,
        violations: 2,
    },

    {
        id: 6,
        student: "Sneha Iyer",
        exam: "DGCA Part 1 – Regulations",
        score: 81,
        date: "2026-08-06",
        status: "PASS",

        answered: 30,
        totalQuestions: 30,
        correct: 24,
        timeTaken: 36,
        violations: 0,
    },
];