import { Checkbox } from "@mui/material";

type Props = {
  id: string;
  label: string;
  selectionList?: string[];
  checkbox?: boolean;
  handleChange: (e: any) => void;
  handleCheckboxChange: (e: any) => void;
  fieldState: any;
  invalidState: any;
  disabled?: boolean;
};

export function InputField({
  id,
  label,
  selectionList,
  checkbox,
  handleChange,
  handleCheckboxChange,
  fieldState,
  invalidState,
  disabled,
}: Props) {
  return selectionList ? (
    <select
      id={id}
      className={`${invalidState[id] ? "invalidInput" : ""} fieldInput`}
      onChange={handleChange}
      disabled={disabled}
    >
      {selectionList.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  ) : checkbox ? (
    <Checkbox
      size="medium"
      onChange={() => handleCheckboxChange(id)}
      checked={fieldState[id] as boolean}
      disabled={disabled}
      style={
        invalidState[id]
          ? {
              borderWidth: "2px",
              borderColor: "darkred",
              borderStyle: "solid",
            }
          : {}
      }
    />
  ) : (
    <input
      id={id}
      className={`${invalidState[id] ? "invalidInput" : ""} ${
        checkbox ? "checkbox" : "fieldInput"
      }`}
      name={label}
      type={checkbox ? "checkbox" : "text"}
      required={true}
      onChange={handleChange}
      value={fieldState[id]}
      checked={checkbox && fieldState[id]}
      disabled={disabled}
    />
  );
}
