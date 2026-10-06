"use client"

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginAction } from '@/lib/actions/auth'
import { LoginType } from '@/types/loginType'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function LoginForm() {
    const router = useRouter();
    const { handleSubmit, formState: { errors }, reset, control } = useForm<LoginType>({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [toggle, setToggle] = useState<"USER" | "ADMIN">("USER");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginType) => {
        setIsSubmitting(true);
        try {
            const response = await loginAction({
                email: data.email,
                password: data.password,
                role: toggle,
            });

            reset();

            if (response.role === "ADMIN") {
                router.push("/admin-dashboard");
                router.refresh();
            } else {
                router.push("/user-dashboard/acknowledgment");
                router.refresh();
            }

        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {

    }, [])

    return (
        <div className="max-w-md rounded-[2rem]  p-8 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150">
            <div className="mb-8 flex gap-2 rounded-full bg-white/10 p-1">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setToggle("USER")}
                    className={`h-11 flex-1 rounded-full text-sm font-semibold transition ${toggle === "USER"
                        ? "bg-[#f5a623] text-[#0c2d24]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    Pilot / Student
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setToggle("ADMIN")}
                    className={`h-11 flex-1 rounded-full text-sm font-semibold transition ${toggle === "ADMIN"
                        ? "bg-[#f5a623] text-[#0c2d24]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    Administrator
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                                    Email address
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="email"

                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="your email"
                                            className="mt-2 w-full h-10 text-white"
                                        />
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                                    Password
                                </FieldLabel>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <div className="relative mt-2">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="your password"
                                                className="w-full h-10 pr-10 text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((visible) => !visible)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                aria-pressed={showPassword}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#e8a229] transition hover:bg-white/10 hover:text-[#f5a623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a229]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                                ) : (
                                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12.5 bg-[#e8a229] text-[#0c2d24] transition hover:bg-[#0c2d24] hover:text-[#e8a229] py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            "Sign In to Portal"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}