import React from "react";
import { Menu, useTheme } from "react-native-paper";
import { Divider } from "react-native-paper";
import { Platform } from "react-native";

interface HymnDetailMenuProps {
  visible: boolean;
  onDismiss: () => void;
  onNavigate: () => void;
  onZoom: () => void;
  onToneChange: () => void;
  onToggleAutoScroll: () => void;
  onToggleAudioPlayer: (value: boolean) => void;
  audioPlayerVisible: boolean;
  onToggleNotes: () => void;
  showNotes: boolean;
  onEditHymn: () => void;
  onToggleToolbar: () => void;
  toolbarVisible: boolean;
  isWebPlatform: boolean;

  navigationVisible: boolean;
  zoomControlVisible: boolean;
  toneNavigationVisible: boolean;
}

const HymnDetailMenu = ({
  visible,
  onDismiss,
  onNavigate,
  onZoom,
  onToneChange,
  onToggleAutoScroll,
  onToggleAudioPlayer,
  audioPlayerVisible,
  onToggleNotes,
  showNotes,
  onEditHymn,
  onToggleToolbar,
  toolbarVisible,
  isWebPlatform,
  navigationVisible,
  zoomControlVisible,
  toneNavigationVisible,
}: HymnDetailMenuProps) => {
  const theme = useTheme();

  const menuAnchorPosition = {
    x: 0,
    y: Platform.OS !== "web" ? 56 : 0,
  };

  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={menuAnchorPosition} contentStyle={{ marginTop: 8 }}>
      {isWebPlatform && (
        <Menu.Item
          onPress={() => {
            onEditHymn();
            onDismiss();
          }}
          title="Editar Hino"
          leadingIcon="file-edit-outline"
        />
      )}
      <Menu.Item
        onPress={() => {
          if (navigationVisible) {
            onNavigate();
          } else {
            onNavigate();
          }
          onDismiss();
        }}
        title="Navegar Hinos"
        leadingIcon="page-next-outline"
      />
      <Menu.Item
        onPress={() => {
          if (zoomControlVisible) {
            onZoom();
          } else {
            onZoom();
          }
          onDismiss();
        }}
        title="Tamanho Fonte"
        leadingIcon="format-size"
      />
      <Menu.Item
        onPress={() => {
          if (toneNavigationVisible) {
            onToneChange();
          } else {
            onToneChange();
          }
          onDismiss();
        }}
        title="Mudar Tom"
        leadingIcon="music-accidental-sharp"
      />
      <Menu.Item
        onPress={() => {
          onToggleAutoScroll();
          onDismiss();
        }}
        title="Rolagem Automática"
        leadingIcon="pan-vertical"
      />
      <Menu.Item
        onPress={() => {
          onToggleAudioPlayer(!audioPlayerVisible);
          onDismiss();
        }}
        title={audioPlayerVisible ? "Ocultar Áudio" : "Exibir Áudio"}
        leadingIcon="play"
      />
      <Menu.Item
        onPress={() => {
          onToggleNotes();
          onDismiss();
        }}
        title={showNotes ? "Ocultar Notas" : "Exibir Notas"}
        leadingIcon="lead-pencil"
      />
      <Menu.Item
        onPress={() => {
          onToggleToolbar();
          onDismiss();
        }}
        title={toolbarVisible ? "Ocultar Toolbar" : "Exibir Toolbar"}
        leadingIcon="tools"
      />
      <Divider />
      <Menu.Item onPress={onDismiss} title="Fechar menu" leadingIcon="close" />
    </Menu>
  );
};

export default HymnDetailMenu;
