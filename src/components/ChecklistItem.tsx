type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function ChecklistItem({ label, checked, onChange }: Props) {
  return (
    <label className="check-item">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
