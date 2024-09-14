// import Connection from "./componets/Connection";
import Contracts from "./componets/Contracts";
import Nav from "./componets/Layout/Nav";


export default function Home() {
  return (
    <>
      <Nav />
      <div className="flex h-[calc(100vh-112px)]">
        <div className="w-[420px] ">
          {/* <Connection /> */}
          <Contracts />

        </div>
        <div className="grow border-l border-gray-200 bg-gray-50"></div>
      </div>
    </>
  );
}
