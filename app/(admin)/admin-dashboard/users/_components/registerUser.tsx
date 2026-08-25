"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addUsers } from "@/lib/api/users";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner";

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    role: string;
};

export default function RegisterUser() {
    const { control, formState: { errors }, reset, watch, handleSubmit } = useForm<RegisterForm>({
        defaultValues: {
            fullName: "",
            email: "",
            mobile: "",
            password: "",
            role: "USER"
        }
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            await addUsers(data);
            toast.success("User registered successfully!");
            reset();
        } catch (error) {
            toast.error("Failed to register user. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form
                className="max-w-5xl mx-auto border border-gray-600 p-4 rounded-md bg-white/10 px-10 py-4 flex flex-col ga-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-8">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    FULL NAME
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="fullName"
                                    rules={{
                                        required: "Full Name is required"
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="ex. Arun"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {
                                    errors.fullName && (
                                        <div>
                                            <p className="text-red-50 text-sm">{errors.fullName.message}</p>
                                        </div>
                                    )
                                }
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    EMAIL ADDRESS
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "Email Address Required"
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="ex. Arun@gmail.com"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {
                                    errors.email && (
                                        <div>
                                            <p className="text-red-50 text-sm">{errors.email.message}</p>
                                        </div>
                                    )
                                }
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    MOBILE NUMBER
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="mobile"
                                    rules={{
                                        required: "Mobile Number is Required"
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="ex. 9876543210"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {
                                    errors.mobile && (
                                        <div>
                                            <p className="text-red-50 text-sm">{errors.mobile.message}</p>
                                        </div>
                                    )
                                }
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    PASSWORD
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: "Password is required",
                                        minLength: {
                                            value: 10,
                                            message: "Password must be at least 8 characters"
                                        },

                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Min.8 characters"
                                            className="h-12"
                                        />
                                    )}
                                />
                                {
                                    errors.password && (
                                        <div>
                                            <p className="text-red-50 text-sm">{errors.password.message}</p>
                                        </div>
                                    )
                                }
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    ROLE
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled
                                            value={"USER"}
                                            className="h-12"
                                        />
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Button
                        type="submit"
                        className={"h-15 w-full bg-[#f5a422] text-lg text-[#0e4031] hover:bg-[#0e4031] hover:text-[#f5a422] cursor-pointer"}
                        variant={"default"}

                    >
                        {
                            loading ? (
                                <span className="animate-spin">
                                    <LoaderCircle />
                                </span>
                            ) : (
                                <span>Regsiter User</span>
                            )
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}