type Poll = {
    id: number;
    creator: string;
    title: string;
    question: string;
    optionTexts: string[];
    optionVotes: number[];
    voterCount: number;
    deadline: number;
    createdAt: number;
    hasAlreadyVoted: boolean;
  }