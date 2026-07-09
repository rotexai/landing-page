import { Sparkles, LayoutGrid, SearchCheck, Bug, Cpu } from 'lucide-react';

export const valueProps = [
    {
        id: 1,
        title: "Every App Runs On A Visible Workflow",
        description: "The logic behind your website is a workflow you can open and read, not a black box you have to trust.",
        icon: SearchCheck,
        color: "text-amber-500"
    },
    {
        id: 2,
        title: "Debug The Workflow, Not The Whole Build",
        description: "Find the broken step instead of guessing what went wrong across an entire app.",
        icon: Bug,
        color: "text-purple-400"
    },
    {
        id: 3,
        title: "Use AI Where It Matters",
        description: "AI handles creation and reasoning. Workflows handle control and reliability.",
        icon: Cpu,
        color: "text-red-400"
    },
    {
        id: 4,
        title: "Websites Are Just What Workflows Produce",
        description: "AI generates the website faster, without starting from a blank page, but the workflow underneath is the real product.",
        icon: Sparkles,
        color: "text-green-500"
    },
    {
        id: 5,
        title: "Manage Multiple Workspaces At Once",
        description: "Run every workflow and website project in its own workspace, without mixing context.",
        icon: LayoutGrid,
        color: "text-blue-400"
    }
];
