import { useState } from "react";

type Props = {
  storyId: string;
};

export default function StoryReactions({ storyId }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    love: 0,
    sad: 0,
    twist: 0,
  });

  function react(type: "love" | "sad" | "twist") {
    if (selected) return; // prevent multiple reactions

    setSelected(type);
    setCounts((c) => ({ ...c, [type]: c[type] + 1 }));

    // Later: send to backend / Notion
    console.log("Reacted:", type, "for story:", storyId);
  }

  return (
    <div className="story-reactions-container">
      <div className="reactions-label">How did this story make you feel?</div>
      
      <div className="story-reactions">
        <button
          className={`reaction-btn ${selected === "love" ? "active" : ""}`}
          onClick={() => react("love")}
          disabled={selected !== null && selected !== "love"}
          title="Loved it"
        >
          <span className="reaction-emoji">❤️</span>
          <span className="reaction-text">Loved it</span>
          <span className="reaction-count">{counts.love}</span>
        </button>

        <button
          className={`reaction-btn ${selected === "sad" ? "active" : ""}`}
          onClick={() => react("sad")}
          disabled={selected !== null && selected !== "sad"}
          title="Sad"
        >
          <span className="reaction-emoji">😢</span>
          <span className="reaction-text">Sad</span>
          <span className="reaction-count">{counts.sad}</span>
        </button>

        <button
          className={`reaction-btn ${selected === "twist" ? "active" : ""}`}
          onClick={() => react("twist")}
          disabled={selected !== null && selected !== "twist"}
          title="Plot twist"
        >
          <span className="reaction-emoji">🤯</span>
          <span className="reaction-text">Plot twist</span>
          <span className="reaction-count">{counts.twist}</span>
        </button>
      </div>
    </div>
  );
}