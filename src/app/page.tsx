import ContractInfo from "./componets/ContractInfo";
import Contracts from "./componets/Contracts";
import Nav from "./componets/Layout/Nav";
import OperationPanel from "./componets/OperationPanel";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="flex h-[calc(100vh-112px)] overflow-hidden">
        <div className="w-[420px] ">
          <Contracts />
        </div>
        <div className="grow border-l border-gray-200 bg-gray-50 p-4 flex flex-col">
          <ContractInfo />
          <OperationPanel />
        </div>
      </div>
    </>
  );
}
