import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
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

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          bottom: (insets.bottom || 0) + 24,
          left: 24, // Alinha à esquerda
          right: undefined, // Remove alinhamento à direita
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
});

export default HymnAudioPlayer;
