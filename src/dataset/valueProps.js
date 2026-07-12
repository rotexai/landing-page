import { Bot, GitBranch, SearchCheck, UsersRound } from 'lucide-react';

export const valueProps = [
    {
        id: 1,
        title: "Find The Right Capabilities For Every Task",
        description: "Reduce the time spent searching for resources and avoid making decisions based only on job titles or generic descriptions.",
        icon: SearchCheck,
        color: "text-amber-500",
        visual: "capabilities"
    },
    {
        id: 2,
        title: "Decide When To Use Humans, AI, Or Both",
        description: "Automate the right tasks without giving up visibility or control.",
        icon: Bot,
        color: "text-amber-500",
        visual: "decision"
    },
    {
        id: 3,
        title: "Understand How AI Agent Logic Works",
        description: "See how an AI agent handles work through a visual workflow and UI builder, so your team can trace, test, and adjust logic when needed.",
        icon: GitBranch,
        color: "text-amber-500",
        visual: "workflow"
    },
    {
        id: 4,
        title: "Build The Right Human-Agent Team",
        description: "Achieve a better balance between cost, quality, speed, and reliability.",
        icon: UsersRound,
        color: "text-amber-500",
        visual: "team"
    }
];
