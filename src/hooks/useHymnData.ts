import { useState, useEffect } from "react";
import { HymnModel, Stanza, Score } from "../domain/HymnModel";
import HymnService from "../services/Hymn/HymnService";

const adjustLyric = (chordStr: string, lyricStr: string) => {
  let adjustedLyric = lyricStr;
  if (chordStr.length > lyricStr.length) {
    for (let i = lyricStr.length; i < chordStr.length; i++) {
      adjustedLyric += chordStr[i] === " " ? " " : "_";
    }
  }
  return adjustedLyric;
};

const adjustChord = (chordStr: string, lyricStr: string) => {
  let adjustedChord = "";
  lyricStr = lyricStr.padEnd(chordStr.length, " ");
  for (let i = 0; i < lyricStr.length; i++) {
    let chordChar = chordStr[i] || " ";
    adjustedChord += lyricStr[i] !== " " && chordChar === " " ? "_" : chordChar;
  }
  return adjustedChord;
};

const updateWithRef = (score: Score, stanza: Stanza) => {
  if (!stanza.ref) return;
  const match = stanza.ref.match(/score\.stanzas\[(\d+)\]/);
  if (match && match[1]) {
    const index = parseInt(match[1], 10);
    const stanzaRef = score.stanzas[index];
    if (stanzaRef) {
      stanza.code = stanzaRef.code;
      stanza.verses = stanzaRef.verses;
      stanza.type = stanzaRef.type;
    }
  }
};

const useHymnData = (hymnCode: string) => {
  const [hymn, setHymn] = useState<HymnModel | null>(null);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      const hymn = await HymnService.getHymn(hymnCode);
      if (hymn && hymn.score) {
        const score = hymn.score;
        score.stanzas.forEach((stanza) => {
          if (stanza.type === "ref") {
            updateWithRef(score, stanza);
          }
          if (["lyric", "chorus"].indexOf(stanza.type) >= 0) {
            stanza.verses?.forEach((verse) => {
              verse.chords = adjustChord(verse.chords || "", verse.lyrics || "");
              verse.lyrics = adjustLyric(verse.chords || "", verse.lyrics || "");
            });
          }
        });
        setHymn(hymn);
        setTitle(`${hymn.code} - ${hymn.title}`);
      } else {
        setTitle(`${hymnCode} - Hymn not found`);
      }
    };
    fetchContent();
  }, [hymnCode]);

  const updateHymn = (updatedHymn: HymnModel) => {
    console.log("updateHymn 1", updatedHymn);
    setHymn(updatedHymn);
    setTitle(`${updatedHymn.code} - ${updatedHymn.title}`);
  };

  return { hymn, title, updateHymn };
};

export default useHymnData;
