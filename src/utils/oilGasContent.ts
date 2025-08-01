export interface QuickPrompt {
  title: string;
  description: string;
  prompt: string;
}

export const oilGasContentVariations = [
  {
    title: "DOMA AI",
    description: "Get instant insights on drilling, production, safety protocols, and equipment maintenance.",
    prompts: [
      {
        title: "Drilling Operations",
        description: "Optimize drilling parameters and monitor wellbore conditions",
        prompt: "How can I optimize drilling parameters for better penetration rates?"
      },
      {
        title: "Production Analysis", 
        description: "Analyze production data and identify optimization opportunities",
        prompt: "What are the best practices for production data analysis in oil fields?"
      },
      {
        title: "Safety Protocols",
        description: "Access HSE guidelines and safety procedures",
        prompt: "What safety protocols should be followed during offshore operations?"
      },
      {
        title: "Equipment Maintenance",
        description: "Get maintenance schedules and troubleshooting guides", 
        prompt: "What is the recommended maintenance schedule for rotating equipment?"
      }
    ]
  },
  {
    title: "DOMA AI",
    description: "Access expert knowledge on reservoir engineering, well completion, and production optimization.",
    prompts: [
      {
        title: "Reservoir Engineering",
        description: "Optimize reservoir modeling and enhance recovery techniques",
        prompt: "What are the latest enhanced oil recovery techniques for mature fields?"
      },
      {
        title: "Well Completion",
        description: "Design efficient completion strategies and perforation programs",
        prompt: "How do I design an optimal completion strategy for horizontal wells?"
      },
      {
        title: "Flow Assurance",
        description: "Prevent flow assurance issues and optimize production rates",
        prompt: "What are the best practices for preventing hydrate formation in deepwater?"
      },
      {
        title: "Facility Design",
        description: "Design and optimize surface facilities and processing equipment",
        prompt: "How can I optimize separator design for maximum oil recovery?"
      }
    ]
  },
  {
    title: "DOMA AI",
    description: "Get insights on refining processes, petrochemicals, and plant optimization.",
    prompts: [
      {
        title: "Refining Processes",
        description: "Optimize crude oil processing and product yields",
        prompt: "How can I improve the efficiency of my distillation unit?"
      },
      {
        title: "Catalyst Management",
        description: "Maximize catalyst life and performance in refining units",
        prompt: "What are the best practices for catalyst regeneration in FCC units?"
      },
      {
        title: "Energy Integration",
        description: "Reduce energy consumption through heat integration",
        prompt: "How can I implement heat integration to reduce energy costs?"
      },
      {
        title: "Process Control",
        description: "Implement advanced process control strategies",
        prompt: "What advanced control strategies work best for crude units?"
      }
    ]
  }
];

export const getRandomOilGasContent = () => {
  const randomIndex = Math.floor(Math.random() * oilGasContentVariations.length);
  return oilGasContentVariations[randomIndex];
};