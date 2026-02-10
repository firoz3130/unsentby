import { useEffect, useState } from "react";

type Props = {
  content: string;
  placeholders: string[];
  promptText?: string;
};

export default function StoryPlaceholder({
  content,
  placeholders,
  promptText,
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

  return (
    <>
      {showPrompt && (
        <div className="placeholder-modal">
          <div className="modal-card">
            <p className="modal-title">
              {promptText || "Personalize this story 💫"}
            </p>

            {placeholders.map((p) => (
              <input
                key={p}
                placeholder={`Enter ${p}`}
                value={values[p] || ""}
                onChange={(e) =>
                  setValues({ ...values, [p]: e.target.value })
                }
              />
            ))}

            <button
              disabled={Object.values(values).some((v) => !v.trim())}
              onClick={() => setShowPrompt(false)}
            >
              Read Story ✨
            </button>
          </div>
        </div>
      )}

      {!showPrompt && (
        <article className="story-content">
          {renderContent()
            .split("\n")
            .map((line, i) => (
              <p key={i}>{line}</p>
            ))}
        </article>
      )}
    </>
  );
}