import type { InputHTMLAttributes } from "react";
import { Input } from "../Input/Input";
import styles from "./RangeInput.module.css";

export type Props = {
  from?: string;
  to?: string;
  onFromChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  onToChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  fromPlaceholder?: string;
  toPlaceholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function RangeInput({
  from,
  to,
  onFromChange,
  onToChange,
  fromPlaceholder = "От",
  toPlaceholder = "До",
  min,
  max,
  step,
  disabled = false,
  error = false,
  className = "",
}: Props) {
  return (
    <div className={`${styles.range} ${className}`}>
      <Input
        type="number"
        value={from ?? ""}
        onChange={onFromChange}
        placeholder={fromPlaceholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        error={error}
        aria-label={fromPlaceholder}
      />

      <span className={styles.separator} aria-hidden="true">
        —
      </span>

      <Input
        type="number"
        value={to ?? ""}
        onChange={onToChange}
        placeholder={toPlaceholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        error={error}
        aria-label={toPlaceholder}
      />
    </div>
  );
}
