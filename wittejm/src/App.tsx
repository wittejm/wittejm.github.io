import { HelpOutline } from "@mui/icons-material";
import { Button, Checkbox, Tooltip } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import "./App.css";
import { FieldEntry } from "./FieldEntry";
import {
  fillAndDownloadFeeWaiver,
  fillAndDownloadStatewidePacket,
} from "./fillAndDownload";
import validate, { INITIAL_INVALID_STATE } from "./validate";

const COUNTIES = [
  "",
  "Baker",
  "Benton",
  "Clackamas",
  "Clatsop",
  "Columbia",
  "Coos",
  "Crook",
  "Curry",
  "Deschutes",
  "Douglas",
  "Gilliam",
  "Grant",
  "Harney",
  "Hood River",
  "Jackson",
  "Jefferson",
  "Josephine",
  "Klamath",
  "Lake",
  "Lane",
  "Lincoln",
  "Linn",
  "Malheur",
  "Marion",
  "Morrow",
  "Multnomah",
  "Polk",
  "Sherman",
  "Tillamook",
  "Umatilla",
  "Union",
  "Wallowa",
  "Wasco",
  "Washington",
  "Wheeler",
  "Yamhill",
];

type Field = {
  id: string;
  label: string;
  required?: boolean;
  validation?: (arg: any, fieldState: any) => boolean;
  selectionList?: string[];
  petitionFields?: string[];
  feeWaiverFields?: string[];
  statewidePacketFields?: string[];
  checkbox?: boolean;
  disabled?: (arg0: any) => boolean;
  tooltip?: string;
};

