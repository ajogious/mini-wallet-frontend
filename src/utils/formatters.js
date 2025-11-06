export const formatAmount = (value) => {
  if (!value) return "";

  // Remove existing commas and non-digit characters except decimal
  const cleaned = value.toString().replace(/[^\d.]/g, "");

  const parts = cleaned.split(".");
  let wholePart = parts[0];
  let decimalPart = parts[1] || "";

  // Limit decimal to 2 places
  if (decimalPart.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  }

  // Format whole number part
  if (wholePart) {
    wholePart = parseInt(wholePart, 10).toLocaleString("en-US");
  }

  let formatted = wholePart;
  if (decimalPart) {
    formatted += `.${decimalPart}`;
  }

  return formatted;
};

export const parseAmount = (formattedValue) => {
  return formattedValue.replace(/,/g, "");
};
