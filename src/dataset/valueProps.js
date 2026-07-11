import { Bot, SearchCheck, UsersRound } from 'lucide-react';

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
        title: "Build The Right Human-Agent Team",
        description: "Achieve a better balance between cost, quality, speed, and reliability.",
        icon: UsersRound,
        color: "text-amber-500",
        visual: "team"
    }
];
