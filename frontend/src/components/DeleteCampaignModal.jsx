export default function DeleteCampaignModal({
  open,
  campaignTitle,
  loading,
  error,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-campaign-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-xl border border-red-500/40 bg-dark-card/95 p-8 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/80 to-transparent" />

        <h2
          id="delete-campaign-title"
          className="font-orbitron text-xl text-text-primary mb-2 tracking-wide"
        >
          Confirm Deletion
        </h2>

        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          Are you sure you want to delete this campaign?
        </p>

        {campaignTitle && (
          <p className="font-mono text-xs text-red-300/90 mb-4 truncate">
            {campaignTitle}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-950/50 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-dark-border px-4 py-3 font-orbitron text-sm text-text-secondary
                       hover:border-text-muted hover:text-text-primary transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg border border-red-500/50 bg-red-600/90 px-4 py-3 font-orbitron text-sm font-bold text-white
                       shadow-[0_0_20px_rgba(239,68,68,0.45)] hover:bg-red-500 hover:shadow-[0_0_28px_rgba(239,68,68,0.6)]
                       transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
