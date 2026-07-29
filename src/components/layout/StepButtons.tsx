import { Button, Spinner } from "reactstrap";
type Step = 1 | 2 | 3 | 4;
export default function StepButtons({
  step,
  loading,
  onBack,
  disabled,
  submitLabel,
}: {
  step: Step;
  loading: boolean;
  onBack: () => void;
  disabled?: boolean;
  submitLabel?: string;
}) {
  const isLast = step === 4;

  return (
    <div className="d-flex gap-2 mt-3">
      {step > 1 && (
        <Button
          color="outline-secondary"
          type="button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </Button>
      )}
      <Button
        color="primary"
        type="submit"
        className="flex-grow-1"
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            Saving...
          </>
        ) : isLast ? (
          (submitLabel ?? "Save Patient")
        ) : (
          "Continue →"
        )}
      </Button>
    </div>
  );
}
