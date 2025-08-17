import {IUserLogin} from "@app/types";

export function stringURLToHostname(url: string): string {
  let hostname = "";
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = "";
  }
  return hostname;
}

export function guidGenerator(): string {
  const S4 = (): string => {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export function removeDiacritics(inputString: string) {
  return inputString
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getTitle(data?: IUserLogin) {
  if (data?.firstName === null && data?.lastName === null) {
    return data?.username ?? "";
  }
  return (data?.firstName ?? "") + (data?.lastName ?? "");
}

export function renderLinkShare(data: IUserLogin) {
  if (data.username) {
    return `${window.location.origin}/${data.username}`;
  }
  if (!data.username && data.id) {
    return `${window.location.origin}/${data.id}`;
  }
  return window.location.origin;
}
