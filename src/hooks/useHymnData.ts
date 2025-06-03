import { useState, useEffect } from "react";
import { HymnModel, Stanza, Score } from "../domain/HymnModel";
import HymnService from "../services/Hymn/HymnService";

const updateWithRef = (score: Score, stanza: Stanza) => {
  if (!stanza.ref) return;
  const match = stanza.ref.match(/score\.stanzas\[(\d+)\]/);
  if (match && match[1]) {
    const index = parseInt(match[1], 10);
    const stanzaRef = score.stanzas[index];
    if (stanzaRef) {
      stanza.code = stanzaRef.code;
      stanza.text = stanzaRef.text;
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
        score.stanzas.forEach((stanza: Stanza) => {
          if (stanza.type === "ref") {
            updateWithRef(score, stanza);
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
    setHymn(updatedHymn);
    setTitle(`${updatedHymn.code} - ${updatedHymn.title}`);
  };

  return { hymn, title, updateHymn };
};

export default useHymnData;
