"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createExam } from "@/lib/actions/exam";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ExamCreationProps {
    exams: any[];
}

export default function ExamCreation({ exams }: ExamCreationProps) {
    const { control, handleSubmit, reset, formState: { errors }, register } = useForm({
        defaultValues: {
            title: "",
            category: "",
            questionCount: "",
            durationMinutes: ""
        }
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log(exams)

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);

            const payload = {
                title: data.title,
                category: data.category,
                questionCount: Number(data.questionCount),
                durationMinutes: Number(data.durationMinutes),
            };

            const response = await createExam(payload);
            toast.success("Exam created successfully");

            reset();

        } catch (error: any) {
            toast.error(
                error?.message || "Failed to create exam"
            );

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <form
                className="border border-amber-400 p-7 rounded-md shadow-xl bg-white/10 flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Title</FieldLabel>
                            <Controller
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        className="h-12"
                                        placeholder="Enter title of you exam"
                                    />
                                )}
                            />
                            {
                                errors.title && (
                                    <div>
                                        <p className="text-red-50 text-sm">{errors?.title?.message}</p>
                                    </div>
                                )
                            }
                        </Field>

                    </FieldGroup>
                </FieldSet>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Category</FieldLabel>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        className="h-12"
                                        placeholder="Enter the Category"
                                    />
                                )}
                            />
                            {
                                errors.category && (
                                    <div>
                                        <p className="text-red-50 text-sm">{errors?.category?.message}</p>
                                    </div>
                                )
                            }
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Question Count</FieldLabel>
                            <Controller
                                control={control}
                                name="questionCount"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        className="h-12"
                                        placeholder="Enter question count"
                                    />
                                )}
                            />
                            {
                                errors.questionCount && (
                                    <div>
                                        <p className="text-red-50 text-sm">{errors?.questionCount?.message}</p>
                                    </div>
                                )
                            }
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Duration Minutes</FieldLabel>
                            <Controller
                                control={control}
                                name="durationMinutes"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        className="h-12"
                                        placeholder="Enter test duration"
                                    />
                                )}
                            />
                            {
                                errors.durationMinutes && (
                                    <div>
                                        <p className="text-red-50 text-sm">{errors?.durationMinutes?.message}</p>
                                    </div>
                                )
                            }
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Button
                    type="submit"
                    variant={"default"}
                    size={"lg"}
                    className={"h-10 bg-amber-500 cursor-pointer text-green-950 hover:text-amber-500"}
                >
                    {
                        isSubmitting ? (
                            <span className="animate-spin">
                                <LoaderCircle />
                            </span>
                        ) : (
                            <span className="font-semibold">Create Exam</span>
                        )
                    }
                </Button>
            </form>
        </div>
    )
}