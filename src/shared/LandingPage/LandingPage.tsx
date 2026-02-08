import React from "react";
import StartSection from "../../templates/MasterLayoutTemplate/StartSection/StartSection";
import FamilySection from "../../templates/MasterLayoutTemplate/FamilySection/FamilySection";
import MostPopular from "../../templates/MasterLayoutTemplate/MostPopular/MostPopular";
import HomeAds from "../../templates/MasterLayoutTemplate/HomeAds/HomeAds";

export default function LandingPage() {
  return (
    <>
      <StartSection />
      <MostPopular />
      <HomeAds />
      <FamilySection />
    </>
  );
}
