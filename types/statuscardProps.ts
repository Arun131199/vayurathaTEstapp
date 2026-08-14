import { LucideIcon } from "lucide-react";

export interface StatuscardProps {
    id?:number;
    value: number|string;
    icon: LucideIcon;
    title: string;
}