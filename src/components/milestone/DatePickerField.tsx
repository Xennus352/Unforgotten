import { colors } from "@/constants/theme";
import { formatDisplayDate, toIsoDate } from "@/utils/date";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
};

export function DatePickerField({
  value,
  onChange,
  maximumDate = new Date(),
}: Props) {
  const [showIosPicker, setShowIosPicker] = useState(Platform.OS === "ios");

  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: "date",
      maximumDate,
      onValueChange: (_event, selected) => {
        if (selected) {
          onChange(selected);
        }
      },
    });
  };

  return (
    <View>
      {Platform.OS === "android" ? (
        <Pressable style={styles.dateButton} onPress={openAndroidPicker}>
          <Text style={styles.dateButtonText}>
            {formatDisplayDate(toIsoDate(value))}
          </Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowIosPicker((v) => !v)}
          >
            <Text style={styles.dateButtonText}>
              {formatDisplayDate(toIsoDate(value))}
            </Text>
          </Pressable>
          {showIosPicker ? (
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              maximumDate={maximumDate}
              onValueChange={(_event, selected) => {
                if (selected) {
                  onChange(selected);
                }
              }}
              themeVariant="light"
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 194, 209, 0.8)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3E3F",
    textAlign: "center",
  },
});