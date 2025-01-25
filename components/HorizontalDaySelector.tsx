import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Text } from "./ui/text";
import { useRef } from "react";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export default function HorizontalDaySelector({
  length = 60,
  selectedDayJs,
  setSelectedDayJs,
}: {
  length?: number;
  selectedDayJs: dayjs.Dayjs;
  setSelectedDayJs: (d: dayjs.Dayjs) => void;
}) {
  const dimensions = useWindowDimensions();
  const horizontalDaysScrollViewRef = useRef<ScrollView>(null);
  const days = Array.from({ length }, (_, index) =>
    dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .subtract(30, "days")
      .add(index + 1, "days")
  );

  return (
    <ScrollView
      contentContainerClassName="gap-x-2 p-2"
      horizontal
      ref={horizontalDaysScrollViewRef}
      showsHorizontalScrollIndicator={false}
    >
      {days.map((day) => {
        const isToday = day.isSame(selectedDayJs, "date");

        return (
          <TouchableOpacity
            className="p-2 gap-y-2"
            key={day.toISOString()}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              if (isToday && horizontalDaysScrollViewRef.current) {
                const halfOfWindowScreen = dimensions.width * 0.5;
                const horizontalPadding = 32;
                horizontalDaysScrollViewRef.current.scrollTo({
                  x: layout.x - (halfOfWindowScreen - horizontalPadding),
                  animated: true,
                });
              }
            }}
            onPress={() => setSelectedDayJs(day)}
          >
            <Text
              className={twMerge(
                isToday ? "text-typography-900" : "text-typography-500",
                "text-center uppercase tracking-tighter font-semibold"
              )}
              size="xs"
            >
              {day.format("ddd")}
            </Text>
            <Text
              bold
              className={twMerge(
                isToday
                  ? "bg-slate-900 text-typography-white"
                  : "text-typography-800",
                "text-center p-1 px-2 rounded"
              )}
            >
              {day.format("DD")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
