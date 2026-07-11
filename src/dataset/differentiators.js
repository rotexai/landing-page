import { Gauge, GitMerge, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const differentiators = [
    {
        id: 1,
        title: "Capability-Based Matching",
        description: "Match work to real capabilities and expected outcomes instead of relying only on resumes, keywords, or feature lists.",
        icon: Sparkles,
        color: "text-amber-500"
    },
    {
        id: 2,
        title: "Human-Agent Team Recommendations",
        description: "Create combinations of human expertise and AI capability based on each task's objectives, budget, and risk level.",
        icon: Users,
        color: "text-blue-400"
    },
    {
        id: 3,
        title: "Unified Workforce Governance",
        description: "Manage employees, freelancers, service providers, and AI agents through one system of permissions and approvals.",
        icon: ShieldCheck,
        color: "text-green-500"
    },
    {
        id: 4,
        title: "Controls Built In From The Start",
        description: "Define action limits, access permissions, review checkpoints, and human responsibilities before agents enter workflows.",
        icon: GitMerge,
        color: "text-purple-400"
    },
    {
        id: 5,
        title: "Performance Based On Outcomes",
        description: "Compare people and AI agents by output quality, reliability, cost, delivery time, and business impact.",
        icon: Gauge,
        color: "text-red-400"
    }
];
