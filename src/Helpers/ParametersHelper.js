export const getApiEditPoint = (parameterId) => {
  let apiEndpoint = "";
  switch (parameterId) {
    case "PN":
      apiEndpoint = "program-name/";
      break;
    case "ET":
      apiEndpoint = "experiment-type/";
      break;
    case "GCL":
      apiEndpoint = "general-cell-line/";
      break;
    case "DEVICE":
      apiEndpoint = "device/";
      break;
    default:
      null;
  }
  return apiEndpoint;
};
