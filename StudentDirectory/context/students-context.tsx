import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { STUDENTS } from "../data/students";
import {
  studentsReducer,
  type StudentsAction,
  type StudentsState,
} from "./students-reducer";

interface StudentsContextValue {
  students: StudentsState;
  dispatch: Dispatch<StudentsAction>;
}

const StudentsContext = createContext<StudentsContextValue | null>(null);

interface StudentsProviderProps {
  children: ReactNode;
}

export function StudentsProvider({ children }: StudentsProviderProps) {
  const [students, dispatch] = useReducer(studentsReducer, STUDENTS);

  return (
    <StudentsContext.Provider value={{ students, dispatch }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents(): StudentsContextValue {
  const context = useContext(StudentsContext);

  if (!context) {
    throw new Error("useStudents must be used inside a StudentsProvider");
  }

  return context;
}
