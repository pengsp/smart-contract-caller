// import Connection from "./componets/Connection";
import Contracts from "./componets/Contracts";
import Nav from "./componets/Layout/Nav";


export default function Home() {
  return (
    <>
      <Nav />
      <div className="flex h-[100vh]">
        <div className="w-[420px] ">
          {/* <Connection /> */}
          <Contracts />

        </div>
        <div className="grow border-l border-gray-200"></div>
      </div>
    </>
  );
}
