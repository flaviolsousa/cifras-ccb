import React, { useMemo } from "react";
import { View } from "react-native";

interface HymnAudioPlayerBarWaveProps {
  frequencies: number[];
  barCount?: number;
  height?: number;
  color?: string;
}

const HymnAudioPlayerBarWave: React.FC<HymnAudioPlayerBarWaveProps> = ({ frequencies, barCount = 50, height = 32, color = "#888" }) => {
  const processedBars = useMemo(() => {
    if (!frequencies.length) return [];
    const effectiveBarCount = Math.max(10, Math.min(barCount, 750));
    const step = Math.max(1, frequencies.length / effectiveBarCount);
    const sampled = Array.from({ length: effectiveBarCount }, (_, i) => {
      const start = Math.round(i * step);
      const end = Math.min(start + Math.round(step), frequencies.length);
      if (end > start) {
        const sum = frequencies.slice(start, end).reduce((acc, v) => acc + v, 0);
        return sum / (end - start);
      }
      return frequencies[start] || 0;
    });
    const pauseThreshold = 5;
    let pauseCount = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] < 0.1) {
        pauseCount++;
        if (pauseCount === pauseThreshold) {
          const pauseStart = i - pauseThreshold + 1;
          const pauseEnd = i + 1;
          const barStart = Math.round(pauseStart / step);
          const barEnd = Math.round(pauseEnd / step);
          for (let b = barStart; b < barEnd && b < sampled.length; b++) {
            sampled[b] = 0.01;
            pauseCount = 0;
          }
        } else if (pauseCount > pauseThreshold) {
          const barIdx = Math.round(i / step);
          if (barIdx < sampled.length) {
            sampled[barIdx] = 0.01;
            pauseCount = 0;
          }
        }
      } else {
        pauseCount = 0;
      }
    }
    const max = Math.max(...sampled, 1);
    return sampled.map((v, i) => ({
      key: i,
      height: Math.max(1, (v / max) * height),
    }));
  }, [frequencies, barCount, height]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height,
      }}
    >
      {processedBars.map((bar) => (
        <View
          key={bar.key}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              width: "75%",
              height: bar.height,
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default React.memo(HymnAudioPlayerBarWave);
