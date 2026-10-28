import React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { router } from "expo-router";
import FormField from "./form-field";
import { Student } from "../data/students";
import { useStudents } from "../context/students-context";

interface FormData {
  name: string;
  studentId: string;
  department: string;
  bio: string;
  skillsText: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  department?: string;
  bio?: string;
}

export default function AddStudentForm() {
  const { students, dispatch } = useStudents();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    department: "",
    bio: "",
    skillsText: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitTrigger, setSubmitTrigger] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const markTouched = (field: keyof FormData) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (data.name.trim().length === 0) {
      newErrors.name = "Name is required.";
    } else if (data.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    const trimmedStudentId = data.studentId.trim();
    const idPattern = /^\d{2}-\d{5}-\d$/;

    if (trimmedStudentId.length === 0) {
      newErrors.studentId = "Student ID is required.";
    } else if (!idPattern.test(trimmedStudentId)) {
      newErrors.studentId = "Format must be NN-NNNNN-N (e.g. 22-12345-1).";
    } else if (
      students.some((student) => student.studentId === trimmedStudentId)
    ) {
      newErrors.studentId = "Student ID already exists";
    }

    if (data.department.trim().length === 0) {
      newErrors.department = "Department is required.";
    }

    if (data.bio.trim().length === 0) {
      newErrors.bio = "Bio is required.";
    } else if (data.bio.trim().length < 10) {
      newErrors.bio = "Bio must be at least 10 characters.";
    }

    return newErrors;
  };

  useEffect(() => {
    setErrors(validateForm(formData));
  }, [formData, students]);

  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] || submitAttempted ? errors[field] : undefined;
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.name.trim().length > 0 &&
    formData.studentId.trim().length > 0 &&
    formData.department.trim().length > 0 &&
    formData.bio.trim().length >= 10;

  useEffect(() => {
    if (!submitTrigger) return;

    const timeoutId = setTimeout(() => {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        skills: formData.skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        avatarUrl: "https://i.pravatar.cc/150?u=" + Date.now(),
      };

      dispatch({ type: "ADD_STUDENT", payload: newStudent });
      setIsSubmitting(false);
      setSubmitTrigger(false);
      router.back();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [submitTrigger, formData, dispatch]);

  const handleSubmitPress = () => {
    setTouched({
      name: true,
      studentId: true,
      department: true,
      bio: true,
      skillsText: true,
    });
    setSubmitAttempted(true);

    if (isFormValid) {
      setIsSubmitting(true);
      setSubmitTrigger(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Join the Directory</Text>
      <Text style={styles.subheading}>
        Fill in your details below to add yourself to StudentDirectory.
      </Text>

      <FormField
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => updateField("name", text)}
        onBlur={() => markTouched("name")}
        placeholder="e.g. Ashraful Haque"
        error={getFieldError("name")}
      />

      <FormField
        label="Student ID"
        value={formData.studentId}
        onChangeText={(text) => updateField("studentId", text)}
        onBlur={() => markTouched("studentId")}
        placeholder="e.g. 22-12345-1"
        autoCapitalize="none"
        error={getFieldError("studentId")}
      />

      <FormField
        label="Department"
        value={formData.department}
        onChangeText={(text) => updateField("department", text)}
        onBlur={() => markTouched("department")}
        placeholder="e.g. Computer Science"
        error={getFieldError("department")}
      />

      <FormField
        label="Bio"
        value={formData.bio}
        onChangeText={(text) => updateField("bio", text)}
        onBlur={() => markTouched("bio")}
        placeholder="A short sentence about yourself..."
        multiline
        error={getFieldError("bio")}
      />

      <FormField
        label="Skills (comma-separated)"
        value={formData.skillsText}
        onChangeText={(text) => updateField("skillsText", text)}
        onBlur={() => markTouched("skillsText")}
        placeholder="e.g. React Native, TypeScript, Figma"
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmitPress}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Join Directory</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0D1F4E",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 19,
  },
  button: {
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
