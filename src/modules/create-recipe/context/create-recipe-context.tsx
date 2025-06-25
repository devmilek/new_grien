import { createContext, useContext, useState, useEffect } from "react";
import { File as DbFile } from "@/db/schema";
import { GetRecipe } from "../types";

interface CreateRecipeContextType {
  steps: { step: number; title: string }[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  initialImage: DbFile | null;
  setInitialImage: (image: DbFile | null) => void;
  initialData: GetRecipe | null;
  setInitialData: (data: GetRecipe | null) => void;
}

const CreateRecipeContext = createContext<CreateRecipeContextType | null>(null);

// Dodaj props do Provider
interface CreateRecipeProviderProps {
  children: React.ReactNode;
  initialData?: GetRecipe | null;
  initialImage?: DbFile | null;
}

const CreateRecipeProvider = ({
  children,
  initialData: propInitialData,
  initialImage: propInitialImage,
}: CreateRecipeProviderProps) => {
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

  // Inicjalizuj state z props
  const [initialImage, setInitialImage] = useState<DbFile | null>(
    propInitialImage || null
  );
  const [initialData, setInitialData] = useState<GetRecipe | null>(
    propInitialData || null
  );

  // Aktualizuj state gdy props się zmienią
  useEffect(() => {
    if (propInitialData !== undefined) {
      setInitialData(propInitialData);
    }
  }, [propInitialData]);

  useEffect(() => {
    if (propInitialImage !== undefined) {
      setInitialImage(propInitialImage);
    }
  }, [propInitialImage]);

  const value = {
    steps,
    currentStep,
    setCurrentStep,
    initialImage,
    setInitialImage,
    initialData,
    setInitialData,
  };

  return (
    <CreateRecipeContext.Provider value={value}>
      {children}
    </CreateRecipeContext.Provider>
  );
};

const useCreateRecipe = () => {
  const context = useContext(CreateRecipeContext);
  if (!context) {
    throw new Error(
      "useCreateRecipe must be used within a CreateRecipeProvider"
    );
  }
  return context;
};

export { CreateRecipeProvider, useCreateRecipe };
