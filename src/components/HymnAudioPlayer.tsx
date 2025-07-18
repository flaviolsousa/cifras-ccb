import React, { useEffect, useRef, useState, useCallback, use } from "react";
import { View, StyleSheet, Animated, AppState } from "react-native";
import HymnAudioPlayerBar from "./HymnAudioPlayerBar";
import { FAB, useTheme, Text } from "react-native-paper";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio/build/AudioModule.types";
import { getHymnFrequencies } from "../services/Hymn/HymnImports";
import alpha from "color-alpha";
import useHymnData from "../hooks/useHymnData";

interface HymnAudioPlayerProps {
  hymnCode: string;
  visible?: boolean;
  onPlay?: () => void;
}

const AUDIO_BASE_URL = "https://flaviolsousa.github.io/cifras-ccb-assets/mp3/";

const HymnAudioPlayer: React.FC<HymnAudioPlayerProps> = ({ hymnCode, visible = true, onPlay = () => {} }) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  const { hymn } = useHymnData(hymnCode);

  const url = `${AUDIO_BASE_URL}${hymnCode}.mp3`;

  // Frequencies: carregamento assíncrono otimizado
  const [frequencies, setFrequencies] = useState<number[]>([]);
  useEffect(() => {
    let isMounted = true;

    // Delay o carregamento das frequências para não bloquear o áudio
    const loadFrequencies = async () => {
      try {
        // Adiciona um pequeno delay para permitir que o player seja criado primeiro
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!isMounted) {
          return;
        }

        const mod = await getHymnFrequencies(hymnCode);

        if (isMounted && Array.isArray(mod)) {
          // Processa as frequências em chunks menores para não bloquear a UI
          const chunkSize = 1000;
          const chunks: number[][] = [];
          for (let i = 0; i < mod.length; i += chunkSize) {
            chunks.push(mod.slice(i, i + chunkSize));
          }

          // Processa um chunk por vez com intervalos
          let processedFrequencies: number[] = [];
          for (const chunk of chunks) {
            processedFrequencies = [...processedFrequencies, ...chunk];
            if (isMounted) {
              setFrequencies([...processedFrequencies]);
              // Pequeno delay entre chunks para não bloquear a UI
              await new Promise((resolve) => setTimeout(resolve, 10));
            }
          }
        }
      } catch (error) {
        if (isMounted) setFrequencies([]);
      }
    };

    // Executa em uma microtask para não bloquear a renderização inicial
    Promise.resolve().then(loadFrequencies);

    return () => {
      isMounted = false;
    };
  }, [hymnCode]);

  useEffect(() => {
    setDuration(hymn?.time?.duration || null);
  }, [hymn]);

  // Limpar player ao desmontar
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
      playerRef.current = null;
    }
    setIsPlaying(false);
    setShowRestart(false);
    setLoading(false);
    setLoopState(0);
    setLoopStart(null);
    setLoopEnd(null);
    setLoopAlert(null);
  }, [hymnCode]);

  const playAudio = async () => {
    setLoading(true);
    try {
      if (playerRef.current) {
        playerRef.current.play();
      } else {
        const player = createAudioPlayer(url);

        playerRef.current = player;
        player.play();

        player.addListener("playbackStatusUpdate", (status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setShowRestart(false);
            player.seekTo(0);
            pauseAudio();
          }
        });
      }
      setIsPlaying(true);
      setShowRestart(true);
      onPlay();
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const pauseAudio = async () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setShowRestart(false);
      setIsPlaying(false);
      setLoopAlert(null);
    }
  };

  const restartAudio = async () => {
    if (playerRef.current) {
      await playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
      showLoopAlert("Reiniciando o áudio", 3000);
    } else {
      await playAudio();
    }
  };

  // Fast forward and rewind 5 seconds
  const seekBy = async (seconds: number) => {
    if (playerRef.current) {
      const status = playerRef.current.currentStatus;
      if (status && status.isLoaded) {
        let newTime = (status.currentTime || 0) + seconds;
        if (newTime < 0) newTime = 0;
        if (status.duration && newTime > status.duration) newTime = status.duration;
        await playerRef.current.seekTo(newTime);
        showLoopAlert(`${seconds > 0 ? "Avançando" : "Rebobinando"} ${Math.abs(seconds)} segundos o áudio`, 3000);
      }
    }
  };

  // Loop control
  const [loopState, setLoopState] = useState<0 | 1 | 2>(0); // 0: off, 1: set start, 2: set end
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);

  // Temporary alert for loop feedback
  const [loopAlert, setLoopAlert] = useState<string | null>(null);
  const loopAlertTimer = useRef<NodeJS.Timeout | null>(null);
  const showLoopAlert = (msg: string, time: number = 10000) => {
    setLoopAlert(msg);
    if (loopAlertTimer.current) clearTimeout(loopAlertTimer.current);
    loopAlertTimer.current = setTimeout(() => setLoopAlert(null), time);
  };

  // Update loop when pressing the button
  const handleLoopPress = async () => {
    if (loopState === 0) {
      // Set start
      if (playerRef.current) {
        const status = playerRef.current.currentStatus;
        if (status && status.isLoaded) {
          setLoopStart(status.currentTime);
          setLoopEnd(null);
          setLoopState(1);
          showLoopAlert("Início de Loop marcado\n\nToque novamente para definir o fim do loop");
        }
      }
    } else if (loopState === 1) {
      // Set end
      if (playerRef.current) {
        const status = playerRef.current.currentStatus;
        if (status && status.isLoaded && loopStart !== null && status.currentTime > loopStart) {
          setLoopEnd(status.currentTime);
          setLoopState(2);
          showLoopAlert("Audio em Looping\n\nToque novamente para cancelar");
        }
      }
    } else {
      // Reset loop
      setLoopStart(null);
      setLoopEnd(null);
      setLoopState(0);
      showLoopAlert("Loop Cancelado\n\nToque novamente para parar o Loop\ne reiniciar a configuração");
    }
  };

  // Listener to maintain the loop
  useEffect(() => {
    if (!playerRef.current) return;
    if (loopState !== 2 || loopStart === null || loopEnd === null) return;
    const player = playerRef.current;
    const listener = (status: any) => {
      if (status.isLoaded && status.currentTime < loopStart) {
        player.seekTo(loopStart);
      }
      if (status.isLoaded && status.currentTime >= loopEnd) {
        player.seekTo(loopStart);
      }
    };
    player.addListener("playbackStatusUpdate", listener);
    return () => {
      player.removeListener && player.removeListener("playbackStatusUpdate", listener);
    };
  }, [loopState, loopStart, loopEnd]);

  // Stop audio when leaving the screen or minimizing the app
  useEffect(() => {
    const stopAudio = () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.seekTo(0);
        setShowRestart(false);
        setIsPlaying(false);
        setLoopAlert(null);
      }
    };

    // Stop when minimizing/app background (mobile)
    const handleAppStateChange = (state: string) => {
      if (state !== "active") {
        stopAudio();
      }
    };
    let appStateListener: any;
    if (typeof AppState !== "undefined") {
      appStateListener = AppState.addEventListener("change", handleAppStateChange);
    }

    // Stop when unmounting
    return () => {
      // When unmounting, just stop, don't restart
      if (playerRef.current) {
        playerRef.current.pause();

        setShowRestart(false);
        setIsPlaying(false);
        setLoopAlert(null);
      }
      if (appStateListener && appStateListener.remove) appStateListener.remove();
    };
  }, []);

  // Prevent autoplay when returning from background
  useEffect(() => {
    const handleAppStateChange = (state: string) => {
      if (state === "active" && playerRef.current) {
        // Ensure it doesn't play automatically when returning
        playerRef.current.pause();

        setShowRestart(false);
        setIsPlaying(false);
        setLoopAlert(null);
      }
    };
    let appStateListener: any;
    if (typeof AppState !== "undefined") {
      appStateListener = AppState.addEventListener("change", handleAppStateChange);
    }
    return () => {
      if (appStateListener && appStateListener.remove) appStateListener.remove();
    };
  }, []);

  // Posição atual do áudio
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    let interval: any;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const status = playerRef.current?.currentStatus;
        if (status && status.isLoaded) setCurrentTime(status.currentTime || 0);
      }, 200);
    } else {
      setCurrentTime(0);
    }
    return () => interval && clearInterval(interval);
  }, [isPlaying, hymnCode]);

  // Função para seek
  const handleSeek = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  }, []);

  if (!visible) return null;

  const [shouldShowBar, setShouldShowBar] = useState(false);

  useEffect(() => {
    setShouldShowBar(frequencies.length > 0);
  }, [frequencies]);

  return (
    <>
      {/* Sempre mostrar os controles de áudio */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            bottom: 8,
            left: 24,
            right: undefined,
          },
        ]}
        pointerEvents="box-none"
      >
        <FAB
          icon={isPlaying ? "pause" : "play"}
          loading={loading}
          onPress={isPlaying ? pauseAudio : playAudio}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          testID="audio-play-pause"
        />
        {showRestart && (
          <FAB
            icon="restart"
            onPress={restartAudio}
            style={[styles.fab, styles.fabRestart, { backgroundColor: theme.colors.secondary }]}
            color={theme.colors.onSecondary}
            testID="audio-restart"
          />
        )}
        {showRestart && (
          <FAB
            icon="rewind"
            onPress={() => seekBy(-5)}
            style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
            color={theme.colors.onSecondary}
            testID="audio-rewind"
          />
        )}
        {showRestart && (
          <FAB
            icon="fast-forward"
            onPress={() => seekBy(5)}
            style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
            color={theme.colors.onSecondary}
            testID="audio-forward"
          />
        )}
        {showRestart && (
          <FAB
            icon={loopState === 0 ? "arrow-left-thin-circle-outline" : loopState === 1 ? "diameter-outline" : "record-circle-outline"}
            onPress={handleLoopPress}
            style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
            color={theme.colors.onSecondary}
            testID="audio-loop"
          />
        )}
      </Animated.View>

      {/* Barra de progresso e espectrograma - só mostra se tiver frequências E duração */}
      {shouldShowBar && showRestart && duration && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <HymnAudioPlayerBar
            frequencies={frequencies}
            duration={duration}
            currentTime={currentTime}
            onSeek={handleSeek}
            loopStart={loopStart}
            loopEnd={loopEnd}
            loopColor={alpha(theme.colors.primary, 0.2)}
          />
        </View>
      )}

      {loopAlert && (
        <View style={styles.alertContainer}>
          <View style={[styles.alertBox, { backgroundColor: theme.colors.secondary }]}>
            <Animated.Text style={{ color: theme.colors.onSecondary, fontWeight: "bold" }}>{loopAlert}</Animated.Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "transparent",
    marginBottom: 8,
  },
  fab: {
    marginRight: 8,
  },
  fabRestart: {
    marginLeft: 0,
  },
  fabSeek: {
    marginLeft: 0,
  },
  alertContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    position: "absolute",
    bottom: 140,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 200,
  },
});

export default HymnAudioPlayer;
