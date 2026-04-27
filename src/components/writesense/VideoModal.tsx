import React, { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  youtubeId?: string;
  title?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function VideoModal({
  open,
  onClose,
  youtubeId,
  title,
  onPrev,
  onNext,
}: Props) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-card">
        <header className="modal-header">
          <div>
            <h3 className="modal-title">{title}</h3>
            <p className="modal-sub">Learn the letter — watch & repeat!</p>
          </div>
          <div className="modal-controls">
            <button
              className="prev-btn"
              onClick={onPrev}
              aria-label="Previous letter"
            >
              ◀
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
            <button
              className="next-btn"
              onClick={onNext}
              aria-label="Next letter"
            >
              ▶
            </button>
          </div>
        </header>

        <div className="modal-body">
          {youtubeId ? (
            <div className="video-wrap">
              <iframe
                title={title}
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="no-video">No video available</div>
          )}
        </div>

        {/* joyful confetti burst (small DOM elements animated via CSS) */}
        <div className="confetti-wrap" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className={`confetti c${i % 6}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
