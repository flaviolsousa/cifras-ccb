import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, AppState } from "react-native";
import { FAB, useTheme, Text } from "react-native-paper";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio/build/AudioModule.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HymnAudioPlayerProps {
  hymnCode: string;
  visible?: boolean;
  onPlay?: () => void;
}

//const AUDIO_BASE_URL = "https://github.com/flaviolsousa/cifras-ccb-assets/raw/refs/heads/main/mp3/";
const AUDIO_BASE_URL = "https://flaviolsousa.github.io/cifras-ccb-assets/mp3/";

const HymnAudioPlayer: React.FC<HymnAudioPlayerProps> = ({ hymnCode, visible = true, onPlay = () => {} }) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);

  const url = `${AUDIO_BASE_URL}${hymnCode}.mp3`;

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
            setShowRestart(true);
          }
        });
      }
      setIsPlaying(true);
      setShowRestart(true);
      onPlay();
    } catch (e) {
      console.error("Error playing audio:", e);
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
      if (status.isLoaded && status.currentTime >= loopEnd) {
        player.seekTo(loopStart);
      }
    };
    player.addListener("playbackStatusUpdate", listener);
    return () => {
      player.removeAllListeners && player.removeAllListeners("playbackStatusUpdate");
    };
  }, [loopState, loopStart, loopEnd]);

  // Stop audio when leaving the screen or minimizing the app
  useEffect(() => {
    const stopAudio = () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.seekTo(0);
        setIsPlaying(false);
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
        setIsPlaying(false);
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
    <>
      <Animated.View
        style={[
          styles.fabContainer,
          {
            bottom: 24,
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
      {loopAlert && (
        <View
          style={{
            width: "100%",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 90,
              backgroundColor: theme.colors.secondary,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              zIndex: 200,
            }}
          >
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
