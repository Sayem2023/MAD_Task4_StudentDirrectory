import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StudentItem from "@/components/student-item";
import SearchBar from "@/components/search-bar";
import StudentDetail from "@/components/student-detail";
import { useStudents } from "@/context/students-context";
import { Student } from "@/data/students";

export default function HomeScreen() {
  const { students, dispatch } = useStudents();
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (
      selectedStudent &&
      !students.some((student) => student.id === selectedStudent.id)
    ) {
      setSelectedStudent(null);
    }
  }, [students, selectedStudent]);

  const filtered = students.filter((student) => {
    const search = query.toLowerCase();

    return (
      student.name.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search)
    );
  });

  const handleSelect = (student: Student) => {
    setSelectedStudent((previous) =>
      previous?.id === student.id ? null : student,
    );
  };

  const resetDirectory = () => {
    dispatch({ type: "RESET" });
    setSelectedStudent(null);
    setQuery("");
  };

  const handleReset = () => {
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm("Restore the original student list?")
      ) {
        resetDirectory();
      }
      return;
    }

    Alert.alert("Reset Directory", "Restore the original student list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: resetDirectory,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Student Directory ({students.length})</Text>

        <View style={styles.actions}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/add-student")}
          >
            <Text style={styles.buttonText}>+ Add</Text>
          </Pressable>
        </View>
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
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: "#475569",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
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
