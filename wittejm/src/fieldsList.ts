export const feeWaiverCheckboxList = [
  "plaintiffpetitioner", // CHECKED "I am the plaintiff"
  "defendantrespondent", // BLANK
  "other", // BLANK
  "Filing fee for", // CHECKED
  "PetitionComplaintClaim", // BLANK
  "ResponseAnswer", // BLANK
  "Motion or", // BLANK
  "name of document", // BLANK
  "Settlement conference arbitration or trial fee", // BLANK
  "Sheriffs service fee explain why you cannot find another person to serve papers Service", // BLANK
  "No", // CHECKED "I am not represented by an attorney"
  "Yes Name", // BLANK
  "Food Stamps SNAPSupplemental Nutrition Assistance Program", // CHECKED IF SNAP VALUE IS NONZERO
  "Supplemental Security Income SSI", // CHECKED IF SSI VALUE IS NONZERO
  "Temporary Assistance to Needy Families TANF", // CHECKED IF TANF VALUE IS NONZERO
  "Oregon Health Plan OHP", // OPTIONAL
  "Filing Fee", // CHECKED
  "Arbitration Fee", // BLANK
  "Other describe", // BLANK
  "Sheriffs service fee", // BLANK
  "Trial Fee", // BLANK
  "Motion Fee", // BLANK
  "DOES qualify for a deferral or waiver of fees", // BLANK
  "DOES NOT qualify for a deferral or waiver of fees", // BLANK
  "Determination of fee obligation is postponed at this time No payment is due from the", // BLANK
  "Fees are deferred for full payment Payment must be made according to the terms of the", // BLANK
  "Fees are waived The court may change or revoke this waiver at a later time", // BLANK
  "Application is denied", // BLANK
  "Application is granted in part", // BLANK
  "Submitted by", // CHECKED
  "plaintiffpetitioner_2", // BLANK
  "defendantrespondent_2", // BLANK
];

export const statewidePacketCheckboxList = [
  "changing my name use complete names First Middle Last",
  "changing my legal sex",
  "I owe child support arrears or am currently ordered to pay child support",
  "I have a protective order stalking order or restraining order in effect against me",
  "I am currently on probation parole or under postprison supervision",
  "I am required to register as a sex offender",
  "I have formerly used the following names include all names you have used whether",
  "I ask that this record be SEALED by the court because check all that apply",
  "I am a participant in the Address Confidentiality Program under ORS 192826",
  "I am requesting a change of sex and I want the record to be sealed",
  "This record is ordered SEALED at Petitioners request because",
  "Petitioner is a participant in the ORS 192826 Address Confidentiality Program ACP",
  "Petitioner has requested a change of sex and that the record be sealed",
  "Petitioner is a participant in the Address Confidentiality Program ACP and has requested",
  "Petitioners name is changed use complete names First Middle Last",
  "Petitioners legal sex is changed to",
  "male_2",
  "female_2",
  "nonbinary_2",
  "NAME",
  "SEX",
  // radio:
  "I have undergone surgical hormonal or other treatment appropriate to me for",
];
/*
form.getFields().forEach((field) => {
  if (
    [].includes(field.getName())
  ) {
    const myField = form.getCheckBox(field.getName());
    //myField.check();
  } else if (
    [
      "I have undergone surgical hormonal or other treatment appropriate to me for",
    ].includes(field.getName())
  ) {
    const myField = form.getRadioGroup(field.getName());
    //myField.select("male");
  } else {
    const myField = form.getTextField(field.getName());
    console.log("2:", field.getName());
    myField.setText(field.getName());
  }
});
*/
