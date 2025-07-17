import React, { useCallback, useRef } from "react";
import { View, StyleSheet, LayoutChangeEvent, Pressable } from "react-native";
import HymnAudioPlayerBarWave from "./HymnAudioPlayerBarWave";

interface HymnAudioPlayerBarProps {
  frequencies: number[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  loopStart?: number | null;
  loopEnd?: number | null;
  height?: number;
  barColor?: string;
  progressColor?: string;
  loopColor?: string;
}

const HymnAudioPlayerBar: React.FC<HymnAudioPlayerBarProps> = ({
  frequencies,
  duration,
  currentTime,
  onSeek,
  loopStart,
  loopEnd,
  height = 36,
  barColor = "#888",
  progressColor = "#1976d2",
  loopColor = "rgba(25, 118, 210, 0.2)",
}) => {
  const containerRef = useRef<View>(null);
  const [width, setWidth] = React.useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handlePress = useCallback(
    (evt: any) => {
      function round(num: number, precision: number = 3): number {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
      }
      if (!width || !duration) return;

      // Usar pageX ao invés de locationX para coordenadas absolutas
      const pageX = evt.nativeEvent.pageX;

      // Medir a posição do container na tela
      containerRef.current?.measure((x, y, w, h, pageXOffset, pageYOffset) => {
        const relativeX = pageX - pageXOffset;
        const percent = Math.max(0, Math.min(1, relativeX / width));

        onSeek(percent * duration);
      });
    },
    [width, duration, onSeek],
  );
  const barCount = Math.floor(width / 5);

  // Calcula posições
  const progressPercent = duration ? currentTime / duration : 0;
  const loopStartPercent = loopStart && duration ? loopStart / duration : null;
  const loopEndPercent = loopEnd && duration ? loopEnd / duration : null;
  return (
    <Pressable ref={containerRef} onPress={handlePress} onLayout={handleLayout} style={[styles.container, { height }]}>
      {/* Loop highlight */}
      {loopStartPercent !== null && loopEndPercent !== null && width > 0 && (
        <View
          style={[
            styles.loopArea,
            {
              left: width * loopStartPercent,
              width: width * (loopEndPercent - loopStartPercent),
              backgroundColor: loopColor,
              height,
            },
          ]}
        />
      )}

      {/* Frequencies */}
      <View style={[styles.waveformContainer, { height }]}>
        <HymnAudioPlayerBarWave frequencies={frequencies} barCount={barCount} height={height} color={barColor} />
      </View>

      {/* Progress line */}
      {width > 0 && (
        <View
          style={[
            styles.progressLine,
            {
              left: width * progressPercent - 1,
              height,
              backgroundColor: progressColor,
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Loop start/end lines */}
      {loopStartPercent !== null && width > 0 && (
        <View
          style={[
            styles.loopLine,
            {
              left: width * loopStartPercent - 1,
              height,
              backgroundColor: progressColor,
            },
          ]}
          pointerEvents="none"
        />
      )}
      {loopEndPercent !== null && width > 0 && (
        <View
          style={[
            styles.loopLine,
            {
              left: width * loopEndPercent - 1,
              height,
              backgroundColor: progressColor,
            },
          ]}
          pointerEvents="none"
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#AAAA",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    overflow: "visible",
    justifyContent: "center",
    height: 36,
    transform: [{ translateY: -130 }], // Reduzir para metade da altura desejada
  },
  waveformContainer: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  progressLine: {
    position: "absolute",
    width: 2,
    borderRadius: 1,
    zIndex: 2,
  },
  loopLine: {
    position: "absolute",
    width: 2,
    borderRadius: 1,
    zIndex: 2,
    opacity: 0.7,
  },
  loopArea: {
    position: "absolute",
    zIndex: 1,
    borderRadius: 4,
  },
});

export default HymnAudioPlayerBar;
