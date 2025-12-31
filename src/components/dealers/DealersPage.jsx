"use client";

import Advertisement from "../home/Advertisement";
import AskAssistance from "../home/AskAssistance";
import OurMission from "../home/OurMission";
import Stories from "../home/Stories";
import BharosaOfCarosa from "../seller/BharosaOfCarosa";
import CarosaWork from "../seller/CarosaWork";
import ChoseCarosa from "../seller/ChoseCarosa";
import DealersBanner from "./DealersBanner";
import WhychooseCarosa from "./WhychooseCarosa";


function DealersPage() {
  return (
    <>
      <DealersBanner />
      <Advertisement />
      <WhychooseCarosa/>
      <CarosaWork />
      <BharosaOfCarosa />
      <Stories />
      <OurMission />
      <AskAssistance />
    </>
  )
}

export default DealersPage;
