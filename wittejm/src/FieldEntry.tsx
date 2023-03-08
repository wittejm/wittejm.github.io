import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { InputField } from "./InputField";

type Props = {
  id: string;
  label: string;
  selectionList?: string[];
  checkbox?: boolean;
  handleChange: (e: any) => void;
  handleCheckboxChange: (e: any) => void;
  fieldState: any;
  invalidState: any;
  disabled?: (arg0: any) => boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
};

export function FieldEntry({
  id,
  label,
  selectionList,
  checkbox,
  required,
  handleChange,
  handleCheckboxChange,
  fieldState,
  invalidState,
  disabled,
  tooltip,
}: Props) {
  return (
    <div key={`field-${id}`} className="row">
      <div className="fieldLabel">
        {tooltip && (
          <Tooltip title={<span className="tooltipText">{tooltip}</span>}>
            <span className="iconSpan">
              <HelpOutline className="myIcon" />
            </span>
          </Tooltip>
        )}
        <span
          className={`fieldLabelText ${invalidState[id] ? "invalidInput" : ""}`}
        >
          {label} {required && <span className="requiredAsterisk">*</span>}
        </span>
      </div>
      <div>
        <InputField
          id={id}
          label={label}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          fieldState={fieldState}
          invalidState={invalidState}
          disabled={disabled ? disabled(fieldState) : false}
          selectionList={selectionList}
          checkbox={checkbox}
        />
      </div>
    </div>
  );
}
