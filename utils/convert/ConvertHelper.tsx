import Config from "@app/config";
import dayjs from "dayjs";

/**
 *
 * @param dataURI
 * @returns {Blob}
 */
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);

  // Separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // Create a view into the buffer
  const ia = new Uint8Array(ab);

  // Set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], {type: mimeString});
}

function convertDateFormat(dateString: string) {
  return dayjs(dateString).format(Config.DATE_TIME_FORMAT);
}

export default {
  dataURItoBlob,
  convertDateFormat,
};
