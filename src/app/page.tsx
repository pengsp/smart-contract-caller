import Contracts from "./componets/Contracts";
import Card from "./componets/Layout/Card";
import Nav from "./componets/Layout/Nav";
import OperationPanel from "./componets/OperationPanel";

export default function Home() {
  return (
    <>
      <Nav />
      <div className=" h-[calc(100vh-100px)] min-h-[900px] bg-gray-100 p-4 flex flex-col bg-[url('/images/bg.jpg')] bg-no-repeat bg-top">
        <Card rootClassName="bg-white/90 flex flex-col gap-4 h-full">
          <Contracts />
          <OperationPanel />
        </Card>
      </div>
    </>
  );
}
