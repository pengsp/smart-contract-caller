import Contracts from "./componets/Contracts";
import Card from "./componets/Layout/Card";
import Nav from "./componets/Layout/Nav";
import OperationPanel from "./componets/OperationPanel";

export default function Home() {
  return (
    <>
      <Nav />
      <div className=" h-[calc(100vh-112px)] min-h-[900px] bg-gray-100 p-4 flex flex-col">
        <Card rootClassName="bg-white flex flex-col gap-4 h-full">
          <Contracts />
          <OperationPanel />
        </Card>
      </div>
    </>
  );
}
