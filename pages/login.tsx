import {Login} from "@module/login";

const isServer = () => typeof window === `undefined`;

export default function LoginComponent(): JSX.Element {
  return <div className="w-full">{!isServer() && <Login />}</div>;
}
