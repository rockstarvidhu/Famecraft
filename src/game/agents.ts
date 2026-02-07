// src/game/agents.ts

export type AgentTier = 'rookie' | 'experienced' | 'elite' | 'legendary';

export interface Agent {
  id: string;
  name: string;
  tier: AgentTier;
  commission: number; // Percentage of earnings
  hiringFee: number; // One-time cost in lakhs
  benefits: {
    extraScripts: number; // Additional script offers per selection
    paymentBonus: number; // Percentage increase in payments
    qualityBonus: number; // Better director/costar reputation
    awardCampaign: boolean; // Can campaign for awards
    exclusiveProjects: boolean; // Access to prestige films
  };
  requirements: {
    minFame?: number;
    minWealth?: number;
  };
}

export const AGENTS: Agent[] = [
  {
    id: 'rookie',
    name: 'Rahul Verma',
    tier: 'rookie',
    commission: 10,
    hiringFee: 0,
    benefits: {
      extraScripts: 0,
      paymentBonus: 0,
      qualityBonus: 0,
      awardCampaign: false,
      exclusiveProjects: false,
    },
    requirements: {},
  },
  {
    id: 'experienced',
    name: 'Priya Talent Agency',
    tier: 'experienced',
    commission: 12,
    hiringFee: 50,
    benefits: {
      extraScripts: 1,
      paymentBonus: 15,
      qualityBonus: 10,
      awardCampaign: false,
      exclusiveProjects: false,
    },
    requirements: {
      minFame: 30,
      minWealth: 100,
    },
  },
  {
    id: 'elite',
    name: 'Karan Johar Agency',
    tier: 'elite',
    commission: 15,
    hiringFee: 200,
    benefits: {
      extraScripts: 2,
      paymentBonus: 30,
      qualityBonus: 20,
      awardCampaign: true,
      exclusiveProjects: true,
    },
    requirements: {
      minFame: 50,
      minWealth: 300,
    },
  },
  {
    id: 'legendary',
    name: 'Yash Raj Management',
    tier: 'legendary',
    commission: 18,
    hiringFee: 500,
    benefits: {
      extraScripts: 3,
      paymentBonus: 50,
      qualityBonus: 30,
      awardCampaign: true,
      exclusiveProjects: true,
    },
    requirements: {
      minFame: 75,
      minWealth: 800,
    },
  },
];

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find(a => a.id === id);
}

export function getAvailableAgents(fame: number, wealth: number): Agent[] {
  return AGENTS.filter(agent => {
    if (agent.requirements.minFame && fame < agent.requirements.minFame) return false;
    if (agent.requirements.minWealth && wealth < agent.requirements.minWealth) return false;
    return true;
  });
}

export function calculateCommission(earnings: number, agentId: string): number {
  const agent = getAgentById(agentId);
  if (!agent) return 0;
  return Math.round(earnings * (agent.commission / 100));
}

export function applyAgentBonuses(
  payment: number,
  directorRep: number,
  costarPop: number,
  agentId: string
): {
  payment: number;
  directorRep: number;
  costarPop: number;
} {
  const agent = getAgentById(agentId);
  if (!agent) return { payment, directorRep, costarPop };

  return {
    payment: Math.round(payment * (1 + agent.benefits.paymentBonus / 100)),
    directorRep: Math.min(100, Math.round(directorRep * (1 + agent.benefits.qualityBonus / 100))),
    costarPop: Math.min(100, Math.round(costarPop * (1 + agent.benefits.qualityBonus / 100))),
  };
}