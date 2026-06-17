import WaveBar from './WaveBar';

type Props = {
  left: string;
  right: string;
  bars?: number;
};

export default function SheetDivider({ left, right, bars = 28 }: Props) {
  return (
    <div className="sheet-divider">
      <span className="sheet-divider__label">{left}</span>
      <div className="sheet-divider__wave">
        <WaveBar bars={bars} size="sm" quiet />
      </div>
      <span className="sheet-divider__label">{right}</span>
    </div>
  );
}
