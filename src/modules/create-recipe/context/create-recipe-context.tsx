import { createContext, useContext, useState } from "react";
import { File as DbFile } from "@/db/schema";

interface CreateRecipeContextType {
  steps: { step: number; title: string }[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  initialImage: DbFile | null;
  setInitialImage: (image: DbFile | null) => void;
}

const CreateRecipeContext = createContext<CreateRecipeContextType | null>(null);

// Provider komponent
const CreateRecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const steps = [
    {
      step: 1,
      title: "Podstawy",
    },
    {
      step: 2,
      title: "Składniki",
    },
    {
      step: 3,
      title: "Kroki przygotowania",
    },
    {
      step: 4,
      title: "Dodatkowe informacje",
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [initialImage, setInitialImage] = useState<DbFile | null>(null);

  const value = {
    steps,
    currentStep,
    setCurrentStep,
    initialImage,
    setInitialImage,
  };

  return (
    <CreateRecipeContext.Provider value={value}>
      {children}
    </CreateRecipeContext.Provider>
  );
};

// Hook do używania kontekstu
const useCreateRecipe = () => {
  const context = useContext(CreateRecipeContext);
  if (!context) {
    throw new Error(
      "useCreateRecipe must be used within a CreateRecipeProvider"
    );
  }
  return context;
};

// Eksportowanie
export { CreateRecipeProvider, useCreateRecipe };
