import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StudentItem from "@/components/student-item";
import SearchBar from "@/components/search-bar";
import StudentDetail from "@/components/student-detail";
import AddStudentForm from "@/components/add-student-form";
import { Student, STUDENTS } from "@/data/students";

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [showForm, setShowForm] = useState(false);

  const handleSelect = (student: Student) => {
    setSelectedStudent((prev) => (prev?.id === student.id ? null : student));
  };

  const handleNewStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    setShowForm(false);
    setSelectedStudent(null);
  };

  if (showForm) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setShowForm(false)}>
          <Text style={styles.backButtonText}>← Back to directory</Text>
        </Pressable>
        <AddStudentForm onSubmitSuccess={handleNewStudent} />
      </SafeAreaView>
    );
  }

  const filtered = students.filter((student) => {
    const search = query.toLowerCase();
    return (
      student.name.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Student Directory</Text>
        <Pressable style={styles.addButton} onPress={() => setShowForm(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentItem
            student={item}
            onPress={handleSelect}
            isSelected={selectedStudent?.id === item.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No students match "{query}"</Text>
          </View>
        }
      />

      {selectedStudent && <StudentDetail student={selectedStudent} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0D1F4E",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#0D9488",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0D1F4E",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
});
