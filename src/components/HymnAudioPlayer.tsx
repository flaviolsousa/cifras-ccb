import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, AppState } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio/build/AudioModule.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HymnAudioPlayerProps {
  hymnCode: string;
  visible?: boolean;
}

const AUDIO_BASE_URL = "https://github.com/flaviolsousa/violao-ccb-assets/raw/refs/heads/main/mp3/";

const HymnAudioPlayer: React.FC<HymnAudioPlayerProps> = ({ hymnCode, visible = true }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);

  const url = `${AUDIO_BASE_URL}${hymnCode}.mp3`;

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, []);

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
            setShowRestart(true);
          }
        });
      }
      setIsPlaying(true);
      setShowRestart(true);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const pauseAudio = async () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartAudio = async () => {
    if (playerRef.current) {
      await playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
    } else {
      await playAudio();
    }
  };

  // Avançar e retroceder 5 segundos
  const seekBy = async (seconds: number) => {
    if (playerRef.current) {
      const status = playerRef.current.currentStatus;
      if (status && status.isLoaded) {
        let newTime = (status.currentTime || 0) + seconds;
        if (newTime < 0) newTime = 0;
        if (status.duration && newTime > status.duration) newTime = status.duration;
        await playerRef.current.seekTo(newTime);
      }
    }
  };

  // Controle de loop
  const [loopState, setLoopState] = useState<0 | 1 | 2>(0); // 0: off, 1: set start, 2: set end
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);

  // Atualiza o loop ao tocar o botão
  const handleLoopPress = async () => {
    if (loopState === 0) {
      // Definir início
      if (playerRef.current) {
        const status = playerRef.current.currentStatus;
        if (status && status.isLoaded) {
          setLoopStart(status.currentTime);
          setLoopEnd(null);
          setLoopState(1);
        }
      }
    } else if (loopState === 1) {
      // Definir fim
      if (playerRef.current) {
        const status = playerRef.current.currentStatus;
        if (status && status.isLoaded && loopStart !== null && status.currentTime > loopStart) {
          setLoopEnd(status.currentTime);
          setLoopState(2);
        }
      }
    } else {
      // Resetar loop
      setLoopStart(null);
      setLoopEnd(null);
      setLoopState(0);
    }
  };

  // Listener para manter o loop
  useEffect(() => {
    if (!playerRef.current) return;
    if (loopState !== 2 || loopStart === null || loopEnd === null) return;
    const player = playerRef.current;
    const listener = (status: any) => {
      if (status.isLoaded && status.currentTime >= loopEnd) {
        player.seekTo(loopStart);
      }
    };
    player.addListener("playbackStatusUpdate", listener);
    return () => {
      player.removeAllListeners && player.removeAllListeners("playbackStatusUpdate");
    };
  }, [loopState, loopStart, loopEnd]);

  // Parar o áudio ao sair da tela ou minimizar o app
  useEffect(() => {
    const stopAudio = () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.seekTo(0);
        setIsPlaying(false);
      }
    };

    // Parar ao minimizar/app background (mobile)
    const handleAppStateChange = (state: string) => {
      if (state !== "active") {
        stopAudio();
      }
    };
    let appStateListener: any;
    if (typeof AppState !== "undefined") {
      appStateListener = AppState.addEventListener("change", handleAppStateChange);
    }

    // Parar ao desmontar
    return () => {
      // Ao desmontar, só para, não reinicia
      if (playerRef.current) {
        playerRef.current.pause();
        setIsPlaying(false);
      }
      if (appStateListener && appStateListener.remove) appStateListener.remove();
    };
  }, []);

  // Evitar autoplay ao voltar do background
  useEffect(() => {
    const handleAppStateChange = (state: string) => {
      if (state === "active" && playerRef.current) {
        // Garante que não toca automaticamente ao voltar
        playerRef.current.pause();
        setIsPlaying(false);
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

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          bottom: (insets.bottom || 0) + 24,
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
          small
          testID="audio-restart"
        />
      )}
      {showRestart && (
        <FAB
          icon="rewind"
          onPress={() => seekBy(-5)}
          style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
          color={theme.colors.onSecondary}
          small
          testID="audio-rewind"
        />
      )}
      {showRestart && (
        <FAB
          icon="fast-forward"
          onPress={() => seekBy(5)}
          style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
          color={theme.colors.onSecondary}
          small
          testID="audio-forward"
        />
      )}
      {showRestart && (
        <FAB
          icon={loopState === 0 ? "arrow-left-thin-circle-outline" : loopState === 1 ? "diameter-outline" : "record-circle-outline"}
          onPress={handleLoopPress}
          style={[styles.fab, styles.fabSeek, { backgroundColor: theme.colors.secondary }]}
          color={theme.colors.onSecondary}
          small
          testID="audio-loop"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
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
});

export default HymnAudioPlayer;
