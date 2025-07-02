import React from "react";
import { Menu } from "react-native-paper";
import { Divider } from "react-native-paper";

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
  isWebPlatform: boolean; // New prop to check if we're on web platform

  // Added to track visibility states
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
  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={{ x: 0, y: 0 }}>
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
            // If already visible, close it
            onNavigate();
          } else {
            // If not visible, open it
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
            // If already visible, close it
            onZoom();
          } else {
            // If not visible, open it
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
            // If already visible, close it
            onToneChange();
          } else {
            // If not visible, open it
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
