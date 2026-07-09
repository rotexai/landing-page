import { EyeOff, FolderKanban, ShieldCheck, Wrench, Gauge } from 'lucide-react';

export const differentiators = [
    {
        id: 1,
        title: "Not A Black Box",
        description: "You can see and validate the workflow logic behind the generated website, not just the finished output.",
        icon: EyeOff,
        color: "text-amber-500"
    },
    {
        id: 2,
        title: "Workspace-Native",
        description: "Manage many projects at once without mixing operational context between them.",
        icon: FolderKanban,
        color: "text-blue-400"
    },
    {
        id: 3,
        title: "Built For Trust",
        description: "Workflow visibility makes AI output easier to inspect, explain, and improve.",
        icon: ShieldCheck,
        color: "text-green-500"
    },
    {
        id: 4,
        title: "Operationally Practical",
        description: "Supports debugging, validation, and repeatable execution instead of only one-time generation.",
        icon: Wrench,
        color: "text-purple-400"
    },
    {
        id: 5,
        title: "Cost-Conscious AI Model",
        description: "AI is used intentionally, not wasted on routine process logic that deterministic workflows handle better.",
        icon: Gauge,
        color: "text-red-400"
    }
];
