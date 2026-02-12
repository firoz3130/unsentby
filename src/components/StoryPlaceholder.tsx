import { useEffect, useState } from "react";
import StoryReactions from "./StoryReactions";

type Props = {
  content: string;
  placeholders: string[];
  promptText?: string;
  storySlug: string;  // Add this prop
};

export default function StoryPlaceholder({
  content,
  placeholders,
  promptText,
  storySlug,  // Add this
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const initial: Record<string, string> = {};
    placeholders.forEach((p) => (initial[p] = ""));
    setValues(initial);
  }, [placeholders]);

  function renderContent() {
    let result = content;

    Object.entries(values).forEach(([key, val]) => {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      result = result.replace(regex, val || `{${key}}`);
    });

    return result;
  }

  // Split prompt text into main and disclaimer
  function splitPromptText(text: string) {
    if (!text) {
      return { mainText: "Personalize this story 💫", disclaimer: null };
    }

    const disclaimerMatch = text.match(/Disclaimer:\s*(.*)/i);

    if (disclaimerMatch) {
      const mainText = text.replace(/Disclaimer:.*$/i, "").trim();
      const disclaimer = disclaimerMatch[1].trim();
      return { mainText: mainText || "Personalize this story 💫", disclaimer };
    }

    return { mainText: text, disclaimer: null };
  }

  const { mainText, disclaimer } = splitPromptText(promptText || "");

  return (
    <>
      {showPrompt && (
        <div className="placeholder-modal">
          <div className="modal-card">
            <p className="modal-title">
              {mainText}
            </p>

            {disclaimer && (
              <p className="modal-disclaimer">
                {disclaimer}
              </p>
            )}

            <div className={`input-container ${disclaimer ? "with-disclaimer" : ""}`}>
              {placeholders.map((p) => (
                <div key={p} className="input-group">
                  <label htmlFor={`input-${p}`} className="input-label">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                  <input
                    id={`input-${p}`}
                    type="text"
                    placeholder={`Enter ${p}...`}
                    value={values[p] || ""}
                    onChange={(e) =>
                      setValues({ ...values, [p]: e.target.value })
                    }
                    className="modal-input"
                  />
                </div>
              ))}
            </div>

            <button
              disabled={Object.values(values).some((v) => !v.trim())}
              onClick={() => setShowPrompt(false)}
              className="modal-button"
            >
              Read Story ✨
            </button>
          </div>
        </div>
      )}

      {!showPrompt && (
        <>
          <article className="story-content">
            {renderContent()
              .split("\n")
              .map((line, i) => (
                <p key={i}>{line}</p>
              ))}
          </article>

          <StoryReactions storyId={storySlug} />
        </>
      )}
    </>
  );
}