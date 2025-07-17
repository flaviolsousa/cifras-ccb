import React, { useMemo } from "react";
import { View } from "react-native";

interface HymnAudioPlayerBarWaveProps {
  frequencies: number[];
  barCount?: number;
  height?: number;
  color?: string;
}

// Renderiza um gráfico de barras simples usando View (pode ser trocado por SVG para mais precisão)
const HymnAudioPlayerBarWave: React.FC<HymnAudioPlayerBarWaveProps> = ({ frequencies, barCount = 50, height = 32, color = "#888" }) => {
  // Memoizar o processamento das frequências para evitar recálculos desnecessários
  const processedBars = useMemo(() => {
    if (!frequencies.length) return [];

    // Reduzir número de barras para melhor performance no Android
    const effectiveBarCount = Math.max(10, Math.min(barCount, 750));

    // Amostragem mais eficiente das frequências
    console.log(`Processing ${frequencies.length} frequencies into ${effectiveBarCount} bars`);
    const step = Math.max(1, Math.floor(frequencies.length / effectiveBarCount));
    const sampled = Array.from({ length: effectiveBarCount }, (_, i) => {
      const start = i * step;
      const end = Math.min(start + step, frequencies.length);
      if (end > start) {
        // Calcula a média dos valores no intervalo [start, end)
        const sum = frequencies.slice(start, end).reduce((acc, v) => acc + v, 0);
        return sum / (end - start);
      }
      return frequencies[start] || 0;
    });

    // Segunda iteração para intensificar as pausas
    // Pausa: mais de 5 posições seguidas < 0.0 em frequencies
    const pauseThreshold = 5;
    let pauseCount = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] < 0.1) {
        pauseCount++;
        if (pauseCount === pauseThreshold) {
          // Marca todas as posições de sampled que cobrem esse range de pausa
          const pauseStart = i - pauseThreshold + 1;
          const pauseEnd = i + 1;
          const barStart = Math.round(pauseStart / step);
          const barEnd = Math.round(pauseEnd / step);
          for (let b = barStart; b < barEnd && b < sampled.length; b++) {
            sampled[b] = 0.01;
          }
        } else if (pauseCount > pauseThreshold) {
          // Continua marcando as barras seguintes enquanto durar a pausa
          const barIdx = Math.floor(i / step);
          if (barIdx < sampled.length) {
            sampled[barIdx] = 0.01;
          }
        }
      } else {
        pauseCount = 0;
      }
    }

    const max = Math.max(...sampled, 1);

    return sampled.map((v, i) => ({
      key: i,
      height: Math.max(1, (v / max) * height), // Altura mínima de 1px
    }));
  }, [frequencies, barCount, height]);

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height }}>
      {processedBars.map((bar) => (
        <View
          key={bar.key}
          style={{
            flex: 1,
            height: bar.height,
            backgroundColor: color,
            marginHorizontal: 0.5,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
};

export default React.memo(HymnAudioPlayerBarWave);