export const FIELDS: Field[] = [
  // VITALS (1 to 6)
  {
    id: "county",
    label: "Filing County",
    selectionList: COUNTIES,
    required: true,
    feeWaiverFields: ["IN THE CIRCUIT COURT OF THE STATE OF OREGON"],
    statewidePacketFields: ["FOR THE COUNTY OF"],
    tooltip:
      "If seeking a name change only, file in the county you live in. If you are changing your gender, or both your name and gender, you can file in any county",
  },
  {
    id: "fullname",
    label: "Name (First Middle Last)",
    required: true,
    feeWaiverFields: [
      "PlaintiffPetitioner",
      "DefendantRespondent",
      "Name printed",
    ],
    statewidePacketFields: ["Petitioner current name"],
  },
  {
    id: "dob",
    label: "DOB (MM/DD/YYYY)",
    required: true,
    validation: (value: string) => {
      return moment(value, "M/D/YYYY", true).isValid();
    },
    feeWaiverFields: ["Date of Birth monthday year"],
  },
  {
    id: "streetAddress",
    label: "Street Address",
    required: true,
    feeWaiverFields: ["Name printed"],
    statewidePacketFields: ["Contact Address"],
  },
  {
    id: "cityStateZip",
    label: "City, State, Zip",
    required: true,
    feeWaiverFields: [],
    statewidePacketFields: ["City State ZIP"],
  },
  {
    id: "phone",
    label: "Contact Phone",
    required: true,
    feeWaiverFields: [],
    statewidePacketFields: ["Contact Phone"],
  },

  // CHANGES (7 to 13)
  {
    id: "changeOfName",
    label: "Change of Name",
    checkbox: true,
    statewidePacketFields: [
      "NAME",
      "changing my name use complete names First Middle Last",
    ],
  },
  {
    id: "newFirstName",
    label: "New First Name",
    statewidePacketFields: ["First"],
    disabled: (fieldState) => !fieldState.changeOfName,
  },
  {
    id: "newMiddleName",
    label: "New Middle Name",
    statewidePacketFields: ["Middle"],
    disabled: (fieldState) => !fieldState.changeOfName,
  },
  {
    id: "newLastName",
    label: "New Last Name",
    statewidePacketFields: ["Last"],
    disabled: (fieldState) => !fieldState.changeOfName,
  },
  {
    id: "changeOfSex",
    label: "Change of Sex",
    checkbox: true,
    statewidePacketFields: ["SEX", "changing my legal sex"],
  },
  {
    id: "gender",
    label: "New Gender",
    statewidePacketFields: [
      "I have undergone surgical hormonal or other treatment appropriate to me for",
    ],
    selectionList: ["", "male", "female", "nonbinary"],
    disabled: (fieldState) => !fieldState.changeOfSex,
    validation: (value, fieldState) => !fieldState.changeOfSex || value !== "",
  },

  // REQUIRED REPORTING (13 to 30)
  {
    id: "iOweChildSupport",
    label: "I owe child support",
    statewidePacketFields: [
      "I owe child support arrears or am currently ordered to pay child support",
    ],
    checkbox: true,
    tooltip: `"I owe child support arrears or am currently ordered to pay child support"`,
  },

  {
    id: "iOweChildSupportInfo",
    label: "Explanation:",
    statewidePacketFields: ["child support info"],
    disabled: (fieldState) => !fieldState.iOweChildSupport,
    tooltip: "include state and case numbers if applicable",
  },
  {
    id: "restrainingOrder",
    label: "Orders against me",
    statewidePacketFields: [
      "I have a protective order stalking order or restraining order in effect against me",
    ],
    checkbox: true,
    tooltip:
      "I have a protective order, stalking order, or restraining order in effect against me",
  },
  {
    id: "restrainingOrderInfo",
    label: "Explanation:",
    statewidePacketFields: ["1"],
    disabled: (fieldState) => !fieldState.restrainingOrder,
    tooltip: "include state and case numbers if applicable",
  },

  {
    id: "probation",
    label: "Probation/Parole",
    statewidePacketFields: [
      "I am currently on probation parole or under postprison supervision",
    ],
    checkbox: true,
    tooltip: `I am currently on probation, parole, or under post-prison supervision`,
  },

  {
    id: "probationInfo",
    label: "Explanation:",
    statewidePacketFields: ["2"],
    disabled: (fieldState) => !fieldState.probation,
    tooltip: "include state and case numbers if applicable",
  },
  {
    id: "sexOffender",
    label: "I am required to register as a sex offender",
    statewidePacketFields: ["I am required to register as a sex offender"],
    checkbox: true,
  },
  {
    id: "sexOffenderInfo",
    label: "Explanation:",
    statewidePacketFields: ["sex offender info"],
    disabled: (fieldState) => !fieldState.sexOffender,
    tooltip: "include state and case numbers if applicable",
  },
  {
    id: "formerNames",
    label: "I have formerly used the following names",
    statewidePacketFields: [
      "I have formerly used the following names include all names you have used whether",
    ],
    checkbox: true,
    tooltip: "Either legally or by custom",
  },
  {
    id: "formerName1",
    label: "Former Name 1",
    statewidePacketFields: ["legally or used by custom 1"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "formerName2",
    label: "Former Name 2",
    statewidePacketFields: ["legally or used by custom 2"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "formerName3",
    label: "Former Name 3",
    statewidePacketFields: ["legally or used by custom 3"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "formerName4",
    label: "Former Name 4",
    statewidePacketFields: ["1_2"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "formerName5",
    label: "Former Name 5",
    statewidePacketFields: ["2_2"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "formerName6",
    label: "Former Name 6",
    statewidePacketFields: ["3"],
    disabled: (fieldState) => !fieldState.formerNames,
  },
  {
    id: "sealed",
    label: "I ask that this record be SEALED by the court because:",
    statewidePacketFields: [
      "I ask that this record be SEALED by the court because check all that apply",
    ],
    checkbox: true,
    tooltip: "Must select one of the two options below",
    validation: (value, fieldState) => {
      return (
        (!value &&
          !fieldState.requestChangeOfSexSealed &&
          !fieldState.addressConfidentiality) ||
        (value &&
          fieldState.addressConfidentiality !==
            fieldState.requestChangeOfSexSealed)
      );
    },
  },
  {
    id: "addressConfidentiality",
    label:
      "I am a participant in the Address Confidentiality Program under ORS 192.826",
    statewidePacketFields: [
      "I am a participant in the Address Confidentiality Program under ORS 192826",
    ],
    checkbox: true,
    disabled: (fieldState) => !fieldState.sealed,
  },
  {
    id: "requestChangeOfSexSealed",
    label: "I am requesting a change of sex and I want the record to be sealed",
    statewidePacketFields: [
      "I am requesting a change of sex and I want the record to be sealed",
    ],
    checkbox: true,
    disabled: (fieldState) => !fieldState.sealed,
  },

  // WAIVER ELIGIBILITY
  {
    id: "snap",
    label: "Monthly income from SNAP ",
    feeWaiverFields: ["undefined_2"],
  },
  {
    id: "ssi",
    label: "Monthly income from SSI",
    feeWaiverFields: ["undefined_3"],
    tooltip: "Supplemental Security Income",
  },
  {
    id: "tanf",
    label: "Monthly income from TANF",
    feeWaiverFields: ["undefined_4"],
    tooltip: "Temporary Assistance for Needy Families",
  },
  {
    id: "ohp",
    label: "Enrolled in Oregon Health Plan",
    feeWaiverFields: [],
    checkbox: true,
  },
  {
    id: "numberInHousehold",
    label: "Number of people in household",
    required: true,
    feeWaiverFields: ["Number of people living in your household 1"],
  },
  {
    id: "totalMonthlyIncomeJobs",
    label: "Average monthly income from all jobs $",
    feeWaiverFields: [
      "Total monthly income from all jobs before taxes are taken out",
    ],
    tooltip: `"Total average monthly income from all jobs before taxes are taken out"`,
  },
  {
    id: "totalMonthlyIncomeOther",
    label: "Monthly income from all other sources $",
    feeWaiverFields: ["Total monthly income from other sources"],
    tooltip:
      "Total including annuities, settlement income, and any other source of funds or support)",
  },
  {
    id: "totalCash",
    label: "Total cash available from all accounts $",
    feeWaiverFields: ["Total cash available from all accounts"],
  },
  {
    id: "otherAssets",
    label: "List all assets",
    feeWaiverFields: ["interests etc 1"],
    tooltip:
      "List any assets you have including vehicles, real estate, boats, guns, jewelry, livestock, business interests, etc.",
  },
  {
    id: "valueOtherAssets",
    label: "Total Value of assets $",
    feeWaiverFields: ["Value of assets"],
  },
  {
    id: "homeExpenses",
    label: "Living Expenses Per Month $",
    feeWaiverFields: ["LIVING EXPENSES per month"],
    tooltip: "Rent, mortgage, utilities, cell phone, food",
  },
  {
    id: "transportationExpenses",
    label: "Transportation $",
    feeWaiverFields: ["Rent mortgage utilities cell phone food"],
    tooltip: "Parking, gas, bus, insurance, vehicle loan payments",
  },
  {
    id: "otherExpenses",
    label: "All Other Monthly Expenses $",
    feeWaiverFields: ["parking gas bus insurance vehicle loan payments"],
    tooltip:
      "Student loans, day care, court fines, medical, child support, credit cards, etc.",
  },
  {
    id: "otherInformation",
    label: "Other information you want the court to consider",
    feeWaiverFields: ["7 OTHER INFORMATION YOU WANT COURT TO CONSIDER 1"],
  },
];

const INITIAL_FIELD_STATE = {
  fullname: "",
  county: "",
  streetAddress: "",
  cityStateZip: "",
  phone: "",
  dob: "",
  changeOfName: false,
  changeOfSex: false,
  newFirstName: "",
  newMiddleName: "",
  newLastName: "",
  gender: "",
  iOweChildSupport: false,
  iOweChildSupportInfo: "",
  restrainingOrder: false,
  restrainingOrderInfo: "",
  probation: false,
  probationInfo: "",
  sexOffender: false,
  sexOffenderInfo: "",
  formerNames: false,
  formerName1: "",
  formerName2: "",
  formerName3: "",
  formerName4: "",
  formerName5: "",
  formerName6: "",
  sealed: false,
  addressConfidentiality: false,
  requestChangeOfSexSealed: false,
  numberInHousehold: "",
  snap: "",
  ssi: "",
  tanf: "",
  ohp: false,
  totalMonthlyIncomeJobs: "",
  totalMonthlyIncomeOther: "",
  totalCash: "",
  otherAssets: "",
  valueOtherAssets: "",
  homeExpenses: "",
  transportationExpenses: "",
  otherExpenses: "",
  otherInformation: "",
};

const DEMO_INITIAL_FIELD_STATE = {
  fullname: "Quinn Doe",
  county: "",
  streetAddress: "123 fake st.",
  cityStateZip: "Portland OR 97233",
  phone: "1234567890",
  dob: "1/1/2000",
  changeOfName: true,
  changeOfSex: true,
  newFirstName: "Fern",
  newMiddleName: "Apollo",
  newLastName: "Quinn",
  gender: "",
  iOweChildSupport: true,
  iOweChildSupportInfo: "CASE # 123456789",
  restrainingOrder: true,
  restrainingOrderInfo: "CASE # 234567890",
  probation: true,
  probationInfo: "CASE # 123456789",
  sexOffender: true,
  sexOffenderInfo: "CASE # 234567890",
  formerNames: true,
  formerName1: "former lastName1",
  formerName2: "former lastName2",
  formerName3: "former lastName3",
  formerName4: "former lastName4",
  formerName5: "former lastName5",
  formerName6: "former lastName6",
  sealed: true,
  addressConfidentiality: false,
  requestChangeOfSexSealed: true,
  numberInHousehold: "4",
  snap: "200",
  ssi: "",
  tanf: "100",
  ohp: true,
  totalMonthlyIncomeJobs: "1000",
  totalMonthlyIncomeOther: "150",
  totalCash: "500",
  otherAssets: "car, some boxes of stuff",
  valueOtherAssets: "1200",
  homeExpenses: "400",
  transportationExpenses: "300",
  otherExpenses: "200",
  otherInformation: "Hey please give this to me",
};

function App() {
  const [fieldState, setFieldState] = useState<any>(INITIAL_FIELD_STATE);
  const [invalidState, setInvalidState] = useState<any>(INITIAL_INVALID_STATE);
  const [anyInputsInvalid, setAnyInputsInvalid] = useState(false);
  const [isValidationDisabled, setIsValidationDisabled] = useState(false);
  const handleChange = (e: React.BaseSyntheticEvent) => {
    setFieldState((oldState: any) => {
      return {
        ...oldState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleCheckboxChange = (fieldId: string) => {
    setFieldState((oldState: any) => {
      return {
        ...oldState,
        [fieldId]: !oldState[fieldId],
      };
    });
  };
  const handleFeeWaiverSubmit = () => {
    if (
      !isValidationDisabled &&
      !validate("feeWaiver", fieldState, setInvalidState, setAnyInputsInvalid)
    )
      return;
    fillAndDownloadFeeWaiver(fieldState);
  };
  const handleStatewidePacketSubmit = () => {
    if (
      !isValidationDisabled &&
      !validate(
        "statewidePacket",
        fieldState,
        setInvalidState,
        setAnyInputsInvalid,
      )
    )
      return;
    fillAndDownloadStatewidePacket(fieldState);
  };

  return (
    <div className="App">
      <h2>Name & Gender Change</h2>
      <div className="row">
        <div>
          <form>
            <h3>Vitals</h3>
            {FIELDS.slice(0, 6).map((field) => {
              return (
                <FieldEntry
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  checkbox={field.checkbox}
                  selectionList={field.selectionList}
                  disabled={field.disabled}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  fieldState={fieldState}
                  invalidState={invalidState}
                  tooltip={field.tooltip}
                  key={field.id}
                />
              );
            })}
            <h3>New Name and/or Gender</h3>
            {FIELDS.slice(6, 12).map((field) => {
              return (
                <FieldEntry
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  checkbox={field.checkbox}
                  selectionList={field.selectionList}
                  disabled={field.disabled}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  fieldState={fieldState}
                  invalidState={invalidState}
                  tooltip={field.tooltip}
                  key={field.id}
                />
              );
            })}
            <h3>Required Reporting</h3>
            {FIELDS.slice(12, 30).map((field) => {
              return (
                <FieldEntry
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  checkbox={field.checkbox}
                  selectionList={field.selectionList}
                  disabled={field.disabled}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  fieldState={fieldState}
                  invalidState={invalidState}
                  tooltip={field.tooltip}
                  key={field.id}
                />
              );
            })}
            <h3>
              {" "}
              <Tooltip
                title={
                  <span className="tooltipText">
                    <div>
                      There is a $124 filing fee for this motion. If the client
                      is low-income, they may qualify for a fee waiver.
                      "Low-Income" is up to the discretion of the judge but
                      based on having an income below %133 of the federal povery
                      line. If a client is close or the fee would be a hardship,
                      they should fill out the below
                    </div>
                    <div>
                      <div>By household size:</div>
                      <div>1: $1,616/month ($19,391/year)</div>
                      <div>2: $2,186/month ($26,228/year)</div>
                      <div>3: $2,755/month ($33,064/year)</div>
                      <div>4: $3,325/month ($39,900/year)</div>
                    </div>
                    <div>
                      <a
                        className="link"
                        href="https://aspe.hhs.gov/sites/default/files/documents/f7117d0642f0eeeb102c9b2c264f1aa2/detailed-guidelines-2023.xlsx"
                      >
                        Federal poverty guidelines
                      </a>
                    </div>
                  </span>
                }
              >
                <span className="iconSpan">
                  <HelpOutline className="myIcon" />
                </span>
              </Tooltip>{" "}
              Waiver Requirements
            </h3>
            {FIELDS.slice(30, 35).map((field) => {
              return (
                <FieldEntry
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  checkbox={field.checkbox}
                  selectionList={field.selectionList}
                  disabled={field.disabled}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  fieldState={fieldState}
                  invalidState={invalidState}
                  tooltip={field.tooltip}
                  key={field.id}
                />
              );
            })}
            <h4>Monthly incomes & expenses for all members of household</h4>
            {FIELDS.slice(35).map((field) => {
              return (
                <FieldEntry
                  id={field.id}
                  label={field.label}
                  required={field.required}
                  checkbox={field.checkbox}
                  selectionList={field.selectionList}
                  disabled={field.disabled}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  fieldState={fieldState}
                  invalidState={invalidState}
                  tooltip={field.tooltip}
                  key={field.id}
                />
              );
            })}
          </form>
        </div>
        <div>
          <div className="card">
            <button onClick={() => handleStatewidePacketSubmit()}>
              Download Statewide Packet
            </button>
          </div>
          <div className="card">
            <button onClick={() => handleFeeWaiverSubmit()}>
              Download Fee Waiver
            </button>
          </div>
          {anyInputsInvalid && (
            <div className="pleaseComplete">
              Please complete all highlighted fields
            </div>
          )}
        </div>
      </div>
      {/*
      <div>
        <Button
          variant="contained"
          onClick={() => setFieldState(DEMO_INITIAL_FIELD_STATE)}
        >
          Populate fields
        </Button>
      </div>
      <div>
        <Checkbox
          value={isValidationDisabled}
          onChange={() => setIsValidationDisabled((oldState) => !oldState)}
        />{" "}
        Disable Validation
      </div>
      */}
    </div>
  );
}

export default App;
