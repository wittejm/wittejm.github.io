import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import { FIELDS } from "./App";
import {
  feeWaiverCheckboxList,
  statewidePacketCheckboxList,
} from "./fieldsList";

const FEE_WAIVER_CHECKED_LIST = [
  "plaintiffpetitioner", // CHECKED "I am the plaintiff"
  "Filing fee for",
  "PetitionComplaintClaim",
  "No", // CHECKED "I am not represented by an attorney"
  // "Food Stamps SNAPSupplemental Nutrition Assistance Program", // CHECKED IF SNAP VALUE IS NONZERO
  // "Supplemental Security Income SSI", // CHECKED IF SSI VALUE IS NONZERO
  // "Temporary Assistance to Needy Families TANF", // CHECKED IF TANF VALUE IS NONZERO
  "Filing Fee", // CHECKED
  "Submitted by", // CHECKED
];

export async function fillAndDownloadFeeWaiver(fieldState: any) {
  const formUrl = "https://wittejm.github.io/clearclinic/FeeWaiver.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  FIELDS.forEach((field) => {
    if (field.feeWaiverFields) {
      field.feeWaiverFields.forEach((feeWaiverField) => {
        if (field.checkbox && fieldState[field.id]) {
          field.feeWaiverFields?.forEach((feeWaiverField) =>
            form.getCheckBox(feeWaiverField).check(),
          );
        } else {
          const formField = form.getTextField(feeWaiverField);
          formField.setText(fieldState[field.id]);
        }
      });
    }
  });

  // Always-checked fields:
  FEE_WAIVER_CHECKED_LIST.forEach((field) => form.getCheckBox(field).check());

  /*
  form.getFields().forEach((field) => {
    if (!feeWaiverCheckboxList.includes(field.getName())) {
      const myField = form.getTextField(field.getName());
      myField.setText(field.getName());
    }
  });
  */

  // Compute:
  if (!["", "0"].includes(fieldState.snap.trim())) {
    form
      .getCheckBox("Food Stamps SNAPSupplemental Nutrition Assistance Program")
      .check();
  }
  if (!["", "0"].includes(fieldState.ssi.trim())) {
    form.getCheckBox("Supplemental Security Income SSI").check();
  }
  if (!["", "0"].includes(fieldState.tanf.trim())) {
    form.getCheckBox("Temporary Assistance to Needy Families TANF").check();
  }

  const totalBenefits =
    (fieldState.snap ? parseFloat(fieldState.snap) : 0) +
    (fieldState.tanf ? parseFloat(fieldState.tanf) : 0) +
    (fieldState.ssi ? parseFloat(fieldState.ssi) : 0);

  const totalBenefitsField = form.getTextField(
    "Total monthly benefits received",
  );
  totalBenefitsField.setText(`${totalBenefits.toFixed(2)}`);

  const totalMonthyIncome =
    (fieldState.totalMonthlyIncomeJobs
      ? parseFloat(fieldState.totalMonthlyIncomeJobs)
      : 0) +
    (fieldState.totalMonthlyIncomeOther
      ? parseFloat(fieldState.totalMonthlyIncomeOther)
      : 0);
  const totalIncomeField = form.getTextField("TOTAL INCOME FROM ALL SOURCES");
  totalIncomeField.setText(`${totalMonthyIncome.toFixed(2)}`);

  const totalAssets =
    (fieldState.totalCash ? parseFloat(fieldState.totalCash) : 0) +
    (fieldState.valueOtherAssets ? parseFloat(fieldState.valueOtherAssets) : 0);
  const totalAssetsField = form.getTextField("TOTAL VALUE OF ALL ASSETS  CASH");
  totalAssetsField.setText(`${totalAssets.toFixed(2)}`);

  const totalMonthyExpenses =
    (fieldState.homeExpenses ? parseFloat(fieldState.homeExpenses) : 0) +
    (fieldState.transportationExpenses
      ? parseFloat(fieldState.transportationExpenses)
      : 0) +
    (fieldState.otherExpenses ? parseFloat(fieldState.otherExpenses) : 0);
  const totalExpensesField = form.getTextField(
    "student loans day care court fines medical child support credit cards etc",
  );
  totalExpensesField.setText(`${totalMonthyExpenses.toFixed(2)}`);

  // const signatureField = form.getTextField("Signature");
  // signatureField.setText(`\\s\\ ${fieldState.fullname}`);

  const todaysDateField = form.getTextField("Date");
  todaysDateField.setText(format(new Date(), "MM/dd/yyyy"));

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "feeWaiverFilled.pdf";
  link.click();
}

export async function fillAndDownloadStatewidePacket(fieldState: any) {
  const formUrl = "https://wittejm.github.io/clearclinic/StatewidePacket.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  /*
  form.getFields().forEach((field) => {
    if (!statewidePacketCheckboxList.includes(field.getName())) {
      const myField = form.getTextField(field.getName());
      myField.setText(field.getName());
    }
  });
  */

  FIELDS.forEach((field) => {
    if (field.statewidePacketFields) {
      field.statewidePacketFields.forEach((statewidePacketField) => {
        if (field.checkbox) {
          if (fieldState[field.id]) {
            field.statewidePacketFields?.forEach((statewidePacketField) =>
              form.getCheckBox(statewidePacketField).check(),
            );
          }
        } else if (field.id === "gender") {
          if (fieldState[field.id] !== "") {
            field.statewidePacketFields?.forEach((statewidePacketField) =>
              form
                .getRadioGroup(statewidePacketField)
                .select(fieldState[field.id]),
            );
          }
        } else {
          const formField = form.getTextField(statewidePacketField);
          formField.setText(fieldState[field.id]);
        }
      });
    }
  });

  // const formField = form.getTextField("Signature");
  // formField.setText(`\\s\\ ${fieldState.fullname}`);

  const todaysDateField = form.getTextField("Date");
  todaysDateField.setText(format(new Date(), "MM/dd/yyyy"));

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "statewidePacketFilled.pdf";

  fetch("https://api.jsonbin.io/v3/b/6400e55eebd26539d088234e", {
    headers: {
      "X-Master-Key":
        "$2b$10$quk1lhycAmxU18cAXlnNxedueEUUEB8lXfiuS91bR8spNZt9iy03O",
      "X-Access-Key":
        "$2b$10$gL8Fr6xMF1pO8nH/8tg51eWSBnkgIlM3V.vGCV1Q2wjeAA.Av98CW",
    },
  }).then((response) =>
    response.json().then((jsonRes) => {
      fetch("https://api.jsonbin.io/v3/b/6400e55eebd26539d088234e", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key":
            "$2b$10$quk1lhycAmxU18cAXlnNxedueEUUEB8lXfiuS91bR8spNZt9iy03O",
          "X-Access-Key":
            "$2b$10$gL8Fr6xMF1pO8nH/8tg51eWSBnkgIlM3V.vGCV1Q2wjeAA.Av98CW",
        },
        body: JSON.stringify({ count: jsonRes.record.count + 1 }),
      });
    }),
  );
  link.click();
}
